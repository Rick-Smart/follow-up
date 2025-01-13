import React, { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useUserContext } from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateUser, currentUser } = useUserContext();
  const navigate = useNavigate();
  const { handleLogin } = useAuthContext();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      if (!email.endsWith("@valorglobal.com")) {
        throw new Error("Email must be a @valorglobal.com email address");
      }

      // Login attempt
      const user = await handleLogin(email, password);
      updateUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase auth errors
      const errorMessage = (() => {
        if (error.code === "auth/user-not-found")
          return "No user found with this email";
        if (error.code === "auth/wrong-password") return "Invalid password";
        if (error.code === "auth/invalid-email") return "Invalid email format";
        return error.message || "Failed to log in. Please try again.";
      })();

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
            />
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full py-4 px-8 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
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
