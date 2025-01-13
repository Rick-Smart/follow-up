import React, { useState } from "react";
import {
  HtmlEditor,
  Inject,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";

const TextEditor = ({
  onSave,
  initialContent = "",
  initialTitle = "",
  isEditing,
  disabled,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    onSave({ title, body: content });
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />

      <div className="h-64">
        {" "}
        {/* Adjusted height here */}
        <RichTextEditorComponent
          value={content}
          height="250px" // Adjusted height here
          change={(args) => setContent(args.value)}
          disabled={disabled}
        >
          <Inject services={[HtmlEditor, Toolbar]} />
        </RichTextEditorComponent>
      </div>

      <button
        onClick={handleSave}
        disabled={disabled || !title.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEditing ? "Update Note" : "Save Note"}
      </button>
    </div>
  );
};

export default TextEditor;
