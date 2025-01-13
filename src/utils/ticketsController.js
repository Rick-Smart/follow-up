import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import { getCurrentUser } from "./authController";

// Get all tickets with optional filters
export const getAllTickets = async (filters = {}) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketsRef = collection(fireStore, "tickets");
    const queryConstraints = [];

    // Add filters if provided
    if (filters.status)
      queryConstraints.push(where("status", "==", filters.status));
    if (filters.priority)
      queryConstraints.push(where("priority", "==", filters.priority));
    if (filters.userId)
      queryConstraints.push(where("userId", "==", filters.userId));

    // Add default sorting by creation date
    queryConstraints.push(orderBy("createdAt", "desc"));

    // Create and execute query
    const q = query(ticketsRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketDoc = await getDoc(doc(fireStore, "tickets", ticketId));
    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    return { id: ticketDoc.id, ...ticketDoc.data() };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (ticketData) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Use regular timestamp for history array
    const now = new Date();

    const ticketWithMetadata = {
      ...ticketData,
      userId: user.uid,
      createdBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      status: "open",
      priority: ticketData.priority || "normal",
      escalationLevel: 1, // Initialize at level 1
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      history: [
        {
          action: "created",
          timestamp: now.toISOString(),
          user: user.email,
          escalationLevel: 1,
        },
      ],
    };

    const docRef = await addDoc(
      collection(fireStore, "tickets"),
      ticketWithMetadata
    );
    return docRef.id;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// Update a ticket
export const updateTicket = async (ticketId, updatedData) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketRef = doc(fireStore, "tickets", ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    const now = new Date();
    const currentHistory = ticketDoc.data().history || [];

    const updateData = {
      ...updatedData,
      updatedAt: serverTimestamp(),
      updatedBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      history: [
        ...currentHistory,
        {
          action: "updated",
          timestamp: now.toISOString(),
          user: user.email,
          changes: Object.keys(updatedData).join(", "),
        },
      ],
    };

    await updateDoc(ticketRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// Close a ticket
export const closeTicket = async (ticketId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketRef = doc(fireStore, "tickets", ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    const now = new Date();
    const currentHistory = ticketDoc.data().history || [];

    await updateDoc(ticketRef, {
      status: "closed",
      updatedAt: serverTimestamp(),
      closedAt: serverTimestamp(),
      closedBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      history: [
        ...currentHistory,
        {
          action: "closed",
          timestamp: now.toISOString(),
          user: user.email,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Error closing ticket:", error);
    throw error;
  }
};

// Escalate a ticket
export const escalateTicket = async (ticketId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketRef = doc(fireStore, "tickets", ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    const ticketData = ticketDoc.data();
    const currentLevel = ticketData.escalationLevel || 1;

    if (currentLevel >= 5) {
      throw new Error("Ticket is already at maximum escalation level");
    }

    const now = new Date();
    const currentHistory = ticketData.history || [];

    await updateDoc(ticketRef, {
      escalationLevel: currentLevel + 1,
      priority: currentLevel + 1 >= 4 ? "high" : ticketData.priority,
      updatedAt: serverTimestamp(),
      escalatedAt: serverTimestamp(),
      escalatedBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      history: [
        ...currentHistory,
        {
          action: "escalated",
          timestamp: now.toISOString(),
          user: user.email,
          fromLevel: currentLevel,
          toLevel: currentLevel + 1,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Error escalating ticket:", error);
    throw error;
  }
};

// Delete a ticket (soft delete)
export const deleteTicket = async (ticketId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const ticketRef = doc(fireStore, "tickets", ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    const now = new Date();
    const currentHistory = ticketDoc.data().history || [];

    await updateDoc(ticketRef, {
      status: "deleted",
      updatedAt: serverTimestamp(),
      deletedAt: serverTimestamp(),
      deletedBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      history: [
        ...currentHistory,
        {
          action: "deleted",
          timestamp: now.toISOString(),
          user: user.email,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};
