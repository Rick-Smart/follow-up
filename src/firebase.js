import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "@firebase/firestore";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STOREAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

const fireStore = getFirestore(app);
const auth = getAuth(app);
// setPersistence(auth, browserSessionPersistence)
//   .then(() => {
//     return signInWithEmailAndPassword(auth, email, password);
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });

export {
  auth,
  fireStore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
