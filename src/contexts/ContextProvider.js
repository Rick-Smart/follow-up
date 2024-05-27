import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
};

const initialMain = {
  profile: false,
  employees: false,
  priority: false,
  editor: false,
  calendar: false,
  lineChart: false,
};
// refactor into 2 contexts 1: for auth and 2: for application state

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [user, setUser] = useState(null);
  const [activeMain, setActiveMain] = useState(initialMain);
  const [currentUser, setCurrentUser] = useState(false);

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  const setActiveUser = (userData) => {
    setUser(userData);
    setCurrentUser(true);
  };

  const handleMainVisible = (main) => {
    setActiveMain({ ...initialMain, [main]: true });
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
