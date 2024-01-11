import React from "react";
import { Fragment } from "react";
import { useEffect } from "react";
import {
	Accordion,
	AccordionBody,
	AccordionItem,
	Button,
	Card,
	Col,
	Form,
	Input,
	Label,
	ListGroupItem,
	Row,
} from "reactstrap";
import {
	arrayUnionFirebase,
	getCollectionFirebase,
	getSingleDocumentFirebase,
	setDocumentFirebase,
} from "../../../../../sevices/FirebaseApi";
import { useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Styles
import "@styles/react/apps/app-users.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Save, List, ChevronRight, ChevronLeft, Check } from "react-feather";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { auth } from "../../../../../configs/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
import UILoader from "../../../../../@core/components/ui-loader";
import YouTube from 'react-youtube';

const MySwal = withReactContent(Swal);

///ADAA TAMBAHAN DI SUBMIT USER

const SingleLesson = () => {
	const param = useParams();
	const navigate = useNavigate();

	// Store
	const store = useSelector((state) => state.authentication.userData);
	const storeCourses = useSelector((state) => state.coursesSlice);

	//Initial State
	const [section, setSection] = useState({});
	const [course, setCourse] = useState({});
	const [lesson, setLesson] = useState({});
	const [detailQuiz, setDetailQuiz] = useState({});
	const [question, setQuestion] = useState({});
	const [open, setOpen] = useState("1");
	const [answer, setAnswer] = useState([]);
	const [nextPage, setNextPage] = useState(null);
	const [prevPage, setPrevPage] = useState(null);
	const [currentLesson, setCurrentLesson] = useState({
		idSection: null,
		idLesson: null,
	});
	const [logActivity, setLogActivity] = useState(false);
	const [score, setScore] = useState(0)
	const [isLoading, setIsLoading] = useState(false);
	const [video, setVideo] = useState(false)

	//Fetch data
	const fetchDataLesson = async () => {
		setIsLoading(true);
		try {
			const res = await getSingleDocumentFirebase(
				`courses/${param.course_id}/course_section`,
				param.section_id
			);
			if (res) {
				setSection(res);

				const findLessons = await res?.lesson_list?.find(
					(x) =>
						x.lesson_title ===
						decodeURIComponent(param?.lesson_title)
				);

				if (findLessons) {
					setLesson(findLessons);

					const sections = storeCourses.sections;

					await sections.forEach(async (x) => {
						if (x.id === param?.section_id) {
							const findSection =
								await sections?.findIndex(
									(e) => e.id === param?.section_id
								);

							const findLesson = await sections[
								findSection
							]?.lesson_list.findIndex(
								(e) =>
									e.lesson_title ===
									param.lesson_title
							);

							const numberNext = parseInt(findLesson) + 1;

							const nextArray = await sections?.[
								findSection
							]?.lesson_list[numberNext];

							const numberBack = parseInt(findLesson) - 1;

							const backArray = await sections?.[
								findSection
							]?.lesson_list[numberBack];

							setPrevPage(backArray);
							setCurrentLesson({
								idSection: findSection,
								idLesson: findLesson + 1,
							});

							setNextPage(nextArray);
						}
						return null;
					});
				}

				const resCourse = await getSingleDocumentFirebase(
					`courses`,
					param.course_id
				);

				if (resCourse) {
					setCourse(resCourse);
				}

				const conditions = [
					{
						field: "course_id",
						operator: "==",
						value: param?.course_id,
					},
					{
						field: "section_id",
						operator: "==",
						value: param?.section_id,
					},
					{
						field: "lesson_title",
						operator: "==",
						value: decodeURIComponent(param?.lesson_title),
					},
				];

				const resQuiz = await getCollectionFirebase(
					"quizzes",
					conditions
				);

				if (resQuiz) {
					setDetailQuiz(resQuiz[0]);
					const resQuestion = await getCollectionFirebase(
						`quizzes/${resQuiz[0].id}/questions`
					);
					if (resQuestion) {
						setQuestion(resQuestion);
					}
				}

				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	};
	console.log(detailQuiz, 'detquiz')
	const fetchLogActivity = async () => {
		const activities = await getSingleDocumentFirebase(
			"user_course_progress",
			`${auth.currentUser.uid}-${param.course_id}`
		);

		if (activities) {
			const findActivity = await activities.history.findIndex(
				(x) => x.lesson_title === param.lesson_title
			);

			if (findActivity === -1) {
				setLogActivity(true);
			}
		}
	};

	//YOUTUBE setting

	const onPlayerStateChange = (event) => {
		if (event.data === 0) {
			setVideo(true)
		}
	};

	const opts = {
		width: "100%",
		height: "500px",
		playerVars: {
			autoplay: 1,
		},
	};

	// Create YouTube player
	const onReady = (event) => {
		event.target.playVideo();
	};

	//Functions
	function calculateScore(questions, answers) {
		let totalScore = 0;

		for (let i = 0; i < questions.length; i++) {
			let question = questions[i];
			let questionIndex = question.question_index;
			let correctAnswer = question.isCorrectAnswer;

			let participantAnswer = findParticipantAnswerById(
				answers,
				questionIndex
			);

			if (participantAnswer === correctAnswer) {
				totalScore++;
			}
		}

		let finalScore = (totalScore / questions.length) * 100;
		return finalScore;
	}

	function findParticipantAnswerById(answers, questionIndex) {
		for (let i = 0; i < answers.length; i++) {
			let answer = answers[i];
			if (answer.id === questionIndex) {
				return answer.answer;
			}
		}
		return null; // If no answer is found
	}

	//Handle
	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};
	const handleButtonAction = async (type) => {
		if (logActivity) {
			await arrayUnionFirebase(
				"user_course_progress",
				`${auth.currentUser.uid}-${param.course_id}`,
				"history",
				{
					lastUpdated: new Date(),
					lesson_title: decodeURIComponent(param.lesson_title),
					section_title: section.section_title,
					section_id: param.section_id,
				}
			);
		}
		if (type === "next") {
			navigate(
				`/course/${param.course_id}/section/${param.section_id
				}/lesson/${encodeURIComponent(nextPage?.lesson_title)}`
			);
		} else if (type === "back") {
			navigate(
				`/course/${param.course_id}/section/${param.section_id
				}/lesson/${encodeURIComponent(prevPage?.lesson_title)}`
			);
		} else if (type === "finish") {
			navigate(`/courses-employee/${param.course_id}`);
		}
	};

	const handleAnswerEmployee = (answerEmployee, question) => {
		const findIndex = answer.findIndex(
			(x) => x.id === question.question_index
		);
		let arr = [...answer];
		if (findIndex !== -1) {
			arr = arr.filter((x) => x.id !== question.question_index);
		}
		arr.push({
			id: question.question_index,
			answer: answerEmployee.id,
		});
		setAnswer(arr);
	};
	const handleSubmitQuiz = () => {
		const finalScore = calculateScore(question, answer);
		setScore(finalScore)
		const data = {
			course_id: param.course_id,
			uid: auth.currentUser.uid,
			user: {
				name: auth.currentUser.displayName,
				email: auth.currentUser.email,
			},
		};

		return MySwal.fire({
			title: "Are you sure?",
			text: "You want to submit this quiz?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Confirm",
			customClass: {
				confirmButton: "btn btn-primary",
				cancelButton: "btn btn-outline-danger ms-1",
			},
			buttonsStyling: false,
		}).then((result) => {
			if (result.isConfirmed) {
				try {
					arrayUnionFirebase(
						"quizzes",
						detailQuiz.id,
						"scores",
						{
							uid: auth.currentUser.uid,
							name: auth.currentUser.displayName,
							email: auth.currentUser.email,
							score: finalScore,
							timestamp: new Date(),
							answer: answer,
						}
					).then((res) => {
						if (res) {
							setDocumentFirebase(
								"user_course_progress",
								`${auth.currentUser.uid}-${param.course_id}`,
								data
							).then((response) => {
								if (response && logActivity) {
									arrayUnionFirebase(
										"user_course_progress",
										`${auth.currentUser.uid}-${param.course_id}`,
										"history",
										{
											lastUpdated: new Date(),
											lesson_title:
												decodeURIComponent(
													param.lesson_title
												),
											section_title:
												section.section_title,
											section_id:
												param.section_id,
										}
									).then((final) => {
										if (final && finalScore >= detailQuiz.quiz_minGrade) {
											MySwal.fire(
												"Submitted!",
												"You already submit the quiz",
												"success"
											);
											setAnswer([]);
										} else {
											MySwal.fire(
												"Failed!",
												`Sorry, your score is ${finalScore}/100 and it's below passing grade, you should learn this lesson again`,
												"error"
											);
										}
									});
								} else if (response && finalScore >= detailQuiz.quiz_minGrade) {
									MySwal.fire(
										"Submitted!",
										"You already submit the quiz",
										"success"
									);
									setAnswer([]);
								} else {
									MySwal.fire(
										"Failed!",
										`Sorry, your score is ${finalScore}/100 and it's below passing grade, you should learn this lesson again`,
										"error"
									);
								}
							});
						}
					});
				} catch (error) {
					throw error;
				}
			}
		});
	};

	//Component
	const ButtonActionComponent = ({ type }) => {
		return (
			<Button.Ripple
				color={"success"}
				onClick={() => handleButtonAction(type)}
			>
				{type === "next" ? (
					<>
						Next
						<ChevronRight size={14} className="ms-1" />
					</>
				) : type === "back" ? (
					<>
						<ChevronLeft size={14} className="me-1" />
						Back
					</>
				) : (
					<>
						Finish
						<Check size={14} className="ms-1" />
					</>
				)}
			</Button.Ripple>
		);
	};

	useEffect(() => {
		fetchDataLesson();
		fetchLogActivity();
		if (
			storeCourses.sections.length === 0 ||
			storeCourses.lessons.length === 0
		) {
			navigate("/courses-employee");
		}
		return () => {
			setLesson({});
			setCourse({});
			setPrevPage(null);
			setNextPage(null);
			setSection({});
			setQuestion({});
			setDetailQuiz({});
			setCurrentLesson({
				idSection: null,
				idLesson: null,
			});
			setIsLoading(false);
			setAnswer([]);
			setLogActivity(false);
			setVideo(false)
		};
	}, []);

	useEffect(() => { }, [nextPage, lesson.lesson_video, logActivity]);

	return (
		<UILoader blocking={isLoading.page} overlayColor={"white"}>
			<Fragment>
				<Breadcrumbs
					title="Course"
					data={[
						{
							title: "Course",
							link: "/courses-employee",
						},
						{
							title: course?.course_title,
							link: `/courses-employee/${param.course_id}`,
						},
						{
							title: section?.section_title,
							link: `/courses-employee/${param.course_id}`,
						},
						{
							title: decodeURIComponent(
								param?.lesson_title
							),
						},
					]}
				/>

				<div
					className="app-user-view"
					style={{
						position: "relative",
						minHeight: "70vh",
					}}
				>
					<Row>
						<Col
							xl="4"
							lg="5"
							xs={{ order: 1 }}
							md={{ order: 0, size: 5 }}
						>
							<Card
								style={{
									backgroundColor: "#FFFFFF",
								}}
							>
								<div className="user-avatar-section my-3">
									<div className="d-flex align-items-center flex-column">
										<div className="d-flex flex-column align-items-center text-center">
											<div className="user-info mt-1">
												<h4>
													{
														lesson?.lesson_title
													}
												</h4>
											</div>

											<div className="user-info mt-2">
												<p>
													{
														lesson?.lesson_description
													}
												</p>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</Col>
						<Col
							xl="8"
							lg="7"
							xs={{ order: 0 }}
							md={{ order: 1, size: 7 }}
						>
							<YouTube
								videoId={lesson.lesson_video}
								opts={opts}
								onReady={onReady}
								onStateChange={onPlayerStateChange}
							/>

							{/* <iframe
								width="100%"
								height="500px"
								src={`https://www.youtube-nocookie.com/embed/${lesson.lesson_video}`}
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
							></iframe> */}
						</Col>
					</Row>
					{detailQuiz && video && (
						<Row className="mt-2">
							<Col
								xl="4"
								lg="5"
								xs={{ order: 1 }}
								md={{ order: 0, size: 5 }}
							>
								<Card
									style={{
										backgroundColor: "#FFFFFF",
									}}
								>
									<div className="user-avatar-section my-3">
										<div className="d-flex align-items-center flex-column">
											<div className="d-flex flex-column align-items-center text-center">
												<div className="user-info mt-1">
													<h4>
														{
															detailQuiz?.quiz_title
														}
													</h4>
												</div>

												<div className="user-info mt-2">
													<p>
														{
															detailQuiz?.quiz_description
														}
													</p>
												</div>
												<div className="user-info mt-2">
													<p>
														{
															detailQuiz?.quiz_minGrade
														}
													</p>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</Col>
							<Col
								xl="8"
								lg="7"
								xs={{ order: 0 }}
								md={{ order: 1, size: 7 }}
							>
								<Row
									id="dd-with-handle"
									className="pl-1"
								>
									{question?.length > 0 && (
										<Col>
											{question?.map(
												(item, id) => {
													return (
														<ListGroupItem
															key={
																item.id
															}
															className="ml-1 p-0 border-0 mb-1"
														>
															<Card
																className="mb-0 w-full"
																key={
																	item.id
																}
															>
																<Accordion
																	open={
																		open
																	}
																	toggle={
																		toggle
																	}
																>
																	<AccordionItem>
																		<Row>
																			<Col className="pt-1">
																				{item?.question_img && (
																					<img
																						src={
																							item?.question_img
																						}
																						className="p-2"
																						style={{
																							width: "100%",
																							height: "270px",
																							objectFit:
																								"contain",
																						}}
																					/>
																				)}
																				<h5>
																					<List
																						size={
																							25
																						}
																						className="me-1 ms-1 handle"
																					/>

																					{
																						item.question_title
																					}
																				</h5>
																				{item.question_description && (
																					<div className="user-info mt-2 ps-5">
																						<p>
																							{
																								item.question_description
																							}
																						</p>
																					</div>
																				)}
																			</Col>
																			{/* <Col className="d-flex justify-content-end col-2">
																				<div className="p-1">
																					{open ===
																						"1" ? (
																						<RiArrowUpSLine
																							size={
																								24
																							}
																							onClick={() =>
																								toggle(
																									"1"
																								)
																							}
																						/>
																					) : (
																						<RiArrowDownSLine
																							size={
																								24
																							}
																							onClick={() =>
																								toggle(
																									"1"
																								)
																							}
																						/>
																					)}
																				</div>
																			</Col> */}
																		</Row>

																		<AccordionBody accordionId="1">
																			{item?.answer?.map(
																				(
																					items,
																					index
																				) => {
																					return (
																						<ListGroupItem
																							key={
																								index
																							}
																							className="p-0 border-0"
																						>
																							<Row className="handle bg-white">
																								<Col className="pt-1 ms-1">
																									<Form>
																										<div className="form-check">
																											<h6>
																												<Input
																													type="radio"
																													className="me-1"
																													onChange={() =>
																														handleAnswerEmployee(
																															items,
																															item
																														)
																													}
																													id={
																														items.answerTitle
																													}
																													name={
																														question.question_title
																													}
																													checked={answer.some(
																														(
																															ans
																														) =>
																															ans.id ===
																															item.question_index &&
																															ans.answer ===
																															items.id
																													)}
																												/>
																												<Label
																													className="form-check-label"
																													for={
																														items.answerTitle
																													}
																												>
																													{
																														items?.answerTitle
																													}
																												</Label>
																											</h6>
																										</div>
																									</Form>
																								</Col>
																							</Row>
																						</ListGroupItem>
																					);
																				}
																			)}
																		</AccordionBody>
																	</AccordionItem>
																</Accordion>
															</Card>
														</ListGroupItem>
													);
												}
											)}
										</Col>
									)}
								</Row>

								<Button.Ripple
									color={"primary"}
									className="me-1 mt-2"
									block
									onClick={() => handleSubmitQuiz()}
								>
									<Save size={14} />
									<span className="align-middle ms-25">
										Submit
									</span>
								</Button.Ripple>
							</Col>
						</Row>
					)}
				</div>
				{console.log(currentLesson, 'current', section, 'section')}
				<Col className="mt-2">
					{currentLesson.idLesson === 1 && section?.lesson_list?.length > 1 ? (
						<div
							className="d-flex justify-content-end"
							style={{
								position: "sticky",
								bottom: 0,
							}}
						>
							{detailQuiz && score >= detailQuiz?.quiz_minGrade ?
								<ButtonActionComponent type={"next"} /> : !detailQuiz && video ? <ButtonActionComponent type={"next"} /> : <></>
							}
						</div>
					) : currentLesson.idLesson === 1 && section?.lesson_list?.length === 1 ?
						<div
							className="d-flex justify-content-end"
							style={{
								position: "sticky",
								bottom: 0,
							}}
						>
							{detailQuiz && score >= detailQuiz?.quiz_minGrade ?
								<ButtonActionComponent type={"finish"} /> : !detailQuiz && video ? <ButtonActionComponent type={"finish"} /> : <></>
							}
						</div>
						:
						currentLesson.idLesson ===
							section?.lesson_list?.length ? (
							<div
								className="d-flex justify-content-between"
								style={{
									position: "sticky",
									bottom: 0,
								}}
							>
								<ButtonActionComponent type={"back"} />
								{detailQuiz && score >= detailQuiz?.quiz_minGrade ?
									<ButtonActionComponent type={"finish"} /> : !detailQuiz && video ? <ButtonActionComponent type={"finish"} /> : <></>
								}
							</div>
						) : (
							<div
								className="d-flex justify-content-between"
								style={{
									position: "sticky",
									bottom: 0,
								}}
							>
								<ButtonActionComponent type={"back"} />
								{detailQuiz && score >= detailQuiz?.quiz_minGrade ?
									<ButtonActionComponent type={"next"} /> : !detailQuiz && video ? <ButtonActionComponent type={"next"} /> : <></>
								}
							</div>
						)}
				</Col>
			</Fragment>
		</UILoader>
	);
};

export default SingleLesson;
