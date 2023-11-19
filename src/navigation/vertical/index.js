import {
  Mail,
  Home,
  User,
  Slack,
  Calendar,
  Chrome,
  Hash,
  MessageCircle,
  Twitch,
  BookOpen,
  Users,
  Target,
  CreditCard,
  Slash,
  Edit3,
  Pocket,
  File,
  Monitor,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Clock,
  ShoppingBag,
  Coffee,
  ThumbsUp
} from "react-feather"

export default [
  {
    header: "Dashboard"
  },
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  },
  {
    id: "announcement",
    title: "Announcement",
    icon: <MessageSquare size={20} />,
    navLink: "/announcement"
  },
  {
    id: "penalty",
    title: "Penalty",
    icon: <AlertCircle size={20} />,
    navLink: "/penalty"
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: <Calendar size={20} />,
    navLink: "/attendance"
  },
  {
    id: "reimburse",
    title: "Leave Reimbures",
    icon: <ShoppingBag size={20} />,
    navLink: "/reimburse"
  },
  {
    id: "meal-allowance",
    title: "Meal Allowance",
    icon: <Coffee size={20} />,
    navLink: "/meal-allowance"
  },
  {
    id: "correction-request",
    title: "Correction Request",
    icon: <MessageCircle size={20} />,
    navLink: "/correction-request"
  },
  {
    id: "leave-request",
    title: "Leave Request",
    icon: <Twitch size={20} />,
    navLink: "/leave-request"
  },
  {
    id: "overtime-request",
    title: "Overtime Request",
    icon: <Clock size={20} />,
    navLink: "/overtime-request"
  },

  { header: "e-Learning Employee" 
  },
  
  {
    id: "courses-employee",
    title: "Courses",
    icon: <BookOpen size={20} />,
    navLink: "/courses-employee"
  },
  {
    id: "group-employee",
    title: "Group",
    icon: <Users size={20} />,
    navLink: "/groups-employee"
  },

  {
    header: "e-Learning"
  },
  {
    id: "courses",
    title: "Courses",
    icon: <BookOpen size={20} />,
    navLink: "/courses"
  },
  {
    id: "group",
    title: "Group",
    icon: <Users size={20} />,
    navLink: "/groups"
  },
  {
    id: "quiz",
    title: "Quiz",
    icon: <Edit3 size={20} />,
    navLink: "/quiz"
  },

  {
    header: "Payroll"
  },
  {
    id: "Deductions",
    title: "Deductions",
    icon: <Pocket size={20} />,
    navLink: "/payroll-deduction"
  },
  {
    id: "Payrolls",
    title: "Payrolls",
    icon: <CreditCard size={20} />,
    navLink: "/payroll"
  },
  {
    id: "Loans",
    title: "Employee Loans",
    icon: <File size={20} />,
    navLink: "/loans"
  },
  {
    header : "master data"
  },
  {
    id: "employee",
    title: "User",
    icon: <User size={20} />,
    navLink: "/employee"
  },
  {
    id: "company",
    title: "Company",
    icon: <Target size={20} />,
    navLink: "/company"
  },
  {
    id: "office",
    title: "Office",
    icon: <Slack size={20} />,
    navLink: "/office"
  },
  {
    id: "department",
    title: "Department",
    icon: <Users size={20} />,
    navLink: "/department"
  },
  {
    id: "level-approval",
    title: "Level Approval",
    icon: <ThumbsUp size={20} />,
    navLink: "/level-approval"
  },
  {
    id: "leave-category",
    title: "Leave Category",
    icon: <Hash size={20} />,
    navLink: "/leave-category"
  },
  {
    id: "penalty-category",
    title: "Penalty Category",
    icon: <AlertTriangle size={20} />,
    navLink: "/penalty-category"
  },
  {
    id: "Days Off",
    title: "Days Off",
    icon: <Slash size={20} />,
    navLink: "/days-off"
  },
  {
    id: "Working Management",
    title: "Working Hours",
    icon: <Clock size={20} />,
    navLink: "/working-management"
  },
  {
    id: "assest",
    title: "Assets",
    icon: <Monitor size={20} />,
    navLink: "/assets"
  }
]
