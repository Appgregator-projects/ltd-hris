import { Mail, Home, User, Slack, Calendar, Chrome, Hash, MessageCircle, Twitch } from "react-feather";

export default [
  {
    header: 'Dashboard'
  },
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: <Calendar size={20} />,
    navLink: "/attendance",
  },
  {
    id: "correction-request",
    title: "Correction Request",
    icon: <MessageCircle size={20} />,
    navLink: "/correction-request",
  },
  {
    id: "leave-request",
    title: "Leave Request",
    icon: <Twitch size={20} />,
    navLink: "/leave-request",
  },
  {
    header: 'Master data'
  },
  {
    id: "employee",
    title: "Users",
    icon: <User size={20} />,
    navLink: "/employee",
  },
  // {
  //   id: "company",
  //   title: "Company",
  //   icon: <Slack size={20} />,
  //   navLink: "/company",
  // },
  {
    id: "office",
    title: "Office",
    icon: <Slack size={20} />,
    navLink: "/office",
  },
  {
    id: "division",
    title: "Division",
    icon: <Chrome size={20} />,
    navLink: "/division",
  },
  {
    id: "leave-category",
    title: "Leave Category",
    icon: <Hash size={20} />,
    navLink: "/leave-category",
  },
];
