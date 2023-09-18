// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

// ** Icons Imports
import {
	User,
	Lock,
	Bookmark,
	Bell,
	Link,
	BookOpen,
	BarChart2,
} from "react-feather";

// // ** User Components
import { useLocation } from "react-router-dom";
import CourseSyllabusTab from "./view/tabs/CourseSyllabusTab";
import LogActivityTab from "./view/tabs/LogActivityTab";

const CourseTabs = ({ active, toggleTab, setCourseData, courseData }) => {
	return (
		<Fragment>
			<Nav pills className="mb-2">
				<NavItem>
					<NavLink
						active={active === "1"}
						onClick={() => toggleTab("1")}
					>
						<BookOpen className="font-medium-3 me-50" />
						<span className="fw-bold">
							Course Syllabus
						</span>
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						active={active === "2"}
						onClick={() => toggleTab("2")}
					>
						<BarChart2 className="font-medium-3 me-50" />
						<span className="fw-bold">Log Activity</span>
					</NavLink>
				</NavItem>
				{/* <NavItem>
					<NavLink
						active={active === "3"}
						onClick={() => toggleTab("3")}
					>
						<Bookmark className="font-medium-3 me-50" />
						<span className="fw-bold">Billing & Plans</span>
					</NavLink>
				</NavItem> */}
				{/* <NavItem>
					<NavLink
						active={active === "4"}
						onClick={() => toggleTab("4")}
					>
						<Bell className="font-medium-3 me-50" />
						<span className="fw-bold">Notifications</span>
					</NavLink>
				</NavItem> */}
				{/* <NavItem>
					<NavLink
						active={active === "5"}
						onClick={() => toggleTab("5")}
					>
						<Link className="font-medium-3 me-50" />
						<span className="fw-bold">Connections</span>
					</NavLink>
				</NavItem> */}
			</Nav>
			<TabContent activeTab={active}>
				<TabPane tabId="1">
					<CourseSyllabusTab
						courseData={courseData}
						setCourseData={setCourseData}
					/>
					{/* <UserProjectsList />
					<UserTimeline />
					<InvoiceList /> */}
				</TabPane>
				<TabPane tabId="2">
					<LogActivityTab
						courseData={courseData}
						setCourseData={setCourseData}
					/>
				</TabPane>
				{/* <TabPane tabId="3"><BillingPlanTab /></TabPane> */}
				{/* <TabPane tabId="4"><Notifications /></TabPane> */}
				{/* <TabPane tabId="5"><Connections /></TabPane> */}
			</TabContent>
		</Fragment>
	);
};
export default CourseTabs;
