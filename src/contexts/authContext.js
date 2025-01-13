import React, { createContext, useContext, useState } from "react";
import { loginUser, signOutUser } from "../utils/authController";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const handleLogin = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const userData = await loginUser(email, password);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ handleLogin, handleLogout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
