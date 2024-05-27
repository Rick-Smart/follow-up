import React from "react";

// this will be replaced with a form that can be used to track progress of field completion
import TextEditor from "../components/TextEditor";

// these will most likely need to be moved to the text editor component
import { setNote, getNotes, getNotifications } from "../utils/controller";

import { Header } from "../components";

const Notes = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Apps" title="Notes" />
      <TextEditor />
      <button onClick={setNote}>save note</button>
      <button onClick={getNotes}>get notes</button>
      <button onClick={getNotifications}>get notifications</button>
    </div>
  );
};

export default Notes;
