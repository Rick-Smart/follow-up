import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { fireStore } from "../firebase";
  
  // Get the current user from localStorage
  const getCurrentUser = () => {
    return localStorage.getItem('currentUser');
  };
  
  // Get reference to the current user's document
  const getSingleUserDoc = () => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      console.error('No user is currently logged in');
      return null;
    }
  
    return doc(fireStore, "users", currentUser);
  };
  
  // Get all notes for the current user
  const getNotes = async () => {
    try {
      const userDocRef = getSingleUserDoc();
      if (!userDocRef) {
        throw new Error('No user document reference available');
      }
  
      const notesCollection = collection(userDocRef, "notes");
      const querySnapshot = await getDocs(notesCollection);
      const notes = [];
      
      querySnapshot.forEach((note) => {
        notes.push({
          id: note.id,
          ...note.data(),
        });
      });
      
      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  };
  
  // Create a new note
  const createNote = async (noteData) => {
    try {
      const userDocRef = getSingleUserDoc();
      if (!userDocRef) {
        throw new Error('No user document reference available');
      }
  
      const docRef = await addDoc(collection(userDocRef, "notes"), {
        title: noteData.title || "Untitled",
        body: noteData.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
  
      return docRef.id;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };
  
  // Update an existing note
  const updateNote = async (noteId, noteData) => {
    try {
      const userDocRef = getSingleUserDoc();
      if (!userDocRef) {
        throw new Error('No user document reference available');
      }
  
      const noteRef = doc(collection(userDocRef, "notes"), noteId);
      await updateDoc(noteRef, {
        ...noteData,
        updatedAt: new Date().toISOString(),
      });
  
      return true;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };
  
  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      const userDocRef = getSingleUserDoc();
      if (!userDocRef) {
        throw new Error('No user document reference available');
      }
  
      const noteRef = doc(collection(userDocRef, "notes"), noteId);
      await deleteDoc(noteRef);
  
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };
  
  // Get a single note by ID
  const getNoteById = async (noteId) => {
    try {
      const userDocRef = getSingleUserDoc();
      if (!userDocRef) {
        throw new Error('No user document reference available');
      }
  
      const noteRef = doc(collection(userDocRef, "notes"), noteId);
      const noteDoc = await getDoc(noteRef);
  
      if (!noteDoc.exists()) {
        throw new Error('Note not found');
      }
  
      return {
        id: noteDoc.id,
        ...noteDoc.data(),
      };
    } catch (error) {
      console.error("Error fetching note:", error);
      throw error;
    }
  };
  
  export {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
  };