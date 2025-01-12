import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
};

const initialMain = {
  Profile: true,
  Employees: false,
  Priority: false,
  Editor: false,
  Calendar: false,
  LineChart: false,
  Tickets: false,
  UserManagement: false,
};

// Helper function to safely parse JSON from localStorage
const safeParse = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const ContextProvider = ({ children }) => {
  // Initialize state with localStorage values or defaults
  const [activeMenu, setActiveMenu] = useState(() =>
    safeParse("activeMenu", true)
  );

  const [isClicked, setIsClicked] = useState(() =>
    safeParse("isClicked", initialState)
  );

  const [screenSize, setScreenSize] = useState(() =>
    safeParse("screenSize", undefined)
  );

  const [activeMain, setActiveMain] = useState(() =>
    safeParse("activeMain", initialMain)
  );

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem("activeMenu", JSON.stringify(activeMenu));
  }, [activeMenu]);

  useEffect(() => {
    localStorage.setItem("isClicked", JSON.stringify(isClicked));
  }, [isClicked]);

  useEffect(() => {
    localStorage.setItem("screenSize", JSON.stringify(screenSize));
  }, [screenSize]);

  useEffect(() => {
    localStorage.setItem("activeMain", JSON.stringify(activeMain));
  }, [activeMain]);

  // Screen size listener
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Initial size check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle UI state changes
  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  const handleMainVisible = (main) => {
    const resetState = Object.keys(initialMain).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setActiveMain({ ...resetState, [main]: true });
  };

  const resetState = () => {
    setIsClicked(initialState);
    setActiveMain(initialMain);
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        activeMain,
        setActiveMain,
        handleMainVisible,
        resetState,
        // Add any additional values you need to expose
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ContextProvider");
  }
  return context;
};
