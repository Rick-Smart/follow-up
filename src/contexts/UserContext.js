import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const initializeUser = () => {
      try {
        const uid = localStorage.getItem("currentUser");
        const role = localStorage.getItem("userRole");
        const email = localStorage.getItem("userEmail");

        if (uid && role) {
          setCurrentUser({
            uid,
            role,
            email: email || "",
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Update user data in context and localStorage
  const updateUser = (userData) => {
    if (!userData) {
      clearUser();
      return;
    }

    const { uid, role, email } = userData;
    setCurrentUser({
      uid,
      role,
      email,
      isAuthenticated: true,
    });

    localStorage.setItem("currentUser", uid);
    localStorage.setItem("userRole", role);
    if (email) localStorage.setItem("userEmail", email);
  };

  // Clear user data
  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        updateUser,
        clearUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
