import React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useMenuContext } from "../contexts/MenuContext";
import { useScreenSizeContext } from "../contexts/ScreenSizeContext";

import { NavLink } from "react-router-dom";

function ListItems({ items }) {
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    activeMain,
    handleMainVisible,
  } = useMenuContext();

  const currentRole = localStorage.getItem("userRole");

  const activeLink =
    "flex items-center gap-5 pl-4 rounded-lg text-white bg-gray-400 text-md m-2 cursor-pointer";
  const normalLink =
    "flex items-center gap-5 pl-4 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 cursor-pointer";

  const filterLinks = (links) => {
    return links.filter((link) => {
      if (!link.visibleTo) return true;
      return link.visibleTo.includes(currentRole);
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <List>
          {items.map((item) => (
            <div key={item.title}>
              <ListItem>
                <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
                  {item.title}
                </Typography>
              </ListItem>
              {filterLinks(item.links).map((link) => (
                <div
                  key={link.name}
                  onClick={() => handleMainVisible(`${link.name}`)}
                  className={activeMenu ? normalLink : activeLink}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{link.icon}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={link.name} />
                  </ListItem>
                </div>
              ))}
            </div>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default ListItems;
