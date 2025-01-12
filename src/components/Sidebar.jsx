import React from "react";
import { Link } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import ListItems from "./ListItems";

// Dummy Data for testing
import { links } from "../data/dummy";
// import for react context store
import { useMenuContext } from "../contexts/MenuContext";
import { useScreenSizeContext } from "../contexts/ScreenSizeContext";

const Sidebar = () => {
  // context provided by react context
  const { activeMenu, setActiveMenu } = useMenuContext();
  const { screenSize } = useScreenSizeContext();

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
          <ListItems items={links} />
        </>
      )}
    </div>
  );
};

export default Sidebar;
