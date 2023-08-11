import { lazy } from "react";

const CoursesPage = lazy(() => import("../../views/pages/LMS/courses"));
const CourseDetailPage = lazy(() =>
  import("../../views/pages/LMS/courses/view")
);
const GroupsPage = lazy(() => import("../../views/pages/LMS/groups"));

const LmsRoutes = [
  {
    path: "/courses",
    element: <CoursesPage />,
    meta: {
      action: "read",
      resource: "COURSE",
    },
  },
  {
    path: "/courses/:id",
    element: <CourseDetailPage />,
    meta: {
      action: "read",
      resource: "COURSE",
    },
  },
  {
    path: "/groups",
    element: <GroupsPage />,
    meta: {
      action: "read",
      resource: "COURSE GROUP",
    },
  },
];

export default LmsRoutes;
