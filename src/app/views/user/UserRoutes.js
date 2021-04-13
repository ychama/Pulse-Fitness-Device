import React from "react";
import {
  CalendarToday,
  AccountCircle,
  ChildFriendly,
} from "@material-ui/icons";
import Dashboard from "./Dashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import BluetoothIcon from "@material-ui/icons/Bluetooth";
import InfoIcon from "@material-ui/icons/Info";
const userRoutes = [
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    home: true,
    sidebarIcon: <AssessmentIcon fontSize="large" />,
  },
  {
    path: "/connect_device",
    name: "Connect Device",
    component: null,
    sidebarIcon: <BluetoothIcon fontSize="large" />,
  },
  {
    path: "/profile",
    name: "Profile",
    component: null,
    sidebarIcon: <AccountCircle fontSize="large" />,
  },
  {
    path: "/info",
    name: "Info",
    component: null,
    sidebarIcon: <InfoIcon fontSize="large" />,
  },
];

export default userRoutes;
