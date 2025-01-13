import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, Register, Dashboard } from "./pages";
import { useUserContext } from "./contexts/UserContext";
import { onAuthStateChangedListener } from "./utils/authController";
import "./App.css";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (currentUser?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { updateUser, setIsLoading } = useUserContext();

  useEffect(() => {
    let unsubscribe;
    const setupAuthListener = async () => {
      console.log("Setting up auth listener");
      setIsLoading(true);

      unsubscribe = onAuthStateChangedListener((user) => {
        if (user) {
          updateUser(user);
        } else {
          updateUser(null);
        }
        setIsLoading(false);
      });
    };

    setupAuthListener();

    return () => {
      console.log("Cleaning up auth listener");
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
