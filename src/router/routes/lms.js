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
      name: "lms-courses",
    },
  },
  {
    path: "/courses/:id",
    element: <CourseDetailPage />,
    meta: {
      name: "lms-courses",
    },
  },
  {
    path: "/groups",
    element: <GroupsPage />,
    meta: {
      name: "lms-groups",
    },
  },
];

export default LmsRoutes;
