import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box,
} from "@mui/material";

export const AttendanceCard = ({ attendance }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Attendance Overview
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          color={
            attendance.attendanceScore >= 95 ? "success.main" : "warning.main"
          }
        >
          {attendance.attendanceScore}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Attendance Score
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Recent Occurrences
      </Typography>
      <List>
        {attendance.occurrenceHistory.map((occurrence, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={occurrence.reason}
              secondary={new Date(occurrence.date).toLocaleDateString()}
            />
            <Chip
              label={`${occurrence.points} points`}
              size="small"
              color="warning"
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
