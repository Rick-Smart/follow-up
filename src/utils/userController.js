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

// Set current user data
import { User } from "../models/UserModel";

// User roles definition
export const USER_ROLES = {
  ADMIN: "admin",
  DIRECTOR: "director",
  SR_OPERATIONS_MANAGER: "sr_operations_manager",
  OPERATIONS_MANAGER: "operations_manager",
  HR: "hr",
  COACH: "coach",
  POD: "pod",
  AGENT: "agent",
};

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 8,
  [USER_ROLES.DIRECTOR]: 7,
  [USER_ROLES.SR_OPERATIONS_MANAGER]: 6,
  [USER_ROLES.OPERATIONS_MANAGER]: 5,
  [USER_ROLES.HR]: 4,
  [USER_ROLES.COACH]: 3,
  [USER_ROLES.POD]: 2,
  [USER_ROLES.AGENT]: 1,
};

// Permission check helper
export const hasPermission = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const setCurrentUser = async (user, role) => {
  if (!user?.uid || !role) {
    throw new Error("Invalid user data provided");
  }

  try {
    // If creating admin, verify no admin exists
    if (role === USER_ROLES.ADMIN) {
      const adminExists = await checkAdminExists();
      if (adminExists) {
        throw new Error("Admin already exists");
      }
    }

    // Create a new User instance
    const newUser = new User({
      uid: user.uid,
      email: user.email,
      role: role,
      name: user.displayName || "",
    });

    // Create/update user document in Firestore
    await setDoc(doc(fireStore, "users", user.uid), newUser.toFirestore(), {
      merge: true,
    });

    // Update localStorage
    localStorage.setItem("currentUser", user.uid);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", user.email);

    return true;
  } catch (error) {
    console.error("Error setting current user:", error);
    throw error;
  }
};

// Check if admin exists
export const checkAdminExists = async () => {
  try {
    const usersRef = collection(fireStore, "users");
    const q = query(usersRef, where("role", "==", USER_ROLES.ADMIN));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw error;
  }
};

// Get user data by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(fireStore, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get all users (requires admin permission)
export const getAllUsers = async (currentUserRole) => {
  if (!hasPermission(currentUserRole, USER_ROLES.ADMIN)) {
    throw new Error("Insufficient permissions");
  }

  try {
    const usersRef = collection(fireStore, "users");
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Update user role (requires admin permission)
export const updateUserRole = async (currentUserRole, userId, newRole) => {
  if (!hasPermission(currentUserRole, USER_ROLES.ADMIN)) {
    throw new Error("Insufficient permissions");
  }

  try {
    const userRef = doc(fireStore, "users", userId);
    await setDoc(
      userRef,
      {
        role: newRole,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
