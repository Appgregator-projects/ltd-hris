// ** React Imports
import { Fragment, lazy, useEffect } from "react"
import { Navigate } from "react-router-dom"
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "../../@core/components/routes/PublicRoute"
import PrivateRoute from "../../@core/components/routes/PrivateRoute"
import { useSelector, useDispatch } from "react-redux"

// ** Utils
import { isObjEmpty } from "@utils"
// import { menuAbility } from "../../utility/Utils";

import AuthRoutes from "./auth"
import LmsRoutes from "./lms"
import LoanIndex from "../../views/pages/Payroll/LoanIndex"
import NotAuthorized from "../../views/NotAuthorized"
import ImportComponent from "../../@core/components/import"
import MigrationPayroll from "../../views/pages/Migration/MigrationPayroll"
import PayrollNonManagementIndex from "../../views/pages/PayrollNonManagement/PayrollNonManagementIndex"
import PayrollFormNonManagement from "../../views/pages/PayrollNonManagement/PayrollForm"
import PayrollViewNonManagement from "../../views/pages/PayrollNonManagement/PayrollView"
import ImportEmployee from "../../views/pages/employee/ImportEmployee"
import SppdIndex from "../../views/pages/SPPD/SppdIndex"
import SppdForm from "../../views/pages/SPPD/SppdForm"
import PreviewCard from "../../views/pages/SPPD/DraftCard"
import InvoicePreviewSPPD from "../../views/pages/SPPD/DraftInvoice"
import Print from "../../views/pages/SPPD/PrintInvoice"


const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "%s - HRIS portal"

// ** Default Route
const DefaultRoute = "/home"

const Home = lazy(() => import("../../views/Home"))
const SecondPage = lazy(() => import("../../views/SecondPage"))
const Login = lazy(() => import("../../views/Login"))
const Register = lazy(() => import("../../views/Register"))
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"))
const Error = lazy(() => import("../../views/Error"))
const Employee = lazy(() => import("../../views/pages/employee/EmployeeIndex"))
const EmployeeDetail = lazy(() => import("../../views/pages/employee/EmployeeDetail"))
const Office = lazy(() => import("../../views/pages/Office/OfficeIndex"))
const OfficeDetail = lazy(() => import("../../views/pages/Office/OfficeDetail"))
// const Shift = lazy(() => import("../../views/pages/Shift/ShiftIndex"));
const Department = lazy(() => import("../../views/pages/Division/DepartmentIndex"))
const LeaveCategory = lazy(() => import("../../views/pages/LeaveCategory/LeaveCategoryIndex"))
const Attendance = lazy(() => import("../../views/pages/Attendance/AttendanceIndex"))
const CorrectionRequest = lazy(() => import("../../views/pages/CorrectionRequest"))
const LeaveRequest = lazy(() => import("../../views/pages/LeaveRequest/LeaveRequest"))
const CompanyIndex = lazy(() => import("../../views/pages/Company/CompanyIndex"))
const DaysOff = lazy(() => import("../../views/pages/DaysOff/DaysOffIndex"))
const PayrollDeduction = lazy(() => import("../../views/pages/Payroll/PayrollDeduction"))
const PayrollIndex = lazy(() => import("../../views/pages/Payroll/PayrolIndex"))
const PayrollForm = lazy(() => import("../../views/pages/Payroll/PayrollForm"))
const PayrollView = lazy(() => import("../../views/pages/Payroll/PayrollView"))
const AssetIndex = lazy(() => import("../../views/pages/Assets/AssetIndex"))
const Announcement = lazy(() => import("../../views/pages/Announcement/AnnouncementIndex"))
const Penalty = lazy(() => import("../../views/pages/Penalty/PenaltyIndex"))
const PenaltyCategory = lazy(() => import("../../views/pages/PenaltyCategory/PenaltyCategoryIndex"))
const OvertimeRequest = lazy(() => import("../../views/pages/Overtime Request/OvertimeRequest"))
const Reimburse = lazy(() => import("../../views/pages/Reimburse/ReimburseIndex"))
const MealAllowance = lazy(() => import("../../views/pages/MealAllowance/MealIndex"))
const LevelApproval = lazy(() => import("../../views/pages/LevelApproval/LevelIndex"))
const WorkingManagement = lazy(() => import("../../views/pages/Working Management/WorkingIndex"))
const FormBuilder = lazy(() => import("../../views/pages/FormBuilder/index"))
const FormBuilderCreate = lazy(() => import("../../views/pages/FormBuilder/Form"))
const DigitalizationIndex = lazy(() => import("../../views/pages/Digitalization/DigitalizationIndex"))
const DigitalizationForm = lazy(() => import("../../views/pages/Digitalization/DigitalizationForm"))
const TableBuilderIndex = lazy(() => import("../../views/pages/TableBuilder/TableBuilderIndex"))
const TableBuilderCreate = lazy(() => import("../../views/pages/TableBuilder/TableBuilderCreate"))


// ** Merge Routes
const Routes = [
  ...AuthRoutes,
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      action: "read",
      resource: "MENU HOME"
    }
  },
  {
    path: "/announcement",
    element: <Announcement />,
    meta: {
      action: "read",
      resource: "MENU ANNOUNCEMENT"
    }
  },
  {
    path: "/penalty",
    element: <Penalty />,
    meta: {
      action: "read",
      resource: "MENU PENALTY"
    }
  },
  {
    path: "/attendance",
    element: <Attendance />,
    meta: {
      action: "read",
      resource: "MENU ATTENDANCE"
    }
  },
  {
    path: "/reimburse",
    element: <Reimburse />,
    meta: {
      action: "read",
      resource: "MENU REIMBURSE"
    }
  },
  {
    path: "/meal-allowance",
    element: <MealAllowance />,
    meta: {
      action: "read",
      resource: "MENU MEAL"
    }
  },
  {
    path: "/correction-request",
    element: <CorrectionRequest />,
    meta: {
      action: "read",
      resource: "MENU CORRECTION REQUEST"
    }
  },
  {
    path: "/leave-request",
    element: <LeaveRequest />,
    meta: {
      action: "read",
      resource: "MENU LEAVE REQUEST"
    }
  },
  {
    path: "/overtime-request",
    element: <OvertimeRequest />,
    meta: {
      action: "read",
      resource: "MENU LEAVE REQUEST"
    }
  },
  {
    path: "/employee",
    element: <Employee />,
    meta: {
      action: "read",
      resource: "MENU EMPLOYEE"
    }
  },
  {
    path: "/employee/:uid",
    element: <EmployeeDetail />,
    meta: {
      action: "read",
      resource: "MENU EMPLOYEE"
    }
  },
  {
    path: "/import-employee",
    element: <ImportEmployee />,
    meta: {
      action: "read",
      resource: "MENU EMPLOYEE"
    }
  },
  {
    path: "/office",
    element: <Office />,
    meta: {
      action: "read",
      resource: "BRANCHES"
    }
  },
  {
    path: "/department",
    element: <Department />,
    meta: {
      action: "read",
      resource: "DIVISIONS"
    }
  },
  {
    path: "/company",
    element: <CompanyIndex />,
    meta: {
      action: "read",
      resource: "COMPANIES"
    }
  },
  {
    path: "/level-approval",
    element: <LevelApproval />,
    meta: {
      action: "read",
      resource: "LEVEL APPROVAL"
    }
  },
  {
    path: "/leave-category",
    element: <LeaveCategory />,
    meta: {
      action: "read",
      resource: "LEAVE CATEGORY"
    }
  },
  {
    path: "/penalty-category",
    element: <PenaltyCategory />,
    meta: {
      action: "read",
      resource: "PENALTY CATEGORY"
    }
  },
  {
    path: "/payroll-deduction",
    element: <PayrollDeduction />,
    meta: {
      action: "read",
      resource: "PAYROLL_DEDUCTION"
    }
  },
  {
    path: "/payroll",
    element: <PayrollIndex />,
    meta: {
      action: "read",
      resource: "PAYROLL_INDEX"
    }
  },
  {
    path: "/payroll-form",
    element: <PayrollForm />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll/:id",
    element: <PayrollView />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll/:id/edit",
    element: <PayrollForm />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll/import/employee-income",
    element: <ImportComponent />,
    meta: {
      action: "read",
      resource: "PAYROLL_INDEX"
    }
  },
  {
    path: "/payroll-non-management",
    element: <PayrollNonManagementIndex />,
    meta: {
      action: "read",
      resource: "PAYROLL_INDEX"
    }
  },
  {
    path: "/payroll-non-management/form",
    element: <PayrollFormNonManagement />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll-non-management/:id",
    element: <PayrollViewNonManagement />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll-non-management/:id/edit",
    element: <PayrollFormNonManagement />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/payroll/import/employee-income",
    element: <ImportComponent />,
    meta: {
      action: "read",
      resource: "PAYROLL_INDEX"
    }
  },
  {
    path: "/loans",
    element: <LoanIndex />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/assets",
    element: <AssetIndex />,
    meta: {
      action: "read",
      resource: "PAYROLL_FORM"
    }
  },
  {
    path: "/days-off",
    element: <DaysOff />,
    meta: {
      action: "read",
      resource: "DAYSOFF"
    }
  },
  {
    path: "/working-management",
    element: <WorkingManagement />,
    meta: {
      action: "read",
      resource: "WORKING MANAGEMENT"
    }
  },
  {
    path: "/form-builder",
    element: <FormBuilder />,
    meta: {
      action: "read",
      resource: "FORM BUILDER"
    }
  },
  {
    path: "/form-builder/create",
    element: <FormBuilderCreate />,
    meta: {
      action: "read",
      resource: "FORM BUILDER"
    }
  },
  {
    path: "/form-builder/:id",
    element: <FormBuilderCreate />,
    meta: {
      action: "read",
      resource: "FORM BUILDER"
    }
  },
  {
    path: "/digitalization",
    element: <DigitalizationIndex />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/digitalization/:id",
    element: <DigitalizationForm />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/sppd",
    element: <SppdIndex />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/sppd/:type",
    element: <SppdForm />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/sppd/:type/:id",
    element: <SppdForm />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/sppd/draft/:id",
    element: <InvoicePreviewSPPD />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: "/sppd/invoice/:id",
    element: <InvoicePreviewSPPD />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION"
    }
  },
  {
    path: '/apps/invoice/print',
    element: <Print />,
    meta: {
      action: "read",
      resource: "DIGITALIZATION",
      layout: "blank",
    }
  },
  {
    path: "/table-builder",
    element: <TableBuilderIndex />,
    meta: {
      action: "read",
      resource: "TABLE BUILDER"
    }
  },
  {
    path: "/table-builder/create",
    element: <TableBuilderCreate />,
    meta: {
      action: "read",
      resource: "TABLE BUILDER"
    }
  },
  {
    path: "/table-builder/:id",
    element: <TableBuilderCreate />,
    meta: {
      action: "read",
      resource: "TABLE BUILDER"
    }
  },
  {
    path: "/migration-payroll",
    element: <MigrationPayroll />,
    meta: {
      action: "read",
      resource: "TABLE BUILDER"
    }
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  //   meta: {
  //     action: "read",
  //     resource: "MENU HOME",
  //   },
  // },
  {
    path: "/register",
    element: <Register />,
    meta: {
      action: "read",
      resource: "MENU HOME"
    }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      action: "read",
      resource: "MENU HOME"
    }
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      action: "read",
      resource: "MENU HOME"
    }
  },
  {
    path: '/misc/not-authorized',
    element: <NotAuthorized />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },

  ...LmsRoutes

  // {
  //   path: "/company",
  //   element: <Company/>,
  //   meta: {
  //     layout: "blank",
  //   },
  // },
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}


// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []
  // console.log(Routes, "MergeLayoutRoutes");


  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute

        // ** Check for public or private route
        if (route.meta) {
          // console.log(route, "private route meta");

          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)

          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          // console.log(getRouteMeta(route), "route.elements");
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
