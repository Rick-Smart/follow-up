import React from "react";
import { Link } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import ListItems from "./ListItems";
import { useUserContext } from "../contexts/UserContext"; // Import UserContext

// Dummy Data for testing
import { links } from "../data/dummy";
import { useMenuContext } from "../contexts/MenuContext";
import { useScreenSizeContext } from "../contexts/ScreenSizeContext";

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useMenuContext();
  const { screenSize } = useScreenSizeContext();
  const { currentUser } = useUserContext(); // Get current user from context

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/profile"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <SiShopware />
              <span>Follow-UP</span>
            </Link>
          </div>
          <ListItems items={links} currentUser={currentUser} />{" "}
          {/* Pass currentUser to ListItems */}
        </>
      )}
    </div>
  );
};

export default Sidebar;
