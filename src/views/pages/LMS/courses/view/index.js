// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Card, CardBody, Col, Row } from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import { useParams } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";

import CourseTabs from "../CourseTabs";
import { getSingleDocumentFirebase } from "../../../../../sevices/FirebaseApi";
import DeleteButton from "./DeleteButton";
import AddCourse from "../AddCourse";
import { useSelector } from "react-redux";

const CourseDetailPage = () => {
	const param = useParams();
	const store = useSelector((state) => state.coursesSlice);

	const [courseData, setCourseData] = useState([]);
	const [active, setActive] = useState("1");

	const toggleTab = (tab) => {
		if (active !== tab) {
			setActive(tab);
		}
	};

	const getCourseDetail = async () => {
		try {
			const getData = await getSingleDocumentFirebase(
				"courses",
				param.id
			);
			if (getData) {
				setCourseData(getData);
			}
		} catch (error) {
			throw error;
		}
	};

	useEffect(() => {
		getCourseDetail();
		return () => {
			setCourseData({});
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Course"
				data={[
					{ title: "Course", link: "/courses" },
					{ title: courseData.course_title },
				]}
				rightMenu={<DeleteButton type={"course"} />}
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
										<div
											style={{
												position:
													"relative",
											}}
										>
											<div
												className="d-flex justify-content-end"
												style={{
													position:
														"absolute",
													top: 0,
													right: -15,
												}}
											>
												<AddCourse
													type={"Update"}
													id={param.id}
													data={{
														...courseData,
														id: param.id,
													}}
													image={
														store.image
													}
													fetchDataCourse={
														getCourseDetail
													}
												/>
											</div>
											<img
												// height="110"
												// width="110"
												alt="user-avatar"
												src={
													courseData?.course_thumbnail
												}
												className="img-fluid rounded mt-0 mb-2"
											/>
										</div>
										<div className="d-flex flex-column align-items-center text-center">
											<div className="user-info mt-1">
												<h4>
													{
														courseData?.course_title
													}
												</h4>
											</div>

											<div className="user-info mt-2">
												<p>
													{
														courseData?.course_description
													}
												</p>
											</div>
										</div>
									</div>
								</div>
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
							getCourseDetail={getCourseDetail}
						/>
					</Col>
				</Row>
			</div>
		</Fragment>
	);
};

export default CourseDetailPage;
