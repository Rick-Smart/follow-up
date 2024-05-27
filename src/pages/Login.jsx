import React, { useState, useEffect } from "react";
import { NavLink, Navigate } from "react-router-dom";

// auth and signin from firebase
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "../firebase";
// context to set user
import { useStateContext } from "../contexts/ContextProvider";

import { setCurrentUser } from "../utils/controller";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setActiveUser, currentUser } = useStateContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setActiveUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const tempUser = auth.currentUser;
        console.log(auth.currentUser);
        setActiveUser(user);
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
            <h2 className="text-gray-500">Login</h2>
            <p className="text-gray-500">Lets Solve The Problem</p>
          </header>
          <div>
            <input
              type="text"
              className="border border-gray-200 rounded bg-gray-100 p-2 my-2 w-full"
              placeholder="Email"
              onChange={(text) => setEmail(text.target.value)}
            />
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 my-2 w-full"
              placeholder="Password"
              onChange={(text) => setPassword(text.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-indigo-600 text-white my-2 py-4 px-8 rounded w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <NavLink to="/register">Register</NavLink>
        </section>
      </div>
    </div>
  );
}

export default Login;
