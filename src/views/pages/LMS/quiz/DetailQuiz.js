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
import { useLocation, useParams } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";

import QuizTabs from "./QuizTabs";
import { useEffect } from "react";
import { getSingleDocumentFirebase } from "../../../../sevices/FirebaseApi";

// const defaultValues = {
// 	lesson_title: lesson.lesson_title,
// 	lesson_description: lesson.lesson_description,
// 	lesson_video: `https://www.youtube.com/watch?v=${lesson.lesson_video}`,
// };

const DetailQuiz = () => {
	const location = useLocation();
	const param = useParams();

	const [active, setActive] = useState("1");
	const [dataQuiz, setDataQuiz] = useState([]);

	const fetchDataQuiz = async () => {
		const res = await getSingleDocumentFirebase(`quizzes`, param.id);
		setDataQuiz(res);
	};

	const toggleTab = (tab) => {
		if (active !== tab) {
			setActive(tab);
		}
	};

	useEffect(() => {
		fetchDataQuiz();
		return () => {
			setDataQuiz([]);
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Course"
				data={[
					{ title: "Course", link: "/courses" },
					{
						title: dataQuiz?.course?.course_title,
						link: `/courses/${dataQuiz?.course?.course_id}`,
					},
					{
						title: dataQuiz?.quiz_title,
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
										{dataQuiz?.quiz_thumbnail && (
											<img
												// height="110"
												// width="110"
												alt="user-avatar"
												src={
													dataQuiz?.quiz_thumbnail
												}
												className="img-fluid rounded mt-0 mb-2"
											/>
										)}

										<div className="d-flex flex-column align-items-center text-center">
											<div className="user-info mt-1">
												<h4>
													{
														dataQuiz?.quiz_title
													}
												</h4>
											</div>

											<div className="user-info mt-2">
												<p>
													{
														dataQuiz?.quiz_description
													}
												</p>
											</div>
											<div className="user-info mt-2">
												<p>
													{
														dataQuiz?.quiz_minGrade
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
						<QuizTabs
							active={active}
							toggleTab={toggleTab}
							fetchDataQuiz={fetchDataQuiz}
							dataQuiz={dataQuiz}
						/>
					</Col>
				</Row>
			</div>
		</Fragment>
	);
};

export default DetailQuiz;
