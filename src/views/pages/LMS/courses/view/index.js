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
	let sectionListData = [...courseData.course_section];
	const [sectionList, setSectionList] = useState([...sectionListData]);
	const [isAddSection, setIsAddSection] = useState(false);
	const [newSection, setNewSection] = useState({
		section_title: "",
		section_description: "",
	});

	// ** handle
	const handleAddSection = (type) => {
		if (type === "add") {
			setIsAddSection(true);
		} else if (type === "cancel") {
			setIsAddSection(false);
			setNewSection({
				section_title: "",
				section_description: "",
			});
		} else if (type === "submit") {
			setIsAddSection(false);
			setNewSection({
				section_title: "",
				section_description: "",
			});
		}
	};

	const handleSectionIndex = (data) => {
		setSectionList([...data]);
	};

	useEffect(() => {
		return () => {};
	}, [sectionList]);

	console.log(
		"🚀 ~ file: index.js:54 ~ CourseDetailPage ~ sectionList:",
		sectionList
	);

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
						<Row className="mb-1">
							<Col>
								<h3>Course Syllabus</h3>
							</Col>

							{/* <Col className="d-flex justify-content-end">
                <Button.Ripple className="btn-icon" color={"primary"} outline>
                  <Settings size={14} />
                </Button.Ripple>
              </Col> */}
						</Row>

						<Row id="dd-with-handle" className="pl-1">
							<Col>
								<ReactSortable
									tag="ul"
									className="list-group"
									handle=".handle"
									list={sectionList}
									setList={(e) =>
										handleSectionIndex(e)
									}
								>
									{sectionList?.map(
										(item, index) => {
											return (
												<ListGroupItem
													key={item.id}
													className="ml-1 p-0 border-0 mb-1"
												>
													<Card
														className="mb-0 w-full"
														key={
															item.id
														}
													>
														<SectionAccordion
															data={
																item
															}
															sectionList={
																sectionList
															}
															course={
																courseData
															}
															setSectionList={
																setSectionList
															}
														/>
													</Card>
												</ListGroupItem>
											);
										}
									)}
								</ReactSortable>
							</Col>
						</Row>

						{isAddSection && (
							<Card className="mb-1">
								<CardHeader>
									<h4 className="mb-0">
										Add New Section
									</h4>

									<Button.Ripple
										color={"danger"}
										className="btn-icon"
										onClick={() =>
											handleAddSection(
												"cancel"
											)
										}
									>
										<X size={14} />
									</Button.Ripple>
								</CardHeader>

								<CardBody>
									<Row>
										<Form>
											<Label>
												Section Title
											</Label>
											<Input type={"text"} />
										</Form>
									</Row>

									<Row className="mt-1">
										<Form>
											<Label>
												Section Description
											</Label>
											<Input
												type={"textarea"}
											/>
										</Form>
									</Row>

									<Button.Ripple
										color={"success"}
										className={"mt-2"}
										onClick={() =>
											handleAddSection(
												"submit"
											)
										}
										block
									>
										<Save size={14} />
										<span className="align-middle ms-25">
											Submit
										</span>
									</Button.Ripple>
								</CardBody>
							</Card>
						)}

						{!isAddSection && (
							<Button.Ripple
								color={"primary"}
								className="me-1 mt-2"
								block
								onClick={() => handleAddSection("add")}
							>
								<Plus size={14} />
								<span className="align-middle ms-25">
									Section
								</span>
							</Button.Ripple>
						)}
					</Col>
				</Row>
			</div>
		</Fragment>
	);
};

export default CourseDetailPage;
