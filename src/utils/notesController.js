import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import { getCurrentUser } from "./authController";

// Create a new note
export const createNote = async (note) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const notesRef = collection(fireStore, "notes");
    const newNote = {
      ...note,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(notesRef, newNote);
    return docRef.id;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Get all notes for current user
export const getNotes = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const notesRef = collection(fireStore, "notes");
    const q = query(notesRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, updatedData) => {
  try {
    const noteRef = doc(fireStore, "notes", noteId);
    await updateDoc(noteRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(fireStore, "notes", noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};
