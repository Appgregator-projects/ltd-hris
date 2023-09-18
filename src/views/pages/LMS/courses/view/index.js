// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Input,
	Label,
	ListGroupItem,
	Row,
} from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";

import { Edit, List, Plus, Save, X } from "react-feather";
import SectionAccordion from "./sectionAccordion";
import { useParams } from "react-router-dom";

import data from "../course.json";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";
import { FaSort } from "react-icons/fa";
import CourseTabs from "../CourseTabs";

const CourseDetailPage = () => {
	const param = useParams();

	const getCourseDetail = (type) => {
		const courseDetail = data.find(
			(item) => item.id === parseInt(param.id)
		);

		if (type === "course") {
			return courseDetail;
		} else if (type === "section") {
			return courseDetail.course_section;
		}
	};
	const [courseData, setCourseData] = useState(getCourseDetail("course"));
const [active, setActive] = useState("1");

const toggleTab = (tab) => {
	if (active !== tab) {
		setActive(tab);
	}
};
	return (
		<Fragment>
			<Breadcrumbs
				title="Course"
				data={[
					{ title: "Course", link: "/courses" },
					{ title: courseData.course_title },
				]}
				rightMenu={
					<Button.Ripple className="btn-icon" color={"warning"}>
						<Edit size={14} />
					</Button.Ripple>
				}
			/>

			<div className="app-user-view">
				<Row>
					<Col
						xl="4"
						lg="5"
						xs={{ order: 1 }}
						md={{ order: 0, size: 5 }}
					>
						<Card
							style={{
								backgroundColor: "#FFFFFF", // Set the desired background color on hover
							}}
						>
							<CardBody>
								<div className="user-avatar-section">
									<div className="d-flex align-items-center flex-column">
										<img
											// height="110"
											// width="110"
											alt="user-avatar"
											src={
												courseData.course_thumbnail
											}
											className="img-fluid rounded mt-0 mb-2"
										/>
										<div className="d-flex flex-column align-items-center text-center">
											<div className="user-info mt-1">
												<h4>
													{
														courseData.course_title
													}
												</h4>
											</div>

											<div className="user-info mt-2">
												<p>
													{
														courseData.course_description
													}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* <h4 className="fw-bolder border-bottom pb-50 mb-1">Details</h4>
                <div className="info-container">
                  <ul className="list-unstyled">
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Username:</span>
                      <span>username</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Billing Email:</span>
                      <span>@email.com</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Status:</span>
                      <Badge className="text-capitalize" color={"primary"}>
                        status
                      </Badge>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Role:</span>
                      <span className="text-capitalize">Admin</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Tax ID:</span>
                      <span>Tax-</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Contact:</span>
                      <span>contact</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Language:</span>
                      <span>English</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Country:</span>
                      <span>England</span>
                    </li>
                  </ul>
                </div> */}
							</CardBody>
						</Card>
					</Col>
					<Col
						xl="8"
						lg="7"
						xs={{ order: 0 }}
						md={{ order: 1, size: 7 }}
					>
						<CourseTabs
							setCourseData={setCourseData}
							courseData={courseData}
							active={active}
							toggleTab={toggleTab}
						/>
					</Col>
				</Row>
			</div>
		</Fragment>
	);
};

export default CourseDetailPage;
