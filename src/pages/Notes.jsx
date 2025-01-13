import React, { useState, useEffect, useCallback } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Header } from "../components";
import TextEditor from "../components/TextEditor";
import Note from "../components/Note";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
} from "../utils/notesController";

const Notes = () => {
  const { currentUser } = useUserContext();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!currentUser?.uid) {
      setError("Please log in to view notes");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "Failed to load notes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSaveNote = async (noteData) => {
    if (!currentUser?.uid) {
      setError("Please log in to save notes");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (isEditing && selectedNote) {
        await updateNote(selectedNote.id, noteData);
        setIsEditing(false);
      } else {
        await createNote(noteData);
      }

      await fetchNotes();
      setSelectedNote(null);
      setIsEditorCollapsed(true); // Collapse editor after saving
    } catch (err) {
      setError(err.message || "Failed to save note. Please try again.");
      console.error("Error saving note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = async (note) => {
    try {
      setIsLoading(true);
      setError(null);
      const freshNote = await getNoteById(note.id);
      setSelectedNote(freshNote);
      setIsEditing(true);
      setIsEditorCollapsed(false); // Expand editor when editing
    } catch (err) {
      setError(err.message || "Failed to load note for editing.");
      console.error("Error loading note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!currentUser?.uid) {
      setError("Please log in to delete notes");
      return;
    }

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        setIsLoading(true);
        setError(null);
        await deleteNote(noteId);
        await fetchNotes();

        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }
      } catch (err) {
        setError(err.message || "Failed to delete note. Please try again.");
        console.error("Error deleting note:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setError(null);
    setIsEditorCollapsed(true);
  };

  const toggleEditor = () => {
    setIsEditorCollapsed(!isEditorCollapsed);
    if (isEditorCollapsed) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  if (!currentUser?.uid) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Apps" title="Notes" />
        <div className="p-4 text-center text-gray-600">
          Please log in to view and manage notes
        </div>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Apps" title="Notes" />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Note Editor Section */}
      <div className="mb-8 border rounded-lg p-4">
        <button
          onClick={toggleEditor}
          className="w-full text-left mb-4 flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
        >
          <span className="font-semibold">
            {isEditorCollapsed ? "Create New Note" : "Hide Editor"}
          </span>
          <span className="text-gray-500">{isEditorCollapsed ? "+" : "-"}</span>
        </button>

        {!isEditorCollapsed && (
          <div className="transition-all duration-300">
            <TextEditor
              onSave={handleSaveNote}
              initialContent={selectedNote?.body || ""}
              initialTitle={selectedNote?.title || ""}
              isEditing={isEditing}
              disabled={isLoading}
            />
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-2 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notes List Section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No notes yet. Create your first note above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Note
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
