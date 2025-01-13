// notesController.js
import BaseFirebaseController from "./baseController";
import { doc, setDoc, where, deleteDoc, orderBy } from "firebase/firestore";
import { fireStore } from "../firebase";

class NotesController extends BaseFirebaseController {
  constructor() {
    super("notes");
    // Set default sorting by updatedAt
    this.baseQuery = [orderBy("updatedAt", "desc")];
  }

  async createNote(note) {
    try {
      const user = await this.validateUser();
      const noteId = await this.createDoc(note, {
        userId: user.uid,
      });

      // Add reference to user's notes collection
      const userNotesRef = doc(fireStore, `users/${user.uid}/notes/${noteId}`);
      await setDoc(userNotesRef, { noteId });

      return noteId;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  }

  async getNotes() {
    try {
      const user = await this.validateUser();
      const queryConstraints = [where("userId", "==", user.uid)];
      const notes = await this.getAllDocs(queryConstraints);

      return notes.map((note) => ({
        ...note,
        createdAt: note.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: note.updatedAt?.toDate?.()?.toISOString() || null,
      }));
    } catch (error) {
      console.error("Error getting notes:", error);
      throw error;
    }
  }

  async getNoteById(noteId) {
    try {
      const user = await this.validateUser();
      const { data: noteData } = await this.getDoc(noteId);

      if (noteData.userId !== user.uid) {
        throw new Error("Not authorized to view this note");
      }

      return {
        id: noteId,
        ...noteData,
        createdAt: noteData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: noteData.updatedAt?.toDate?.()?.toISOString() || null,
      };
    } catch (error) {
      console.error("Error getting note:", error);
      throw error;
    }
  }

  async updateNote(noteId, updatedData) {
    try {
      const user = await this.validateUser();
      const { data: noteData } = await this.getDoc(noteId);

      if (noteData.userId !== user.uid) {
        throw new Error("Not authorized to update this note");
      }

      return await this.updateDoc(noteId, updatedData);
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  }

  async deleteNote(noteId) {
    try {
      const user = await this.validateUser();
      const { data: noteData } = await this.getDoc(noteId);

      if (noteData.userId !== user.uid) {
        throw new Error("Not authorized to delete this note");
      }

      // Delete from main notes collection (using hard delete)
      await this.deleteDoc(noteId, false);

      // Delete from user's notes collection
      const userNoteRef = doc(fireStore, `users/${user.uid}/notes/${noteId}`);
      await deleteDoc(userNoteRef);

      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  }
}

// Create singleton instance
const notesController = new NotesController();

// Export individual methods with proper binding
export const createNote = (...args) =>
  notesController.createNote.apply(notesController, args);
export const getNotes = (...args) =>
  notesController.getNotes.apply(notesController, args);
export const getNoteById = (...args) =>
  notesController.getNoteById.apply(notesController, args);
export const updateNote = (...args) =>
  notesController.updateNote.apply(notesController, args);
export const deleteNote = (...args) =>
  notesController.deleteNote.apply(notesController, args);

export default notesController;
