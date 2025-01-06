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
};

export const ContextProvider = ({ children }) => {
  // Load state from localStorage or use initial values
  const [activeMenu, setActiveMenu] = useState(() => {
    const saved = localStorage.getItem('activeMenu');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isClicked, setIsClicked] = useState(() => {
    const saved = localStorage.getItem('isClicked');
    return saved !== null ? JSON.parse(saved) : initialState;
  });

  const [screenSize, setScreenSize] = useState(() => {
    const saved = localStorage.getItem('screenSize');
    return saved !== null ? JSON.parse(saved) : undefined;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [activeMain, setActiveMain] = useState(() => {
    const saved = localStorage.getItem('activeMain');
    return saved !== null ? JSON.parse(saved) : initialMain;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('activeMenu', JSON.stringify(activeMenu));
  }, [activeMenu]);

  useEffect(() => {
    localStorage.setItem('isClicked', JSON.stringify(isClicked));
  }, [isClicked]);

  useEffect(() => {
    localStorage.setItem('screenSize', JSON.stringify(screenSize));
  }, [screenSize]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('activeMain', JSON.stringify(activeMain));
  }, [activeMain]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);


  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  const setActiveUser = (userData) => {
    setUser(userData);
    setCurrentUser(true);
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

// -----------------------------------------------------------------------------------------

// import React, { createContext, useContext, useState } from "react";

// const StateContext = createContext();

// const initialState = {
//   chat: false,
//   userProfile: false,
//   notification: false,
// };

// const initialMain = {
//   Profile: true,
//   Employees: false,
//   Priority: false,
//   Editor: false,
//   Calendar: false,
//   LineChart: false,
// };
// // refactor into 2 contexts 1: for auth and 2: for application state

// export const ContextProvider = ({ children }) => {
//   const [activeMenu, setActiveMenu] = useState(true);
//   const [isClicked, setIsClicked] = useState(initialState);
//   const [screenSize, setScreenSize] = useState(undefined);
//   const [user, setUser] = useState(null);
//   const [activeMain, setActiveMain] = useState(initialMain);
//   const [currentUser, setCurrentUser] = useState(false);

//   const handleClick = (clicked) => {
//     setIsClicked({ ...initialState, [clicked]: true });
//   };

//   const setActiveUser = (userData) => {
//     setUser(userData);
//     setCurrentUser(true);
//   };

//   const handleMainVisible = (main) => {
//     setActiveMain({ ...initialMain, Profile: false, [main]: true });
//   };

//   return (
//     <StateContext.Provider
//       value={{
//         activeMenu,
//         setActiveMenu,
//         isClicked,
//         setIsClicked,
//         handleClick,
//         screenSize,
//         setScreenSize,
//         user,
//         setActiveUser,
//         activeMain,
//         setActiveMain,
//         handleMainVisible,
//         currentUser,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);

