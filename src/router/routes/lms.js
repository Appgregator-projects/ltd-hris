import { lazy } from "react";

const DetailQuiz = lazy(() => import( "../../views/pages/LMS/quiz/DetailQuiz"));
const QuizPage = lazy(() => import("../../views/pages/LMS/quiz"));
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
	{
		path: "/quiz",
		element: <QuizPage />,
		meta: {
			action: "read",
			resource: "COURSE GROUP",
		},
	},
	{
		path: "/courses/:id/quiz/:id",
		element: <DetailQuiz />,
		meta: {
			action: "read",
			resource: "COURSE GROUP",
		},
	},
];

export default LmsRoutes;
