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

// Get all users with their details
export const getAllUsers = async () => {
  try {
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
    const userRef = doc(fireStore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Update user attributes
export const updateUserAttributes = async (userId, attributes) => {
  try {
    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, attributes);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Set/update supervisor relationship
export const setSupervisor = async (userId, supervisorId) => {
  try {
    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, { supervisorId });
  } catch (error) {
    console.error("Error setting supervisor:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(fireStore, "users", userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(fireStore, "users");
    const q = query(usersRef, where("role", "==", role));
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
    const hierarchy = [];
    let currentUserId = userId;

    while (currentUserId) {
      const user = await getUserById(currentUserId);
      if (!user) break;

      hierarchy.push(user);
      currentUserId = user.supervisorId;
    }

    return hierarchy;
  } catch (error) {
    console.error("Error getting supervisor hierarchy:", error);
    throw error;
  }
};
