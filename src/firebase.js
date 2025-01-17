import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STOREAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,

  apiKey: "AIzaSyCEyJ02JR5uiLqA3tsOGjdBmWRLxaZC25o",
  authDomain: "follow-up-792d6.firebaseapp.com",
  projectId: "follow-up-792d6",
  storageBucket: "follow-up-792d6.firebasestorage.app",
  messagingSenderId: "774353739286",
  appId: "1:774353739286:web:a2b1083d3779ad0b119f37",
});

const fireStore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {
  auth,
  fireStore,
  storage,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
