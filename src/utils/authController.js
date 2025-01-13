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

// Get current user from Firebase Auth
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(fireStore, "users", user.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: userData.role,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Register a new user
export const registerUser = async (email, password, role) => {
  console.log("Starting user registration:", { email, role });
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User created in Firebase Auth:", user.uid);

    // Set user data in Firestore
    await setCurrentUser(user, role);
    console.log("User data set in Firestore");

    return {
      uid: user.uid,
      email: user.email,
      role: role,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
    throw error;
  }
};

// Login existing user
export const loginUser = async (email, password) => {
  console.log("Attempting login for:", email);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Firebase Auth login successful:", user.uid);

    // Get user role from Firestore
    const userDoc = await getDoc(doc(fireStore, "users", user.uid));
    if (!userDoc.exists()) {
      console.error("User document not found in Firestore");
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    console.log("User data retrieved from Firestore:", userData);

    const userInfo = {
      uid: user.uid,
      email: user.email,
      role: userData.role,
      isAuthenticated: true,
    };

    console.log("Login successful, returning user info:", userInfo);
    return userInfo;
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
};

// Sign out current user
export const signOutUser = async () => {
  console.log("Attempting sign out");
  try {
    await signOut(auth);
    console.log("Sign out successful");
    return true;
  } catch (error) {
    console.error("Sign out error:", error.code, error.message);
    throw error;
  }
};

// Auth state change listener
export const onAuthStateChangedListener = (callback) => {
  console.log("Setting up auth state listener");

  return onAuthStateChanged(auth, async (user) => {
    console.log("Auth state changed. User:", user ? user.uid : "null");

    if (user) {
      try {
        const userDoc = await getDoc(doc(fireStore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data fetched from Firestore:", userData);

          const userInfo = {
            uid: user.uid,
            name: user.name,
            email: user.email,
            role: userData.role,
            isAuthenticated: true,
          };

          console.log("Calling callback with user info:", userInfo);
          callback(userInfo);
        } else {
          console.error("User document not found in Firestore");
          callback(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.code, error.message);
        callback(null);
      }
    } else {
      console.log("No user is signed in, calling callback with null");
      callback(null);
    }
  });
};
