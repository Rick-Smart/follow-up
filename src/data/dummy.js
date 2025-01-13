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
          USER_ROLES.HR,
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
