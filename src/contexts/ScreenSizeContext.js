import React, { createContext, useContext, useState, useEffect } from "react";

// Create Screen Size Context
const ScreenSizeContext = createContext();

// Screen Size Context Provider
export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);

  // Load state from localStorage or use initial values
  useEffect(() => {
    const savedSize = localStorage.getItem("screenSize");
    if (savedSize) {
      setScreenSize(JSON.parse(savedSize));
    }
  }, []);

  // Save to localStorage whenever screenSize changes
  useEffect(() => {
    localStorage.setItem("screenSize", JSON.stringify(screenSize));
  }, [screenSize]);

  return (
    <ScreenSizeContext.Provider
      value={{
        screenSize,
        setScreenSize,
      }}
    >
      {children}
    </ScreenSizeContext.Provider>
  );
};

// Custom hook to use Screen Size Context
export const useScreenSizeContext = () => useContext(ScreenSizeContext);
