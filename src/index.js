import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { MenuProvider } from "./contexts/MenuContext";
import { ScreenSizeProvider } from "./contexts/ScreenSizeContext";

ReactDOM.render(
  <UserProvider>
    <MenuProvider>
      <ScreenSizeProvider>
        <App />
      </ScreenSizeProvider>
    </MenuProvider>
  </UserProvider>,
  document.getElementById("root")
);
