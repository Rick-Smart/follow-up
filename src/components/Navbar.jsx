// src/components/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Notifications, Settings } from "@mui/icons-material";
import { useUserContext } from "../contexts/UserContext";

const Navbar = () => {
  const { currentUser } = useUserContext();

  // Function to get initials if no profile picture
  const getInitials = (name) => {
    if (!name) return "UN"; // Undefined Name
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Notifications">
            <IconButton>
              <Notifications />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              alt={currentUser?.name || "User"}
              src={currentUser?.profilePicture}
              sx={{ width: 32, height: 32 }}
            >
              {!currentUser?.profilePicture && getInitials(currentUser?.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {currentUser?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser?.role || "Role"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
