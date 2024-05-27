import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { fireStore } from "../firebase";

let currentUser;

// this is the current number of collections to add to each user
const model = ["notes", "notifications", "employees", "priority", "calendar"];

// function for initializing current user on login / register
function setCurrentUser(user) {
  currentUser = user.uid;
}

// gets reference to complete list of all users
const getUsersCollection = () => {
  return collection(fireStore, "users");
};

// gets reference to only the active user
const getSingleUserDoc = () => {
  return doc(fireStore, "users", currentUser);
};

// this is the loop we are running to create every collection they user needs
const createUserModel = async (item) => {
  await addDoc(collection(getSingleUserDoc(), `${item}`), {
    title: `My ${item}`,
    body: `Welcome to your ${item}!`,
  });
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
      .then(setCurrentUser(user))
      .then(
        model.forEach((item) => {
          createUserModel(item);
        })
      );
  } catch (error) {
    alert(error);
  }
};

// writing notes to our single user
const setNote = async () => {
  await addDoc(
    collection(getSingleUserDoc(), "notes"),
    {
      title: "title 2",
      body: "stuff and things 2",
    },
    { merge: true }
  );
};

// getting all notes from our single user
const getNotes = async () => {
  const querySnapshot = await getDocs(collection(getSingleUserDoc(), "notes"));
  querySnapshot.forEach((note) => {
    console.log(note.id, " => ", note.data());
  });
};

const getNotifications = async () => {
  const querySnapshot = await getDocs(
    collection(getSingleUserDoc(), "notifications")
  );
  querySnapshot.forEach((notification) => {
    console.log(notification.id, " => ", notification.data());
  });
};

export {
  createNewUserCollection,
  setCurrentUser,
  setNote,
  getNotes,
  getNotifications,
};
