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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import { getCurrentUser } from "./authController";

// Create a new note
export const createNote = async (note) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Add note to notes collection
    const notesRef = collection(fireStore, "notes");
    const timestamp = serverTimestamp();
    const newNote = {
      ...note,
      userId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
    };

    const docRef = await addDoc(notesRef, newNote);

    // Add reference to user's notes collection
    const userNotesRef = doc(fireStore, `users/${user.uid}/notes/${docRef.id}`);
    await setDoc(userNotesRef, { noteId: docRef.id });

    return docRef.id;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Get all notes for current user
export const getNotes = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const notesRef = collection(fireStore, "notes");
    const q = query(
      notesRef,
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const notes = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Get a single note by ID
export const getNoteById = async (noteId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const noteRef = doc(fireStore, "notes", noteId);
    const noteDoc = await getDoc(noteRef);

    if (!noteDoc.exists()) {
      throw new Error("Note not found");
    }

    const noteData = noteDoc.data();
    if (noteData.userId !== user.uid) {
      throw new Error("Not authorized to view this note");
    }

    return {
      id: noteDoc.id,
      ...noteData,
      createdAt: noteData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: noteData.updatedAt?.toDate?.()?.toISOString() || null,
    };
  } catch (error) {
    console.error("Error getting note:", error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, updatedData) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const noteRef = doc(fireStore, "notes", noteId);
    const noteDoc = await getDoc(noteRef);

    if (!noteDoc.exists()) {
      throw new Error("Note not found");
    }

    const noteData = noteDoc.data();
    if (noteData.userId !== user.uid) {
      throw new Error("Not authorized to update this note");
    }

    await updateDoc(noteRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
      updatedBy: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const noteRef = doc(fireStore, "notes", noteId);
    const noteDoc = await getDoc(noteRef);

    if (!noteDoc.exists()) {
      throw new Error("Note not found");
    }

    const noteData = noteDoc.data();
    if (noteData.userId !== user.uid) {
      throw new Error("Not authorized to delete this note");
    }

    // Delete from main notes collection
    await deleteDoc(noteRef);

    // Delete from user's notes collection
    const userNoteRef = doc(fireStore, `users/${user.uid}/notes/${noteId}`);
    await deleteDoc(userNoteRef);

    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};
