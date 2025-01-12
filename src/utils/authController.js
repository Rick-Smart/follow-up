import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "../firebase";
import { setCurrentUser } from "./controller";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "../firebase";

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  const role = localStorage.getItem("userRole");
  return user ? { uid: user, role: role || "agent" } : null;
};

// Register a new user
export const registerUser = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setCurrentUser(user, role);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user role from Firestore
    const userDoc = await getDoc(doc(fireStore, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCurrentUser(user, userData.role);
    }

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Sign out current user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Clear user-related localStorage items
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Listen for auth state changes
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const currentUser = getCurrentUser();
      callback({
        ...user,
        role: currentUser?.role || "agent",
      });
    } else {
      callback(null);
    }
  });
};
