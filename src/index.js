import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/authContext";
import { UserProvider } from "./contexts/UserContext";
import { MenuProvider } from "./contexts/MenuContext";
import { ScreenSizeProvider } from "./contexts/ScreenSizeContext";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <MenuProvider>
            <ScreenSizeProvider>
              <App />
            </ScreenSizeProvider>
          </MenuProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
