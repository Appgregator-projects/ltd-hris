// ** React Imports
import { Fragment, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Button, Card, CardBody, Col, Row } from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import { Edit } from "react-feather";
import { useLocation } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";

import QuizTabs from "./QuizTabs";

// const defaultValues = {
// 	lesson_title: lesson.lesson_title,
// 	lesson_description: lesson.lesson_description,
// 	lesson_video: `https://www.youtube.com/watch?v=${lesson.lesson_video}`,
// };

const DetailQuiz = () => {
	const location = useLocation();

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
					{
						title: location?.state?.course
							? location.state.course.course_title
							: "Introduction to Web Development",
						link: location?.state?.course
							? `/courses/${location.state.course.id}`
							: "/courses/1",
					},
					{
						title: location?.state?.quiz_title
							? location.state.quiz_title
							: "	Quiz Project",
					},
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
												"https://i.ytimg.com/vi/w__n0BvkqB4/maxresdefault.jpg"
											}
											className="img-fluid rounded mt-0 mb-2"
										/>

										<div className="d-flex flex-column align-items-center text-center">
											<div className="user-info mt-1">
												<h4>
													{location
														?.state
														?.quiz_title
														? location
																.state
																.quiz_title
														: "	Quiz Project"}
												</h4>
											</div>

											<div className="user-info mt-2">
												<p>
													{location
														?.state
														?.quiz_description
														? location
																.state
																.quiz_description
														: "Quiz Description"}
												</p>
											</div>
											<div className="user-info mt-2">
												<p>
													{location
														?.state
														?.quiz_minGrade
														? location
																.state
																.quiz_minGrade
														: ""}
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
						<QuizTabs active={active} toggleTab={toggleTab} />
					</Col>
				</Row>
			</div>
		</Fragment>
	);
};

export default DetailQuiz;
