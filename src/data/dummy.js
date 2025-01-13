import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineStock,
  AiOutlineUser,
  AiOutlineExclamation,
} from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoMdContacts } from "react-icons/io";
import { RiCustomerServiceLine } from "react-icons/ri";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { USER_ROLES } from "../utils/userController";

// Existing exports
export const gridOrderImage = (props) => (
  <div>
    <img
      className="rounded-xl h-20 md:ml-3"
      src={props.ProductImage}
      alt="order-item"
    />
  </div>
);

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

export const kanbanGrid = [
  { headerText: "To Do", keyField: "Open", allowToggle: true },
  { headerText: "In Progress", keyField: "InProgress", allowToggle: true },
  {
    headerText: "Testing",
    keyField: "Testing",
    allowToggle: true,
    isExpanded: false,
  },
  { headerText: "Done", keyField: "Close", allowToggle: true },
];

export const scheduleData = [
  {
    Id: 1,
    Subject: "Explosion of Betelgeuse Star",
    Location: "Space Center USA",
    StartTime: "2024-05-14T04:00:00.000Z",
    EndTime: "2024-05-14T05:30:00.000Z",
    CategoryColor: "#1aaa55",
  },
  {
    Id: 2,
    Subject: "Thule Air Crash Report",
    Location: "Newyork City",
    StartTime: "2024-05-15T06:30:00.000Z",
    EndTime: "2024-05-15T08:30:00.000Z",
    CategoryColor: "#357cd2",
  },
];

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Profile",
        icon: <AiOutlineUser />,
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "Employees",
        icon: <IoMdContacts />,
      },
      {
        name: "Priority",
        icon: <AiOutlineExclamation />,
      },
      {
        name: "Tickets",
        icon: <RiCustomerServiceLine />,
      },
      {
        name: "User Management",
        icon: <MdOutlineSupervisorAccount />,
        visibleTo: [
          USER_ROLES.ADMIN,
          USER_ROLES.DIRECTOR,
          USER_ROLES.SR_OPERATIONS_MANAGER,
          USER_ROLES.OPERATIONS_MANAGER,
          USER_ROLES.COACH,
          USER_ROLES.HUMAN_RESOURCES,
        ],
      },
    ],
  },
  {
    title: "Apps",
    links: [
      {
        name: "Editor",
        icon: <FiEdit />,
      },
      {
        name: "Calendar",
        icon: <AiOutlineCalendar />,
      },
    ],
  },
  {
    title: "Charts",
    links: [
      {
        name: "LineChart",
        icon: <AiOutlineStock />,
      },
    ],
  },
];

// New Profile-related dummy data
export const profileData = {
  timeOff: {
    sickTime: {
      remaining: 40,
      used: 16,
      accrualRate: "3.33 hours per month",
      nextAccrual: "2024-02-01",
    },
    vacation: {
      remaining: 80,
      used: 24,
      accrualRate: "6.67 hours per month",
      nextAccrual: "2024-02-01",
    },
    personal: {
      remaining: 16,
      used: 8,
      accrualRate: "1.33 hours per month",
      nextAccrual: "2024-02-01",
    },
  },
  attendance: {
    occurrences: 1.5,
    lastOccurrence: "2024-01-05",
    attendanceScore: 98,
    occurrenceHistory: [
      { date: "2024-01-05", points: 0.5, reason: "Late arrival" },
      { date: "2023-12-15", points: 1.0, reason: "Unscheduled absence" },
    ],
    pointsExpiring: [
      { date: "2024-07-05", points: 0.5 },
      { date: "2024-06-15", points: 1.0 },
    ],
  },
  performance: {
    metrics: {
      fcr: {
        current: 85,
        target: 80,
        history: generateMetricHistory(85, 5, 12), // 12 months of data
      },
      crt: {
        current: 240, // seconds
        target: 300,
        history: generateMetricHistory(240, 30, 12),
      },
      nps: {
        current: 92,
        target: 85,
        history: generateMetricHistory(92, 3, 12),
      },
    },
    recentAchievements: [
      {
        date: "2024-01-15",
        title: "Top Performer",
        description: "Highest FCR for January",
      },
      {
        date: "2023-12-10",
        title: "Customer Champion",
        description: "Perfect NPS score for the week",
      },
    ],
  },
  training: {
    completed: [
      {
        id: 1,
        name: "Customer Service Excellence",
        completedDate: "2024-01-15",
        score: 95,
        validUntil: "2025-01-15",
      },
      {
        id: 2,
        name: "De-escalation Techniques",
        completedDate: "2023-12-10",
        score: 92,
        validUntil: "2024-12-10",
      },
      {
        id: 3,
        name: "Product Knowledge Update",
        completedDate: "2023-11-28",
        score: 88,
        validUntil: "2024-11-28",
      },
    ],
    upcoming: [
      {
        id: 1,
        name: "Advanced Technical Support",
        dueDate: "2024-02-15",
        estimatedDuration: "2 hours",
      },
      {
        id: 2,
        name: "Annual Compliance Training",
        dueDate: "2024-03-01",
        estimatedDuration: "1 hour",
      },
    ],
    coachings: [
      {
        id: 1,
        date: "2024-01-10",
        type: "Performance Review",
        notes: "Excellent customer handling",
        coach: "Jane Smith",
        followUpDate: "2024-02-10",
      },
      {
        id: 2,
        date: "2023-12-20",
        type: "Quality Monitoring",
        notes: "Great attention to detail",
        coach: "Mike Johnson",
        followUpDate: "2024-01-20",
      },
    ],
    certifications: [
      {
        name: "Advanced Customer Support",
        earnedDate: "2023-11-15",
        expiryDate: "2024-11-15",
        status: "active",
        certificationBody: "Customer Service Institute",
      },
      {
        name: "Technical Support Level 2",
        earnedDate: "2023-09-01",
        expiryDate: "2024-09-01",
        status: "active",
        certificationBody: "Technical Support Association",
      },
    ],
  },
  schedule: {
    currentShift: "9:00 AM - 5:00 PM EST",
    nextShift: "2024-01-14 09:00:00",
    teamName: "Customer Support Team A",
    supervisor: "Jane Smith",
    department: "Customer Support",
    location: "Remote - EST",
    breaks: [
      { type: "Lunch", duration: "60 mins", defaultTime: "12:00 PM" },
      { type: "Break 1", duration: "15 mins", defaultTime: "10:30 AM" },
      { type: "Break 2", duration: "15 mins", defaultTime: "2:30 PM" },
    ],
  },
};

// Helper function to generate random metric history
function generateMetricHistory(currentValue, variance, months) {
  return Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      value: Math.max(0, currentValue + (Math.random() - 0.5) * variance * 2),
    };
  }).reverse();
}
