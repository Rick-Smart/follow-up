import React, { createContext, useContext, useState, useCallback } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = useCallback((userData) => {
    console.log("Updating user:", userData);
    if (!userData) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    setCurrentUser({
      ...userData,
      isAuthenticated: true,
    });
  }, []);

  const clearUser = useCallback(() => {
    console.log("Clearing user");
    setCurrentUser(null);
    setIsLoading(false);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      currentUser,
      updateUser,
      clearUser,
      isLoading,
      setIsLoading,
    }),
    [currentUser, updateUser, clearUser, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
