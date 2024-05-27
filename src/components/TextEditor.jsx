import React from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

const content = "<p>Welcome to the world of Notes!</p>";

function TextEditor() {
  const editor = useEditor({
    extensions,
    content,
  });
  return (
    <div>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}></BubbleMenu>
      <FloatingMenu editor={editor}></FloatingMenu>
    </div>
  );
}

export default TextEditor;
