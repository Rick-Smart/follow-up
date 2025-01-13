import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { registerUser } from "../utils/authController";
import { useUserContext } from "../contexts/UserContext";
import { checkAdminExists, USER_ROLES } from "../utils/userController";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstUser, setIsFirstUser] = useState(false);

  const { updateUser, currentUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const adminExists = await checkAdminExists();
        setIsFirstUser(!adminExists);
      } catch (error) {
        setError("Error checking admin status. Please try again.");
        console.error("Error checking admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstUser();
  }, []);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isFirstUser) {
      setError(
        "Registration is currently restricted. Please contact your administrator."
      );
      setIsLoading(false);
      return;
    }

    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    try {
      const user = await registerUser(email, password, USER_ROLES.ADMIN);
      updateUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/operation-not-allowed":
          setError("Registration is currently disabled");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
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
            <h2 className="text-gray-500">Register</h2>
            {isFirstUser ? (
              <p className="text-gray-500">Initial Admin Registration</p>
            ) : (
              <p className="text-red-500">
                Registration is restricted to administrator only
              </p>
            )}
          </header>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isFirstUser || isLoading}
              autoComplete="email"
            />
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isFirstUser || isLoading}
              autoComplete="new-password"
            />
            <input
              type="password"
              className="border border-gray-200 rounded bg-gray-100 p-2 w-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isFirstUser || isLoading}
              autoComplete="new-password"
            />
            <button
              type="submit"
              className={`w-full py-4 px-8 rounded text-white ${
                !isFirstUser || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={!isFirstUser || isLoading}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <NavLink
              to="/"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              Back to Login
            </NavLink>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
