import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const MetricCard = ({
  title,
  description,
  data,
  dataKey,
  color,
  target,
}) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {description}
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Actual"
              stroke={color}
              strokeWidth={2}
            />
            {target && (
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#666"
                strokeDasharray="3 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// src/components/profile/TimeOffCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Tooltip,
} from "@mui/material";

export const TimeOffCard = ({ title, data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {data.remaining}h
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Tooltip
          title={`Used: ${data.used}h / Total: ${data.remaining + data.used}h`}
        >
          <LinearProgress
            variant="determinate"
            value={(data.used / (data.remaining + data.used)) * 100}
          />
        </Tooltip>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Accrual Rate: {data.accrualRate}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Next Accrual: {new Date(data.nextAccrual).toLocaleDateString()}
      </Typography>
    </CardContent>
  </Card>
);

// src/components/profile/CertificationCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { School } from "@mui/icons-material";

export const CertificationCard = ({ certifications }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Certifications
      </Typography>
      <List>
        {certifications.map((cert, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {cert.name}
                  <Chip
                    size="small"
                    label={cert.status}
                    color={cert.status === "active" ? "success" : "error"}
                  />
                </Box>
              }
              secondary={`Valid until: ${new Date(
                cert.expiryDate
              ).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

// src/components/profile/AttendanceCard.jsx
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
