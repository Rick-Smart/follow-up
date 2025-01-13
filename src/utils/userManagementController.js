import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import { getCurrentUser } from "./authController";

// Get all users with their details
export const getAllUsers = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !["admin", "supervisor"].includes(currentUser.role)) {
      throw new Error("Not authorized to view users");
    }

    const usersRef = collection(fireStore, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    const userRef = doc(fireStore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    // Only allow admins, supervisors, or the user themselves to view details
    if (
      !["admin", "supervisor"].includes(currentUser.role) &&
      currentUser.uid !== userId
    ) {
      throw new Error("Not authorized to view this user");
    }

    return { id: userDoc.id, ...userData };
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Update user attributes
export const updateUserAttributes = async (userId, attributes) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !["admin", "supervisor"].includes(currentUser.role)) {
      throw new Error("Not authorized to update users");
    }

    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, {
      ...attributes,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Set/update supervisor relationship
export const setSupervisor = async (userId, supervisorId) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !["admin"].includes(currentUser.role)) {
      throw new Error("Not authorized to set supervisors");
    }

    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, {
      supervisorId,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid,
    });
  } catch (error) {
    console.error("Error setting supervisor:", error);
    throw error;
  }
};

// Delete a user (soft delete)
export const deleteUser = async (userId) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !["admin"].includes(currentUser.role)) {
      throw new Error("Not authorized to delete users");
    }

    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, {
      active: false,
      deactivatedAt: new Date().toISOString(),
      deactivatedBy: currentUser.uid,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get users by role(s)
export const getUsersByRole = async (roles) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    // Validate roles parameter
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      console.error("Invalid roles parameter:", roles);
      return [];
    }

    // Only allow admins and supervisors to query by role
    if (!["admin", "supervisor"].includes(currentUser.role)) {
      throw new Error("Not authorized to query users by role");
    }

    const usersRef = collection(fireStore, "users");
    const q = query(
      usersRef,
      where("role", "in", roles),
      where("active", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting users by role:", error);
    throw error;
  }
};

// Get supervisor hierarchy
export const getSupervisorHierarchy = async (userId) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    // Only allow viewing hierarchy if admin, supervisor, or the user themselves
    if (
      !["admin", "supervisor"].includes(currentUser.role) &&
      currentUser.uid !== userId
    ) {
      throw new Error("Not authorized to view hierarchy");
    }

    const hierarchy = [];
    let currentUserId = userId;
    const maxDepth = 10; // Prevent infinite loops
    let depth = 0;

    while (currentUserId && depth < maxDepth) {
      const user = await getUserById(currentUserId);
      if (!user) break;

      hierarchy.push(user);
      currentUserId = user.supervisorId;
      depth++;
    }

    return hierarchy;
  } catch (error) {
    console.error("Error getting supervisor hierarchy:", error);
    throw error;
  }
};
