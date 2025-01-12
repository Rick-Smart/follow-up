import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { loginUser, onAuthStateChangedListener } from "../utils/authController";
import { useUserContext } from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, currentUser } = useUserContext();
  const navigate = useNavigate();

  const handleAuthStateChange = useCallback(
    (user) => {
      if (user) {
        updateUser(user);
        navigate("/dashboard");
      }
    },
    [updateUser, navigate]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(handleAuthStateChange);
    return () => unsubscribe();
  }, [handleAuthStateChange]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const user = await loginUser(email, password);
      updateUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setError("No user found with this email");
          break;
        case "auth/wrong-password":
          setError("Invalid password");
          break;
        case "auth/invalid-email":
          setError("Invalid email format");
          break;
        default:
          setError("Failed to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-gray-100 h-screen w-screen flex items-center justify-center">
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
            <p className="text-gray-500">Let's Solve The Problem</p>
          </header>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="submit"
              className={`w-full py-4 px-8 rounded text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <NavLink
              to="/register"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              Create Account
            </NavLink>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
