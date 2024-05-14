import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  Dashboard,
  Calendar,
  Employees,
  Notes,
  Urgent,
  Profile,
} from "./pages";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/urgent" element={<Urgent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/follow-up" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
