// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "../../@core/components/routes/PublicRoute";
import PrivateRoute from "../../@core/components/routes/PrivateRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import { menuAbility } from "../../utility/Utils";

import AuthRoutes from "./auth";
import LmsRoutes from "./lms";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - HRIS portal";

// ** Default Route
const DefaultRoute = "/home";

const Home = lazy(() => import("../../views/Home"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Error = lazy(() => import("../../views/Error"));
const Employee = lazy(() => import("../../views/pages/employee/EmployeeIndex"));
const EmployeeDetail = lazy(() =>
  import("../../views/pages/employee/EmployeeDetail")
);
const Office = lazy(() => import("../../views/pages/Office/OfficeIndex"));
const OfficeDetail = lazy(() =>
  import("../../views/pages/Office/OfficeDetail")
);
// const Shift = lazy(() => import("../../views/pages/Shift/ShiftIndex"));
const Division = lazy(() => import("../../views/pages/Division/DivisionIndex"));
const LeaveCategory = lazy(() =>
  import("../../views/pages/LeaveCategory/LeaveCategoryIndex")
);
const Attendance = lazy(() => import("../../views/pages/Attendance/AttendanceIndex"));
const CorrectionRequest = lazy(() =>
  import("../../views/pages/CorrectionRequest")
);
const LeaveRequest = lazy(() =>
  import("../../views/pages/LeaveRequest/LeaveRequest")
);

// ** Merge Routes
const Routes = [
  ...AuthRoutes,
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      name: "home",
    },
  },
  {
    path: "/attendance",
    element: <Attendance />,
    meta: {
      name: "attendance",
    },
  },
  {
    path: "/correction-request",
    element: <CorrectionRequest />,
    meta: {
      name: "correction-request",
    },
  },
  {
    path: "/leave-request",
    element: <LeaveRequest />,
    meta: {
      name: "leave-request",
    },
  },
  {
    path: "/employee",
    element: <Employee />,
    meta: {
      name: "employee",
    },
  },
  {
    path: "/employee/:uid",
    element: <EmployeeDetail />,
    meta: {
      name: "employee-detail",
    },
  },
  {
    path: "/office",
    element: <Office />,
    meta: {
      name: "office",
    },
  },
  {
    path: "/office/:office_id",
    element: <OfficeDetail />,
    meta: {
      name: "office-detail",
    },
  },
  {
    path: "/division",
    element: <Division />,
    meta: {
      name: "division",
    },
  },
  {
    path: "/leave-category",
    element: <LeaveCategory />,
    meta: {
      name: "leave-category",
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  ...LmsRoutes,

  // {
  //   path: "/company",
  //   element: <Company/>,
  //   meta: {
  //     layout: "blank",
  //   },
  // },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute;
        }

        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  // return LayoutRoutes;
  return LayoutRoutes.filter((x) => {
    return menuAbility().includes(x.meta ? x.meta.name : "default");
  });
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
