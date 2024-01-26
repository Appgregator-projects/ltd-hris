import { useEffect } from "react";
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
     ThumbsUp,
     Table,
} from "react-feather"
import { MdOutlineDynamicForm } from "react-icons/md";
import { RiFilePaperLine, RiNumber9 } from "react-icons/ri";
export const BankNameData = [
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK RAKYAT INDONESIA",
          "beneBankNetworkIdRTGS": "BRINIDJA",
          "beneBankNetworkIdLLG": "20307",
          "beneSortBankName": "BRI",
          "id": 200,
          "beneBankId": "002"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK MANDIRI",
          "beneBankNetworkIdRTGS": "BMRIIDJA",
          "beneBankNetworkIdLLG": "80017",
          "beneSortBankName": "MANDIRI",
          "id": 201,
          "beneBankId": "008"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK NEGARA INDONESIA 1946",
          "beneBankNetworkIdRTGS": "BNINIDJA",
          "beneBankNetworkIdLLG": "90010",
          "beneSortBankName": "BNI",
          "id": 202,
          "beneBankId": "009"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK CENTRAL ASIA",
          "beneBankNetworkIdRTGS": "CENAIDJA",
          "beneBankNetworkIdLLG": "140397",
          "beneSortBankName": "BCA",
          "id": 203,
          "beneBankId": "014"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK OCBC NISP",
          "beneBankNetworkIdRTGS": "NISPIDJA",
          "beneBankNetworkIdLLG": "280024",
          "beneSortBankName": "OCBCNISP",
          "id": 204,
          "beneBankId": "028"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK DBS INDONESIA",
          "beneBankNetworkIdRTGS": "DBSBIDJA",
          "beneBankNetworkIdLLG": "460307",
          "beneSortBankName": "DBS",
          "id": 205,
          "beneBankId": "046"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK DANAMON",
          "beneBankNetworkIdRTGS": "BDINIDJA",
          "beneBankNetworkIdLLG": "110165",
          "beneSortBankName": "DANAMON",
          "id": 206,
          "beneBankId": "011"
     },
     {
          "beneBankBranchName": "JAKARTA SELATAN",
          "beneBankName": "BANK NEGARA INDONESIA SYARIAH",
          "beneBankNetworkIdRTGS": "SYNIIDJ1",
          "beneBankNetworkIdLLG": "4270027",
          "beneSortBankName": "BNI SYARIAH",
          "id": 207,
          "beneBankId": "427"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK SYARIAH BRI",
          "beneBankNetworkIdRTGS": "SYBRIDJ1",
          "beneBankNetworkIdLLG": "4220051",
          "beneSortBankName": "BRI SYARIAH",
          "id": 208,
          "beneBankId": "422"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK SYARIAH INDONESIA",
          "beneBankNetworkIdRTGS": "BSMDIDJA",
          "beneBankNetworkIdLLG": "4510017",
          "beneSortBankName": "BSI",
          "id": 209,
          "beneBankId": "451"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK BCA SYARIAH",
          "beneBankNetworkIdRTGS": "SYCAIDJ1",
          "beneBankNetworkIdLLG": "5360017",
          "beneSortBankName": "BCA SYARIAH",
          "id": 210,
          "beneBankId": "536"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK MUAMALAT INDONESIA",
          "beneBankNetworkIdRTGS": "MUABIDJA",
          "beneBankNetworkIdLLG": "1470011",
          "beneSortBankName": "BMI",
          "id": 211,
          "beneBankId": "147"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK SINARMAS",
          "beneBankNetworkIdRTGS": "SBJKIDJA",
          "beneBankNetworkIdLLG": "1530016",
          "beneSortBankName": "SINARMAS",
          "id": 212,
          "beneBankId": "153"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK MASPION INDONESIA",
          "beneBankNetworkIdRTGS": "MASIDJD1",
          "beneBankNetworkIdLLG": "1570018",
          "beneSortBankName": "MASPION",
          "id": 213,
          "beneBankId": "157"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK PERMATA",
          "beneBankNetworkIdRTGS": "BBBAIDJA",
          "beneBankNetworkIdLLG": "130307",
          "beneSortBankName": "PERMATA",
          "id": 214,
          "beneBankId": "013"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK MAYBANK INDONESIA",
          "beneBankNetworkIdRTGS": "IBBKIDJA",
          "beneBankNetworkIdLLG": "160131",
          "beneSortBankName": "MAYBANK",
          "id": 215,
          "beneBankId": "016"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK PANIN",
          "beneBankNetworkIdRTGS": "PINBIDJA",
          "beneBankNetworkIdLLG": "190017",
          "beneSortBankName": "PANIN",
          "id": 216,
          "beneBankId": "019"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "BANK CIMB NIAGA",
          "beneBankNetworkIdRTGS": "BNIAIDJA",
          "beneBankNetworkIdLLG": "220026",
          "beneSortBankName": "CIMB NIAGA",
          "id": 217,
          "beneBankId": "022"
     },
     {
          "beneBankBranchName": "WAHID HASYIM",
          "beneBankName": "BANK UOB INDONESIA",
          "beneBankNetworkIdRTGS": "BBIJIDJA",
          "beneBankNetworkIdLLG": "230090",
          "beneSortBankName": "UOB INDONESIA",
          "id": 218,
          "beneBankId": "023"
     },
     {
          "beneBankBranchName": "KANTOR PUSAT",
          "beneBankName": "INDONESIA EXIMBANK",
          "beneBankNetworkIdRTGS": "LPEIIDJ1",
          "beneBankNetworkIdLLG": "0000000",
          "beneSortBankName": "EXIM",
          "id": 219,
          "beneBankId": "000"
     }
]

export const dataSidebar = [
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
     // {
     //   id: "reimburse",
     //   title: "Leave Reimbures",
     //   icon: <ShoppingBag size={20} />,
     //   navLink: "/reimburse"
     // },
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
     {
          id: "digitalization",
          title: "Digitalization",
          icon: <MdOutlineDynamicForm size={20} />,
          navLink: "/digitalization"
     },

     {
          header: "e-Learning"
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
          id: "scores",
          title: "Scores",
          icon: <RiNumber9 size={20} />,
          navLink: "/scores"
     },
     {
          header: "e-Learning Master"
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
          header: "master data"
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
     // {
     //   id: "penalty-category",
     //   title: "Penalty Category",
     //   icon: <AlertTriangle size={20} />,
     //   navLink: "/penalty-category"
     // },
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
     },
     {
          id: "form-builder",
          title: "Form Builder",
          icon: <RiFilePaperLine size={20} />,
          navLink: "/form-builder"
     },
     {
          id: "table-builder",
          title: "Table Builder",
          icon: <Table size={20} />,
          navLink: "/table-builder"
     }
]