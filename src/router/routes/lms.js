import { lazy } from "react";

// HR
const DetailQuiz = lazy(() => import( "../../views/pages/LMS/quiz/DetailQuiz"));
const QuizPage = lazy(() => import("../../views/pages/LMS/quiz"));
const CoursesPage = lazy(() => import("../../views/pages/LMS/courses"));
const CourseDetailPage = lazy(() =>
  import("../../views/pages/LMS/courses/view")
);
const GroupsPage = lazy(() => import("../../views/pages/LMS/groups"));

// Employee
const DetailQuizEmployee = lazy(() => import("../../views/pages/LMSEmployee/quiz/DetailQuiz"));
const QuizPageEmployee = lazy(() => import("../../views/pages/LMSEmployee/quiz"));
const CoursesPageEmployee = lazy(() => import("../../views/pages/LMSEmployee/courses"));
const CourseDetailPageEmployee = lazy(() =>
	import("../../views/pages/LMSEmployee/courses/view")
);
const GroupsPageEmployee = lazy(() => import("../../views/pages/LMSEmployee/groups"));
const SingleLesson = lazy(() => import("../../views/pages/LMSEmployee/courses/view/SingleLesson"));

const LmsRoutes = [
	// LMS HR
	{
		path: "/courses",
		element: <CoursesPage />,
		meta: {
			action: "read",
			resource: "MENU COURSE HR",
		},
	},
	{
		path: "/courses/:id",
		element: <CourseDetailPage />,
		meta: {
			action: "read",
			resource: "MENU COURSE HR",
		},
	},
	{
		path: "/groups",
		element: <GroupsPage />,
		meta: {
			action: "read",
			resource: "MENU GROUP HR",
		},
	},
	{
		path: "/quiz",
		element: <QuizPage />,
		meta: {
			action: "read",
			resource: "MENU QUIZ HR",
		},
	},
	{
		path: "/quiz/:id",
		element: <DetailQuiz />,
		meta: {
			action: "read",
			resource: "MENU QUIZ HR",
		},
	},

	//LMS EMPLOYEE
	{
		path: "/courses-employee",
		element: <CoursesPageEmployee />,
		meta: {
			action: "read",
			resource: "MENU COURSE EMPLOYEE",
		},
	},
	{
		path: "/courses-employee/:id",
		element: <CourseDetailPageEmployee />,
		meta: {
			action: "read",
			resource: "MENU COURSE EMPLOYEE",
		},
	},
	{
		path: "/course/:course_id/section/:section_id/lesson/:lesson_title",
		element: <SingleLesson />,
		meta: {
			action: "read",
			resource: "MENU COURSE EMPLOYEE",
		},
	},
	{
		path: "/groups-employee",
		element: <GroupsPageEmployee />,
		meta: {
			action: "read",
			resource: "MENU GROUP EMPLOYEE",
		},
	},
	{
		path: "/quiz-employee",
		element: <QuizPageEmployee />,
		meta: {
			action: "read",
			resource: "MENU QUIZ EMPLOYEE",
		},
	},
	{
		path: "/quiz-employee/:id",
		element: <DetailQuizEmployee />,
		meta: {
			action: "read",
			resource: "MENU QUIZ EMPLOYEE",
		},
	},
];

export default LmsRoutes;
