import React, { useState, useEffect } from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function TextEditor({ onSave, initialContent, initialTitle, isEditing }) {
  const [title, setTitle] = useState(initialTitle || "");

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'min-h-590 w-full focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent && isEditing) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent, isEditing]);

  useEffect(() => {
    setTitle(initialTitle || "");
  }, [initialTitle]);

  const handleSave = () => {
    if (editor && onSave) {
      const noteData = {
        title: title || "Untitled Note",
        body: editor.getHTML()
      };
      onSave(noteData);
      
      if (!isEditing) {
        editor.commands.setContent("");
        setTitle("");
      }
    }
  };

  return (
    <div className="bg-main-bg dark:bg-secondary-dark-bg rounded-xl shadow-lg">
      <div className="p-6">
        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Note Title"
            className="w-full p-3 text-xl font-semibold bg-light-gray dark:bg-main-dark-bg 
                     border-b-1 border-color focus:border-blue-500 outline-none 
                     rounded-t-lg dark:text-gray-200"
          />
        </div>
        
        {/* Editor Container */}
        <div className="min-h-300 bg-light-gray dark:bg-main-dark-bg rounded-lg border-1 border-color">
          <EditorContent 
            editor={editor} 
            className="p-4 min-h-300 prose max-w-none dark:text-gray-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {isEditing && (
            <button
              onClick={() => editor?.commands.clearContent()}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 
                       hover:text-gray-800 dark:hover:text-gray-200 
                       transition-colors rounded-lg"
            >
              Clear
            </button>
          )}
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors shadow-md"
          >
            {isEditing ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>

      {editor && (
        <BubbleMenu 
          editor={editor} 
          className="bg-white dark:bg-secondary-dark-bg shadow-lg rounded-lg p-2"
        >
          {/* Add formatting buttons if needed */}
        </BubbleMenu>
      )}
      
      {editor && (
        <FloatingMenu 
          editor={editor} 
          className="bg-white dark:bg-secondary-dark-bg shadow-lg rounded-lg p-2"
        >
          {/* Add floating menu items if needed */}
        </FloatingMenu>
      )}
    </div>
  );
}

export default TextEditor;