import React, { createContext, useContext, useState } from "react";

// Create Menu Context
const MenuContext = createContext();

// Menu Context Provider
export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [activeMain, setActiveMain] = useState({
    Profile: true,
    Employees: false,
    Urgent: false,
    Editor: false,
    Calendar: false,
    LineChart: false,
    Tickets: false,
    UserManagement: false,
  });
  const [isClicked, setIsClicked] = useState({
    chat: false,
    userProfile: false,
    notification: false,
  });

  const handleClick = (clicked) => {
    setIsClicked({ ...isClicked, [clicked]: true });
  };

  const handleMainVisible = (component) => {
    // Hide all components first
    const updatedActiveMain = {
      Profile: false,
      Employees: false,
      Urgent: false,
      Editor: false,
      Calendar: false,
      LineChart: false,
      Tickets: false,
      UserManagement: false,
    };

    // Show the selected component
    updatedActiveMain[component] = true;

    setActiveMain(updatedActiveMain);
  };

  return (
    <MenuContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        activeMain,
        setActiveMain,
        isClicked,
        handleClick,
        handleMainVisible,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to use Menu Context
export const useMenuContext = () => useContext(MenuContext);
