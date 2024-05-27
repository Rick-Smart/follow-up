import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Chat, Notification, UserProfile, NavButton } from ".";
import { auth, signOut } from "../firebase.js";

// Dummy Avatar
import avatar from "../data/avatar.jpg";

// Context from react context store
import { useStateContext } from "../contexts/ContextProvider.js";

// function to sign out
const handleSignOut = () => {
  signOut(auth);
  auth.currentUser = null;
};

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    user,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between p-3 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="blue"
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Notifications"
          dotColor="#03C9D7"
          customFunc={() => handleClick("notification")}
          color="blue"
          icon={<RiNotification3Line />}
        />
        <NavButton
          title="Chat"
          dotColor={"#03C9D7"}
          customFunc={() => handleClick("chat")}
          color="blue"
          icon={<BsChatLeft />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={handleSignOut}
          >
            <img src={avatar} className="rounded-full w-8 h-8 " />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user && user.email}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {/* {isClicked.notification && <Notification />}
        {isClicked.chat && <Chat />}
        {isClicked.userProfile && <UserProfile />} */}
      </div>
    </div>
  );
};

export default Navbar;
