// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Button,
	Card,
	UncontrolledTooltip,
} from "reactstrap";
// ** Images
import react from "@src/assets/images/icons/react.svg";

import { Edit } from "react-feather";
import { Table } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { getCollectionFirebase } from "../../../../sevices/FirebaseApi";

const QuizPage = () => {
	const [quizData, setQuizData] = useState([]);
	const navigate = useNavigate();

	const fetchDataQuiz = async () => {
		try {
			const res = await getCollectionFirebase("quizzes");
			setQuizData(res);
		} catch (error) {
			throw error;
		}
	};

	useEffect(() => {
		fetchDataQuiz();
		return () => {
			setQuizData([]);
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Quiz"
				data={[{ title: "Quiz" }]}
			/>

			<Card>
				<Table responsive>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Course</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{quizData.map((item, index) => (
							<tr key={index}>
								<td>
									<img
										className="me-75"
										src={react}
										alt="react"
										height="20"
										width="20"
									/>
									<span className="align-middle fw-bold">
										{item.quiz_title}
									</span>
								</td>

								<td>{item.quiz_description}</td>
								<td>
									<a onClick={()=>navigate(`/courses-employee/${item.course.course_id}`)}>{item.course.course_title}</a>
								</td>
								<td width={250}>
									<Button.Ripple
										className={"btn-icon me-1"}
										color={"primary"}
										onClick={() =>
											navigate(
												`/quiz-employee/${item.id}`,
												{
													state: {
														question:
															{
																id: 1,
																question_title:
																	"How far it could be?",
																question_description:
																	"Use 3rd Law of Newton",
																isCorrectAnswer: 3,
																answer: [
																	{
																		answerTitle:
																			"1600N",
																		isCorrectAnswer: false,
																		id: 1,
																	},
																	{
																		answerTitle:
																			"1000N",
																		isCorrectAnswer: false,
																		id: 2,
																	},
																	{
																		answerTitle:
																			"2000N",
																		isCorrectAnswer: true,
																		id: 3,
																	},
																],
															},
													},
												}
											)
										}
										id="edit-quiz"
									>
										<Edit size={14} />
									</Button.Ripple>
									<UncontrolledTooltip
										placement="top"
										target="edit-quiz"
									>
										Assign Quiz
									</UncontrolledTooltip>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Card>
		</Fragment>
	);
};

export default QuizPage;
