import React, { useState, useEffect } from "react";
import { Header } from "../components";
import TextEditor from "../components/TextEditor";
import { getNotes, createNote, updateNote, deleteNote } from "../utils/notesController";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError("Failed to load notes. Please try again later.");
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditing && selectedNote) {
        // Update existing note
        await updateNote(selectedNote.id, noteData);
      } else {
        // Create new note
        await createNote(noteData);
      }

      await fetchNotes();
      setSelectedNote(null);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save note. Please try again.");
      console.error("Error saving note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleDeleteNote = async (noteId) => {
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
        setError("Failed to delete note. Please try again.");
        console.error("Error deleting note:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Apps" title="Notes" />
      
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8">
        <TextEditor 
          onSave={handleSaveNote}
          initialContent={selectedNote?.body || ""}
          initialTitle={selectedNote?.title || ""}
          isEditing={isEditing}
        />
        {isEditing && (
          <button
            onClick={handleCancelEdit}
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-2"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold mb-2">{note.title}</h3>
                <div 
                  className="text-gray-600 max-h-32 overflow-hidden mb-4"
                  dangerouslySetInnerHTML={{ __html: note.body }}
                />
                <div className="flex justify-between items-center border-t pt-4">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="text-blue-500 hover:text-blue-700 font-medium px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 font-medium px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
                {note.createdAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                )}
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <div className="text-xs text-gray-400">
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;

// ---------------------------------------------------------------------------------------------------

// import React from "react";

// // this will be replaced with a form that can be used to track progress of field completion
// import TextEditor from "../components/TextEditor";

// // these will most likely need to be moved to the text editor component
// import { setNote, getNotes, getNotifications } from "../utils/controller";

// import { Header } from "../components";

// const Notes = () => {
//   return (
//     <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
//       <Header category="Apps" title="Notes" />
//       <TextEditor />
//       <div>

//       <button onClick={setNote}>save note</button>
//       </div>
//       <div>
//       <button onClick={getNotes}>get notes</button>

//       </div>
//       <div>
//       <button onClick={getNotifications}>get notifications</button>

//       </div>
//     </div>
//   );
// };

// export default Notes;
