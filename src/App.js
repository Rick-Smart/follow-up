import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Dashboard } from "./pages";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
