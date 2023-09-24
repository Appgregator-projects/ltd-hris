// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	FormFeedback,
	Input,
	InputGroup,
	InputGroupText,
	Label,
	ListGroupItem,
	Row,
} from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";

import { Plus, Save, X } from "react-feather";
import { useLocation, useParams } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";
import { MdDeleteOutline } from "react-icons/md";
import UploadMultipleFile from "../../../Components/UploadMultipleFile";
import QuizAccordion from "../view/quizAccordion";
import { useSelector } from "react-redux";
import {
	addDocumentFirebase,
	arrayUnionFirebase,
	setDocumentFirebase,
	uploadFile,
} from "../../../../../sevices/FirebaseApi";
import { toast } from "react-hot-toast";

const QuestionAnswerTabs = ({ quizList, setQuizList, fetchDataQuestion }) => {
	console.log(quizList, "quizlist");
	const location = useLocation();
	const param = useParams();

	const store = useSelector((state) => state.coursesSlice);

	const [isAddQuiz, setIsAddQuiz] = useState(false);
	const [isError, setIsError] = useState({
		question_title: "",
		answer: [],
	});
	const [newQuiz, setNewQuiz] = useState({
		question_title: "",
		question_description: "",
		answer: [],
		id: null,
	});

	const [answerCount, setAnswerCount] = useState([1, 2]);
	const [isHovered, setIsHovered] = useState(
		Array(answerCount.length).fill(false)
	); // Buat array state untuk menyimpan status hover

	const iconHoverStyle = {
		// Set the desired background color on hover
		cursor: "pointer", // Optional: Change the cursor to a pointer on hover
		color: "red",
	};

	const setHoveredState = (index, hovered) => {
		const newHoveredState = [...isHovered];
		newHoveredState[index] = hovered;
		setIsHovered(newHoveredState);
	};

	// ** handle
	const handleCount = () => {
		let answerLength = answerCount.length;
		setAnswerCount([...answerCount, answerLength + 1]);
	};

	const handleAddQuiz = async (type) => {
		if (type === "add") {
			setIsAddQuiz(true);
		} else if (type === "cancel") {
			setIsAddQuiz(false);
			setNewQuiz({
				question_title: "",
				question_description: "",
				answer: [],
			});
			setAnswerCount([1, 2]);
			setIsError({
				question_title: "",
				question_description: "",
				answer: [],
			});
		} else if (type === "submit") {
			try {
				// Validasi sebelum menambahkan quiz
				const errors = {};
				console.log(newQuiz.question_title.trim() === "");

				if (newQuiz.question_title.trim() === "") {
					errors.question_title =
						"Judul pertanyaan tidak boleh kosong";
				}

				const answerErrors = [];
				newQuiz.answer.forEach((answer, index) => {
					if (answer.answerTitle.trim() === "") {
						answerErrors[index] =
							"Jawaban tidak boleh kosong";
					}
				});

				if (answerErrors.length > 0) {
					errors.answer = answerErrors;
				}

				if (Object.keys(errors).length > 0) {
					setIsError(errors);
					return;
				}
				let newData = {
					question_title: newQuiz.question_title,
					question_description: newQuiz.question_description,
					answer: newQuiz.answer,
					quiz_id: param.id,
					isCorrectAnswer: newQuiz.isCorrectAnswer,
				};
				if (quizList) {
					newData.question_index = quizList.length;
				} else {
					newData.question_index = 1;
				}

				if (store.image[0]) {
					uploadFile(
						newQuiz.question_title,
						"questions",
						store.image[0]
					).then((res) => {
						newData.question_img = res;
					});
				} else {
					addDocumentFirebase(
						`quizzes/${param.id}/questions`,
						newData
					).then((res) => {
						arrayUnionFirebase(
							"quizzes",
							param.id,
							"questions",
							res
						).then((response) => {
							if (response) {
								toast.success(`Quiz has created`, {
									position: "top-center",
								});
								setQuizList([...quizList, newQuiz]);

								setIsAddQuiz(false);
								setNewQuiz({
									question_title: "",
									question_description: "",
									answer: [],
								});
								setAnswerCount([1, 2]);
								setIsError({
									question_title: "",
									question_description: "",
									answer: [],
								});
								fetchDataQuestion()
							} else {
								return toast.error(`Error : ${res}`, {
									position: "top-center",
								});
							}
						});
					});
				}
			} catch (error) {
				throw error;
			}
		}
	};

	const handleQuizIndex = (data) => {
		setQuizList([...data]);
	};

	const handleInputChange = (e, index) => {
		const { value, checked } = e.target;

		const findIndex = newQuiz.answer.findIndex((x) => x.id === index);
		const findIndexCorrect = newQuiz.answer.findIndex(
			(x) => x.isCorrectAnswer === true
		);

		switch (true) {
			case findIndex === -1 && !checked:
				newQuiz.answer.push({
					isCorrectAnswer: checked,
					id: index,
					answerTitle: value,
				});
				newQuiz.id = quizList.length + 1;
				break;

			case findIndexCorrect === -1 && checked:
				newQuiz.answer[findIndex].isCorrectAnswer = checked;
				break;

			case findIndexCorrect !== -1 && checked:
				newQuiz.answer[findIndexCorrect].isCorrectAnswer = false;
				newQuiz.answer[findIndex].isCorrectAnswer = checked;
				break;

			default:
				newQuiz.answer[findIndex].answerTitle = value;
		}
	};

	const handleDelete = (index) => {
		const newCount = answerCount.filter((id) => id !== index);
		setAnswerCount(newCount);
	};

	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Question and Answer</h3>
				</Col>

				{/* <Col className="d-flex justify-content-end">
                <Button.Ripple className="btn-icon" color={"primary"} outline>
                  <Settings size={14} />
                </Button.Ripple>
              </Col> */}
			</Row>

			<Row id="dd-with-handle" className="pl-1">
				{quizList?.length > 0 && (
					<Col>
						<ReactSortable
							tag="ul"
							className="list-group"
							handle=".handle"
							list={quizList}
							setList={(e) => handleQuizIndex(e)}
						>
							{quizList?.map((item) => {
								return (
									<ListGroupItem
										key={item.id}
										className="ml-1 p-0 border-0 mb-1"
									>
										<Card
											className="mb-0 w-full"
											key={item.id}
										>
											<QuizAccordion
												id={item.id}
												data={item}
												quizList={quizList}
												setQuizList={
													setQuizList
												}
												fetchDataQuestion={
													fetchDataQuestion
												}
											/>
										</Card>
									</ListGroupItem>
								);
							})}
						</ReactSortable>
					</Col>
				)}
			</Row>

			{isAddQuiz && (
				<Row>
					<Card className="mb-1">
						<CardHeader>
							<h4 className="mb-0">Add New Question</h4>

							<Button.Ripple
								color={"danger"}
								className="btn-icon"
								onClick={() => handleAddQuiz("cancel")}
							>
								<X size={14} />
							</Button.Ripple>
						</CardHeader>

						<CardBody>
							<Row>
								<UploadMultipleFile />
							</Row>

							<Row className="mt-1">
								<Form>
									<Label>Question</Label>
									<Input
										type={"text"}
										onChange={(e) =>
											setNewQuiz({
												...newQuiz,
												question_title:
													e.target.value,
											})
										}
										isInvalid={
											isError.question_title !==
											""
										}
									/>
									<FormFeedback>
										{isError.question_title}
									</FormFeedback>
								</Form>
							</Row>

							<Row className="mt-1">
								<Form>
									<Label>Question Description</Label>
									<Input
										type={"textarea"}
										onChange={(e) =>
											setNewQuiz({
												...newQuiz,
												question_description:
													e.target.value,
											})
										}
									/>
								</Form>
							</Row>
							<Row className="mt-1">
								<Form>
									<Label>Answer</Label>

									{answerCount.map((index) => {
										return (
											<Row key={index}>
												<Col
													key={index}
													className={
														index > 2
															? "mt-1 col-11"
															: "mt-1"
													}
												>
													<InputGroup
														onChange={(
															e
														) =>
															handleInputChange(
																e,
																index
															)
														}
													>
														<InputGroupText>
															<div className="form-check">
																<Input
																	type="radio"
																	name={`inputGroupExampleRadio${index}`}
																	id={`exampleCustomRadio${index}`}
																	checked={
																		newQuiz.isCorrectAnswer ===
																		index
																	}
																	// isInvalid={
																	// 	isError
																	// 		.answer[
																	// 		index
																	// 	] !==
																	// 	[]
																	// }
																	onChange={() =>
																		setNewQuiz(
																			{
																				...newQuiz,
																				isCorrectAnswer:
																					index,
																			}
																		)
																	}
																/>
															</div>
														</InputGroupText>
														<Input type="text" />
														{/* <FormFeedback>
																			{
																				isError
																					.answer[
																					index
																				]
																			}
																		</FormFeedback> */}
													</InputGroup>
												</Col>
												{index > 2 && (
													<Col className="d-flex justify-content-end">
														<div className="py-2 pe-1">
															<MdDeleteOutline
																size={
																	18
																}
																style={
																	isHovered[
																		index
																	]
																		? iconHoverStyle
																		: {
																				color: "initial",
																		  }
																}
																onMouseEnter={() =>
																	setHoveredState(
																		index,
																		true
																	)
																}
																onMouseLeave={() =>
																	setHoveredState(
																		index,
																		false
																	)
																}
																onClick={() =>
																	handleDelete(
																		index
																	)
																}
															/>
														</div>
													</Col>
												)}
											</Row>
										);
									})}
								</Form>
							</Row>

							<Button.Ripple
								color={"primary"}
								className={"mt-2"}
								onClick={() => handleCount()}
								block
							>
								<Plus size={14} />
								<span className="align-middle ms-25">
									Answer
								</span>
							</Button.Ripple>
						</CardBody>
					</Card>
					<Button.Ripple
						color={"success"}
						className={"mt-2"}
						onClick={() => handleAddQuiz("submit")}
						block
					>
						<Save size={14} />
						<span className="align-middle ms-25">Submit</span>
					</Button.Ripple>
				</Row>
			)}

			{!isAddQuiz && (
				<Button.Ripple
					color={"primary"}
					className="me-1 mt-2"
					block
					onClick={() => handleAddQuiz("add")}
				>
					<Plus size={14} />
					<span className="align-middle ms-25">Quiz</span>
				</Button.Ripple>
			)}
		</Fragment>
	);
};

export default QuestionAnswerTabs;
