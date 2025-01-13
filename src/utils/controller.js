import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../firebase";

// User management functions using localStorage
const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

const setCurrentUserStorage = (uid) => {
  localStorage.setItem('currentUser', uid);
};

// this is the current number of collections to add to each user
const model = ["notes", "notifications", "employees", "priority", "calendar", "tickets"];

// function for initializing current user on login / register
function setCurrentUser(user) {
  setCurrentUserStorage(user.uid);
}

// gets reference to complete list of all users
const getUsersCollection = () => {
  return collection(fireStore, "users");
};

// gets reference to only the active user
const getSingleUserDoc = () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    console.error('No user is currently logged in');
    return null;
  }

  return doc(fireStore, "users", currentUser);
};

// this is the loop we are running to create every collection the user needs
const createUserModel = async (item) => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      console.error('No user document reference available');
      return;
    }

    await addDoc(collection(userDocRef, `${item}`), {
      title: `My ${item}`,
      body: `Welcome to your ${item}!`,
    });
  } catch (error) {
    console.error(`Error creating ${item}:`, error);
  }
};

// this function needs to only run the very first time the user registers
// if it is ran again it will cause a DB error because the collections can't have the same uid
// from here we can create all of the default data and collections we would like to add to each new user
const createNewUserCollection = async (user) => {
  try {
    await setDoc(
      doc(getUsersCollection(), user.uid),
      {
        name: "",
        email: user.email,
        role: "admin",
      },
      { merge: true }
    )
      .then(() => setCurrentUser(user))
      .then(() => {
        model.forEach((item) => {
          createUserModel(item);
        });
      });
  } catch (error) {
    console.error("Error creating user collection:", error);
  }
};

const getNotifications = async () => {
  try {
    const userDocRef = getSingleUserDoc();
    if (!userDocRef) {
      console.error('No user document reference available');
      return [];
    }

    const notificationsCollection = collection(userDocRef, "notifications");
    const querySnapshot = await getDocs(notificationsCollection);
    const notifications = [];
    querySnapshot.forEach((notification) => {
      notifications.push({ id: notification.id, ...notification.data() });
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export {
  createNewUserCollection,
  setCurrentUser,
  getNotifications,
};

