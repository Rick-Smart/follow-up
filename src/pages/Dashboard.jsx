import React, { useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";
import { Navbar, Footer, Sidebar, ThemeSettings } from "../components";
import { Calendar, Employees, Notes, Urgent, LineChart, Profile, Tickets } from ".";
import { auth, onAuthStateChanged } from "../firebase";

function Dashboard() {
  const { activeMenu, activeMain, setActiveUser } = useStateContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setActiveUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {!auth.currentUser && <Navigate to={"/"} replace={true} />}
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-grey text-white"
              style={{ background: "blue", borderRadius: "50%" }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? "md:ml-72" : "flex-2"
          }`}
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-bg navbar w-full">
            <Navbar />
          </div>
          <main>
            <div className={!activeMain.Profile && "hidden"}>
              <Profile />
            </div>
            <div className={!activeMain.Employees && "hidden"}>
              <Employees />
            </div>
            <div className={!activeMain.Priority && "hidden"}>
              <Urgent />
            </div>
            <div className={!activeMain.Editor && "hidden"}>
              <Notes />
            </div>
            <div className={!activeMain.Calendar && "hidden"}>
              <Calendar />
            </div>
            <div className={!activeMain.LineChart && "hidden"}>
              <LineChart />
            </div>
            <div className={!activeMain.Tickets && "hidden"}>
              <Tickets />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;