import React, { useState } from "react";
import { Header } from "../components";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Person as UserIcon,
  Timeline as LineChartIcon,
  School as TrainingIcon,
  WorkHistory as AttendanceIcon,
  AccessTime as TimeOffIcon,
  Grade as PerformanceIcon,
  School as SchoolIcon,
  Grade,
} from "@mui/icons-material";
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
import { getCurrentUser } from "../utils/authController";

// Tabs Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Generate dummy data for metrics
const generateDummyData = (metric, days = 30) => {
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    [metric]: Math.round(Math.random() * 100),
  }));
};

// Metric Card Component
const MetricCard = ({ title, description, data, dataKey, color }) => (
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
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);

  // Dummy data for demonstration
  const employeeInfo = {
    timeOff: {
      sickTime: { remaining: 40, used: 16 },
      vacation: { remaining: 80, used: 24 },
      personal: { remaining: 16, used: 8 },
    },
    attendance: {
      occurrences: 1.5,
      lastOccurrence: "2024-01-05",
      attendanceScore: 98,
    },
    training: [
      {
        id: 1,
        name: "Customer Service Excellence",
        completedDate: "2024-01-15",
        score: 95,
      },
      {
        id: 2,
        name: "De-escalation Techniques",
        completedDate: "2023-12-10",
        score: 92,
      },
      {
        id: 3,
        name: "Product Knowledge Update",
        completedDate: "2023-11-28",
        score: 88,
      },
    ],
    coachings: [
      {
        id: 1,
        date: "2024-01-10",
        type: "Performance Review",
        notes: "Excellent customer handling",
      },
      {
        id: 2,
        date: "2023-12-20",
        type: "Quality Monitoring",
        notes: "Great attention to detail",
      },
    ],
    certifications: [
      {
        name: "Advanced Customer Support",
        earnedDate: "2023-11-15",
        expiryDate: "2024-11-15",
      },
      {
        name: "Technical Support Level 2",
        earnedDate: "2023-09-01",
        expiryDate: "2024-09-01",
      },
    ],
  };

  // Metrics data
  const fcrData = generateDummyData("fcr");
  const crtData = generateDummyData("crt");
  const npsData = generateDummyData("nps");

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Dashboard" title="Profile" />

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="profile tabs"
          >
            <Tab icon={<TimeOffIcon />} iconPosition="start" label="Time Off" />
            <Tab
              icon={<AttendanceIcon />}
              iconPosition="start"
              label="Attendance"
            />
            <Tab
              icon={<LineChartIcon />}
              iconPosition="start"
              label="Performance"
            />
            <Tab
              icon={<TrainingIcon />}
              iconPosition="start"
              label="Training & Development"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sick Time
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {employeeInfo.timeOff.sickTime.remaining}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used: {employeeInfo.timeOff.sickTime.used}h
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Vacation
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {employeeInfo.timeOff.vacation.remaining}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used: {employeeInfo.timeOff.vacation.used}h
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Time
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {employeeInfo.timeOff.personal.remaining}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used: {employeeInfo.timeOff.personal.used}h
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Overview
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Current Occurrences"
                    secondary={employeeInfo.attendance.occurrences}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Occurrence Date"
                    secondary={employeeInfo.attendance.lastOccurrence}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Attendance Score"
                    secondary={`${employeeInfo.attendance.attendanceScore}%`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <MetricCard
            title="First Contact Resolution (FCR)"
            description="Percentage of customer inquiries resolved in first contact"
            data={fcrData}
            dataKey="fcr"
            color="#0ea5e9"
          />
          <MetricCard
            title="Customer Response Time (CRT)"
            description="Average time to respond to customer inquiries"
            data={crtData}
            dataKey="crt"
            color="#10b981"
          />
          <MetricCard
            title="Net Promoter Score (NPS)"
            description="Customer satisfaction and loyalty metric"
            data={npsData}
            dataKey="nps"
            color="#8b5cf6"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Training Completion
                  </Typography>
                  <List>
                    {employeeInfo.training.map((training) => (
                      <ListItem key={training.id}>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={training.name}
                          secondary={`Completed: ${training.completedDate} - Score: ${training.score}%`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Coachings
                  </Typography>
                  <List>
                    {employeeInfo.coachings.map((coaching) => (
                      <ListItem key={coaching.id}>
                        <ListItemIcon>
                          <PerformanceIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={coaching.type}
                          secondary={`${coaching.date} - ${coaching.notes}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Certifications
                  </Typography>
                  <List>
                    {employeeInfo.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Grade />
                        </ListItemIcon>
                        <ListItemText
                          primary={cert.name}
                          secondary={`Earned: ${cert.earnedDate} | Expires: ${cert.expiryDate}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </div>
  );
};

export default Profile;
