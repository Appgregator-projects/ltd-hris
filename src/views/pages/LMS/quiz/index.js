// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Button,
	Card,
	CardBody,
	Col,
	Input,
	InputGroup,
	InputGroupText,
	Row,
	UncontrolledTooltip,
} from "reactstrap";
// ** Images
import { Search } from "react-feather";

import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import { Edit, Trash } from "react-feather";
import { Badge, Table } from "reactstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DetailQuiz from "./DetailQuiz";
import { useNavigate } from "react-router-dom";
import { getCollectionFirebase } from "../../../../sevices/FirebaseApi";
// import AddGroup from "./AddGroup";

const MySwal = withReactContent(Swal);
const data = [{}, {}, {}, {}, {}, {}, {}, {}];

const avatarGroupData2 = [
	{
		title: "Diana",
		img: avatar1,
		imgHeight: 26,
		imgWidth: 26,
	},
	{
		title: "Rey",
		img: avatar2,
		imgHeight: 26,
		imgWidth: 26,
	},
	{
		title: "James",
		img: avatar3,
		imgHeight: 26,
		imgWidth: 26,
	},
];

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

	const thumbnailCourses = [
		{
			title: "Introduction to Web Development",
			img: "https://i.ytimg.com/vi/w__n0BvkqB4/maxresdefault.jpg",
			imgHeight: 26,
			imgWidth: 26,
		},
		{
			title: "Python for Beginners",
			img: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F549550559%2F1234433154323%2F1%2Foriginal.20230706-115709?w=1000&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=84e3c74c34b060e7d28ccef3f6a5a6ec",
			imgHeight: 26,
			imgWidth: 26,
		},
	];

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
	console.log({ quizData });
	return (
		<Fragment>
			<Breadcrumbs
				title="Quiz"
				data={[{ title: "Quiz" }]}
				// rightMenu={<AddGroup type={"Create"} />}
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
									<a onClick={()=>navigate(`/courses/${item.course.course_id}`)}>{item.course.course_title}</a>
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
