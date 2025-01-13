import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../firebase";

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  AGENT: "agent",
  CUSTOMER: "customer",
};

// Check if an admin exists
export const checkAdminExists = async () => {
  try {
    const q = query(
      collection(fireStore, "users"),
      where("role", "==", USER_ROLES.ADMIN)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireStore, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(fireStore, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...doc.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Set current user
export const setCurrentUser = async (user, role, updateUser) => {
  try {
    const userRef = doc(fireStore, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: role,
      isAuthenticated: true,
    });

    // Update context with user data
    updateUser({
      uid: user.uid,
      email: user.email,
      role: role,
      isAuthenticated: true,
    });

    return true;
  } catch (error) {
    console.error("Error setting user:", error);
    throw error;
  }
};

// Update user attributes
export const updateUserAttributes = async (userId, updatedData, updateUser) => {
  try {
    await setDoc(doc(fireStore, "users", userId), updatedData, { merge: true });

    // Update context with updated data
    updateUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));

    return true;
  } catch (error) {
    console.error("Error updating user attributes:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId, updateUser) => {
  try {
    await setDoc(doc(fireStore, "users", userId), { active: false });

    // Update context to reflect user deletion
    updateUser(null);

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const q = query(collection(fireStore, "users"), where("role", "==", role));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
};
