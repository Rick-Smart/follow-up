import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "../firebase";
import { setCurrentUser } from "./userController";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "../firebase";

// Get current user from localStorage with complete user data
export const getCurrentUser = () => {
  const uid = localStorage.getItem("currentUser");
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");

  return uid
    ? {
        uid,
        role: role || "agent",
        email: email || "",
        isAuthenticated: true,
      }
    : null;
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

    // Set user data
    await setCurrentUser(user, role);

    // Store user data in localStorage
    localStorage.setItem("currentUser", user.uid);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);

    return {
      uid: user.uid,
      email: user.email,
      role: role,
    };
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
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDoc.data();

    // Store user data in localStorage
    localStorage.setItem("currentUser", user.uid);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userEmail", user.email);

    return {
      uid: user.uid,
      email: user.email,
      role: userData.role,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Sign out current user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Clear all user data from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Auth state change listener
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(fireStore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          callback({
            uid: user.uid,
            email: user.email,
            role: userData.role,
            isAuthenticated: true,
          });
        } else {
          console.error("User document not found");
          callback(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
