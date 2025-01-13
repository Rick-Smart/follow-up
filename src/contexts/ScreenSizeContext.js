import React, { createContext, useContext, useState } from "react";

// Create Screen Size Context
const ScreenSizeContext = createContext();

// Screen Size Context Provider
export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);

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
