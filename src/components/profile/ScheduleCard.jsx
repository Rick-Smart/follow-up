// src/components/profile/ScheduleCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { AccessTime, SupervisorAccount, LocationOn } from "@mui/icons-material";

export const ScheduleCard = ({ schedule }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Schedule Information
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText
            primary="Current Shift"
            secondary={schedule.currentShift}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SupervisorAccount />
          </ListItemIcon>
          <ListItemText primary="Supervisor" secondary={schedule.supervisor} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText primary="Location" secondary={schedule.location} />
        </ListItem>
      </List>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Break Schedule
      </Typography>
      <List dense>
        {schedule.breaks.map((break_, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={break_.type}
              secondary={`${break_.defaultTime} - ${break_.duration}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
