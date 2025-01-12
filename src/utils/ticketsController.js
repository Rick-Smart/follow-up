import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { fireStore } from "../firebase";

const getCurrentUser = () => {
  return localStorage.getItem("currentUser");
};

const getSingleUserDoc = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    console.error("No user is currently logged in");
    return null;
  }

  return doc(fireStore, "users", currentUser);
};

const generateTicketNumber = () => {
  return `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const createTicket = async (ticketData) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const newTicket = {
      ticketNumber: generateTicketNumber(),
      incNumber: ticketData.incNumber,
      msisdn: ticketData.msisdn,
      submittedBy: ticketData.submittedBy,
      description: ticketData.description,
      state: "In Progress",
      escalationLevel: 1,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      notes: [],
      ...ticketData,
    };

    const docRef = await addDoc(collection(userDocRef, "tickets"), newTicket);
    return docRef.id;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

const getTickets = async () => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const ticketsCollection = collection(userDocRef, "tickets");
    const querySnapshot = await getDocs(ticketsCollection);
    const tickets = [];

    querySnapshot.forEach((ticket) => {
      tickets.push({
        id: ticket.id,
        ...ticket.data(),
      });
    });

    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

const addNoteToTicket = async (ticketId, note) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const ticketRef = doc(collection(userDocRef, "tickets"), ticketId);
    const ticketDoc = await getDoc(ticketRef);
    const currentNotes = ticketDoc.data().notes || [];

    const newNote = {
      id: Date.now().toString(),
      content: note,
      createdAt: new Date().toISOString(),
      createdBy: localStorage.getItem("currentUser"),
      escalationLevel: ticketDoc.data().escalationLevel,
    };

    await updateDoc(ticketRef, {
      notes: [...currentNotes, newNote],
    });

    return true;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

const escalateTicket = async (ticketId, note) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const ticketRef = doc(collection(userDocRef, "tickets"), ticketId);
    const ticketDoc = await getDoc(ticketRef);
    const currentLevel = ticketDoc.data().escalationLevel;

    if (currentLevel < 5) {
      await updateDoc(ticketRef, {
        escalationLevel: currentLevel + 1,
        lastEscalatedAt: new Date().toISOString(),
      });

      // Add escalation note
      await addNoteToTicket(ticketId, note);
    }

    return true;
  } catch (error) {
    console.error("Error escalating ticket:", error);
    throw error;
  }
};

const deleteTicket = async (ticketId) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const ticketRef = doc(collection(userDocRef, "tickets"), ticketId);
    await deleteDoc(ticketRef);

    return true;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};

const closeTicket = async (ticketId, note) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      throw new Error("No user document reference available");
    }

    const ticketRef = doc(collection(userDocRef, "tickets"), ticketId);
    await updateDoc(ticketRef, {
      state: "Closed",
      closedAt: new Date().toISOString(),
    });

    // Add closing note
    if (note) {
      await addNoteToTicket(ticketId, `Ticket closed: ${note}`);
    }

    return true;
  } catch (error) {
    console.error("Error closing ticket:", error);
    throw error;
  }
};

export {
  closeTicket,
  createTicket,
  getTickets,
  escalateTicket,
  deleteTicket,
  addNoteToTicket,
};
