// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Button, Card, UncontrolledTooltip } from "reactstrap";

import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import { Edit, Rss, Trash } from "react-feather";
import { Table } from "reactstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { getCollectionFirebase } from "../../../../sevices/FirebaseApi";
import SingleAvatarGroup from "../../../../@core/components/single-avatar-group";

const MySwal = withReactContent(Swal);

const QuizPage = () => {
	const [quizData, setQuizData] = useState([]);
	const [groupList, setGroupList] = useState([]);

	const navigate = useNavigate();

	const fetchDataQuiz = async () => {
		try {
			const res = await getCollectionFirebase("quizzes");
			if (res) {
				setQuizData(res);

				const resGroup = await getCollectionFirebase("groups");
				setGroupList(resGroup);
			}
		} catch (error) {
			throw error;
		}
	};

	console.log({ groupList });

	const handleConfirmText = () => {
		return MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			customClass: {
				confirmButton: "btn btn-primary",
				cancelButton: "btn btn-outline-danger ms-1",
			},
			buttonsStyling: false,
		}).then(function (result) {
			if (result.value) {
				MySwal.fire({
					icon: "success",
					title: "Deleted!",
					text: "Your file has been deleted.",
					customClass: {
						confirmButton: "btn btn-success",
					},
				});
			}
		});
	};

	useEffect(() => {
		fetchDataQuiz();
		return () => {
			setQuizData([]);
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs title="Quiz" data={[{ title: "Quiz" }]} />

			<Card>
				<Table responsive>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Course</th>
							<th>Groups</th>
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
									<a
										onClick={() =>
											navigate(
												`/courses/${item.course.course_id}`
											)
										}
									>
										{item.course.course_title}
									</a>
								</td>

								<td>
									<div className="avatar-group">
										{groupList.map((x, id) => {
											let data = {
												avatar: x.group_thumbnail,
												label: x.group_name,
											};

											if (
												x.group_courses.includes(
													item.course_id
												)
											) {
												return (
													<div key={id} onClick={()=>navigate('/groups')}>
														<SingleAvatarGroup
															id={
																id
															}
															data={
																data
															}
														/>
													</div>
												);
											}
										})}
									</div>
								</td>
								<td width={250}>
									{/* <GroupMembers />
									<GroupCourses />
									<AddGroup type={"Edit"} /> */}
									{/* <DetailQuiz/> */}
									<Button.Ripple
										className={"btn-icon me-1"}
										color={"warning"}
										onClick={() =>
											navigate(
												`/quiz/${item.id}`,
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
										Edit Quiz
									</UncontrolledTooltip>
									<Button.Ripple
										className={"btn-icon"}
										color={"danger"}
										onClick={() =>
											handleConfirmText()
										}
										id="delete-quiz"
									>
										<Trash size={14} />
									</Button.Ripple>
									<UncontrolledTooltip
										placement="top"
										target="delete-quiz"
									>
										Delete Quiz
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
