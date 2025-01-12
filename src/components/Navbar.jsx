import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line, RiLogoutCircleRLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { NavButton } from ".";
import { signOutUser } from "../utils/authController";
import { generateTestUsers } from "../testing/testingControls";
import { useNavigate } from "react-router-dom";

// Dummy Avatar
import avatar from "../data/avatar.jpg";

// Context from react context store
import { useMenuContext } from "../contexts/MenuContext";
import { useScreenSizeContext } from "../contexts/ScreenSizeContext";
import { useUserContext } from "../contexts/UserContext";

const Navbar = () => {
  const { setActiveMenu } = useMenuContext();

  const { setScreenSize } = useScreenSizeContext();
  const { user } = useUserContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error during logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [setActiveMenu]);

  const handleGenerateTestUsers = async () => {
    setIsGenerating(true);
    try {
      await generateTestUsers(10);
      alert("10 test users created successfully!");
    } catch (error) {
      console.error("Error generating test users:", error);
      alert("Error generating test users. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

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
          title="Generate Test Users"
          customFunc={handleGenerateTestUsers}
          color="blue"
          icon={
            isGenerating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span className="text-sm">🧪</span> // Test tube emoji
            )
          }
          disabled={isGenerating}
        />
        <NavButton
          title="Notifications"
          dotColor="#03C9D7"
          customFunc={() => {}}
          color="blue"
          icon={<RiNotification3Line />}
        />
        <NavButton
          title="Chat"
          dotColor={"#03C9D7"}
          customFunc={() => {}}
          color="blue"
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Logout"
          customFunc={handleSignOut}
          color="red"
          icon={
            isLoggingOut ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <RiLogoutCircleRLine />
            )
          }
          disabled={isLoggingOut}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg">
            <img
              src={avatar}
              alt="User avatar"
              className="rounded-full w-8 h-8 "
            />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user && user.email}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
      </div>
    </div>
  );
};

export default Navbar;
