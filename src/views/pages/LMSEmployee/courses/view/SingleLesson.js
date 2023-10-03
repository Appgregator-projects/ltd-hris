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
	getCollectionFirebase,
	getSingleDocumentFirebase,
} from "../../../../../sevices/FirebaseApi";
import { useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Styles
import "@styles/react/apps/app-users.scss";
import { useParams } from "react-router-dom";
import { Save, List, ChevronRight, ChevronLeft } from "react-feather";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const SingleLesson = () => {
	const param = useParams();

	const [section, setSection] = useState({});
	const [course, setCourse] = useState({});
	const [lesson, setLesson] = useState({});
	const [detailQuiz, setDetailQuiz] = useState({});
	const [question, setQuestion] = useState({});
	const [open, setOpen] = useState("1");
	const [answer, setAnswer] = useState(null);

	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};
	const fetchDataLesson = async () => {
		const res = await getSingleDocumentFirebase(
			`courses/${param.course_id}/course_section`,
			param.section_id
		);
		setSection(res);
		console.log({ res });
		const findLesson = res?.lesson_list?.find(
			(x) => x.lesson_title === decodeURIComponent(param?.lesson_title)
		);

		setLesson(findLesson);
		const resCourse = await getSingleDocumentFirebase(
			`courses`,
			param.course_id
		);
		setCourse(resCourse);

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
		const resQuiz = await getCollectionFirebase("quizzes", conditions);
		setDetailQuiz(resQuiz[0]);
		console.log({ resQuiz });
		const resQuestion = await getCollectionFirebase(
			`quizzes/${resQuiz[0].id}/questions`
		);
		setQuestion(resQuestion);
	};

	useEffect(() => {
		fetchDataLesson();
		return () => {
			setLesson({});
			setCourse({});
			setSection({});
			setQuestion({});
			setDetailQuiz({});
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Course"
				data={[
					{ title: "Course", link: "/courses-employee" },
					{
						title: course?.course_title,
						link: `/courses-employee/${param.course_id}`,
					},
					{
						title: section?.section_title,
						link: `/courses-employee/${param.course_id}`,
					},
					{ title: decodeURIComponent(param?.lesson_title) },
				]}
			/>

			<div
				className="app-user-view"
				style={{ position: "relative", minHeight: "70vh" }}
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
						<iframe
							width="100%"
							height="500px"
							src={`https://www.youtube-nocookie.com/embed/${lesson.lesson_video}`}
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						></iframe>
					</Col>
				</Row>
				{detailQuiz && (
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
							<Row id="dd-with-handle" className="pl-1">
								{question?.length > 0 && (
									<Col>
										{question?.map((item) => {
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
																	<Col className="d-flex justify-content-end col-2">
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
																	</Col>
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
																												setAnswer(
																													items.id
																												)
																											}
																											id={
																												items.answerTitle
																											}
																											name={
																												question.question_title
																											}
																											checked={
																												items.id ===
																												answer
																											}
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
										})}
									</Col>
								)}
							</Row>

							<Button.Ripple
								color={"primary"}
								className="me-1 mt-2"
								block
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
			<Col
				className="mt-2"
				style={{
					position: "sticky",
					bottom: 0,
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Button.Ripple color={"primary"}>
					<ChevronLeft size={14} className="me-1" />
					Back
				</Button.Ripple>
				<Button.Ripple color={"primary"}>
					Next
					<ChevronRight size={14} className="ms-1" />
				</Button.Ripple>
			</Col>
		</Fragment>
	);
};

export default SingleLesson;
