import React from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

function TextEditor() {
  const editor = useEditor({
    extensions,
    content,
  });
  return (
    <div>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}></FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </div>
  );
}

export default TextEditor;
