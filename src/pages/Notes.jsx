import React from "react";

import TextEditor from "../components/TextEditor";

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
