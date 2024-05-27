import React, { useState } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
// auth and registration from firebase
import { auth, createUserWithEmailAndPassword } from "../firebase";
// context for setting user
import { useStateContext } from "../contexts/ContextProvider";

import { createNewUserCollection } from "../utils/controller";

function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setActiveUser, currentUser } = useStateContext();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setActiveUser(user);
        createNewUserCollection(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        alert(`Error ${errorCode} : ${errorMessage}`);
      });
  };

  return (
    <div className="bg-gray-100 h-screen w-screen flex items-center justify-center">
      {auth.currentUser && <Navigate to={"/dashboard"} replace={true} />}
      <div className="bg-white rounded flex space-between shadow-md max-w-4xl">
        <section className="py-8 px-12">
          <img
            src="https://s3-ap-southeast-1.amazonaws.com/kalibrr-company-assets/logos/39LNSSHFKBDSWDWTLZK9-578c0556.png"
            className="max-w-md rounded"
            alt="ValorGlobal Logo"
          />
          <header className="mb-4">
            <h1 className="text-2xl font-bold mb-2">Follow-UP</h1>
            <h2 className="text-gray-500">Register</h2>
            <p className="text-gray-500">Lets Solve The Problem</p>
          </header>
          <div>
            <input
              type="text"
              className="border border-gray-200 rounded bg-gray-100 p-2 my-2 w-full"
              placeholder="Email"
              onChange={(text) => setEmail(text.target.value)}
            />
            {/* additional password input field required to check and make sure the user has entered the correct password */}
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 my-2 w-full"
              placeholder="Password"
              onChange={(text) => setPassword(text.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-indigo-600 text-white my-2 py-4 px-8 rounded w-full"
              onClick={handleSignUp}
            >
              Register
            </button>
          </div>
          <NavLink to="/">Login</NavLink>
        </section>
      </div>
    </div>
  );
}

export default Register;
