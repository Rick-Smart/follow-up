import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../firebase";

// Updated USER_ROLES with new roles
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

export const setCurrentUser = (user, role) => {
  if (!user || !role || typeof role !== "string") {
    console.error("Invalid user or role provided");
    return;
  }

  try {
    localStorage.setItem("currentUser", user.uid);
    localStorage.setItem("userRole", role);
  } catch (error) {
    console.error("Error setting current user:", error);
  }
};

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

export const createNewUserCollection = async (
  user,
  role = USER_ROLES.AGENT
) => {
  try {
    // Validate role
    if (typeof role !== "string" || !Object.values(USER_ROLES).includes(role)) {
      throw new Error("Invalid role specified");
    }

    // If creating admin, check if admin exists
    if (role === USER_ROLES.ADMIN) {
      const adminExists = await checkAdminExists();
      if (adminExists) {
        throw new Error("Admin already exists");
      }
    }

    await setDoc(
      doc(collection(fireStore, "users"), user.uid),
      {
        name: "",
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
        active: true,
      },
      { merge: true }
    );

    setCurrentUser(user, role);
  } catch (error) {
    console.error("Error creating user collection:", error);
    throw error;
  }
};
