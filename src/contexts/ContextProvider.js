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

// Helper function to safely parse JSON
const safeParse = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key); // Remove invalid data
    return defaultValue;
  }
};

export const ContextProvider = ({ children }) => {
  // Load state from localStorage or use initial values
  const [activeMenu, setActiveMenu] = useState(() =>
    safeParse("activeMenu", true)
  );

  const [isClicked, setIsClicked] = useState(() =>
    safeParse("isClicked", initialState)
  );

  const [screenSize, setScreenSize] = useState(() =>
    safeParse("screenSize", undefined)
  );

  const [user, setUser] = useState(() => safeParse("user", null));

  const [activeMain, setActiveMain] = useState(() =>
    safeParse("activeMain", initialMain)
  );

  const [currentUser, setCurrentUser] = useState(() =>
    safeParse("currentUser", false)
  );

  // Save to localStorage whenever state changes
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
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("activeMain", JSON.stringify(activeMain));
  }, [activeMain]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  const setActiveUser = (userData) => {
    try {
      if (!userData) {
        setUser(null);
        setCurrentUser(false);
        return;
      }

      const userWithRole = {
        ...userData,
        role: userData.role || "agent", // Default to 'agent' if role not provided
      };
      setUser(userWithRole);
      setCurrentUser(true);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("currentUser", true);
      localStorage.setItem("userRole", userWithRole.role);
    } catch (error) {
      console.error("Error setting active user:", error);
    }
  };

  const handleMainVisible = (main) => {
    const resetState = Object.keys(initialMain).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setActiveMain({ ...resetState, [main]: true });
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
        user,
        setActiveUser,
        activeMain,
        setActiveMain,
        handleMainVisible,
        currentUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
