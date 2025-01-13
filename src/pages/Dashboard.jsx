import React, { useMemo } from "react";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useMenuContext } from "../contexts/MenuContext";
import { Navigate } from "react-router-dom";
import { Navbar, Footer, Sidebar, ThemeSettings } from "../components";
import {
  Calendar,
  Employees,
  Notes,
  Urgent,
  LineChart,
  Profile,
  Tickets,
  UserManagement,
} from ".";
import { auth } from "../firebase";
import { useUserContext } from "../contexts/UserContext";

function Dashboard() {
  const { activeMenu, activeMain } = useMenuContext();
  const { currentUser } = useUserContext();

  // Move useMemo before any conditional returns
  const mainContent = useMemo(() => {
    return (
      <main className="m-4">
        <div className={!activeMain.Profile ? "hidden" : undefined}>
          <Profile />
        </div>
        <div className={!activeMain.Employees ? "hidden" : undefined}>
          <Employees />
        </div>
        <div className={!activeMain.Priority ? "hidden" : undefined}>
          <Urgent />
        </div>
        <div className={!activeMain.Editor ? "hidden" : undefined}>
          <Notes />
        </div>
        <div className={!activeMain.Calendar ? "hidden" : undefined}>
          <Calendar />
        </div>
        <div className={!activeMain.LineChart ? "hidden" : undefined}>
          <LineChart />
        </div>
        <div className={!activeMain.Tickets ? "hidden" : undefined}>
          <Tickets />
        </div>
        <div className={!activeMain.UserManagement ? "hidden" : undefined}>
          <UserManagement />
        </div>
      </main>
    );
  }, [activeMain]);

  // Move authentication check after hooks
  if (!currentUser || !auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Settings Button */}
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
            style={{ background: "blue", borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          activeMenu ? "w-72 fixed" : "w-0"
        } sidebar dark:bg-secondary-dark-bg bg-white`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
          activeMenu ? "md:ml-72" : "flex-2"
        }`}
      >
        {/* Navbar */}
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        {/* Content Area */}
        {mainContent}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
