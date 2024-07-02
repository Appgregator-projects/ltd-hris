// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Button, Card, UncontrolledTooltip, CardBody, Col, Label, InputGroup, Input, Row } from "reactstrap";

import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import { Edit, Rss, Search, Trash } from "react-feather";
import { Table } from "reactstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { deleteDocumentFirebase, getCollectionFirebase } from "../../../../sevices/FirebaseApi";
import SingleAvatarGroup from "../../../../@core/components/single-avatar-group";
import { clientTypessense } from "../../../../apis/typesense";


const MySwal = withReactContent(Swal);

const QuizPage = () => {
	const [quizData, setQuizData] = useState([])
	const [groupList, setGroupList] = useState([]);
	const [searchValue, setSearchValue] = useState('')

	const navigate = useNavigate();

	const fetchDataQuiz = async () => {
		try {
			
			// setIsLoading(true)
			const searchParameterDeals = {
				q: searchValue !== "" ? searchValue : "*",
				query_by: ["lesson_title", "section_title","quiz_title"],
				// filter_by: dataQuery?.startDate && dataQuery?.endDate ? `table:==deals && createdAtInt:>=${Number(dataQuery.startDate)} && createdAtInt:<=${Number(dataQuery.endDate)}` : 'table:==deals',
				per_page: 10,
				// page: dataQuery.pages === 0 ? 1 : (dataQuery?.pages ? dataQuery.pages + 1 : currentPage + 1)
			};
			const resultTrash = await clientTypessense
				.collections("quizzes")
				.documents()
				.search(searchParameterDeals)


			const dataTrash = resultTrash.hits.map(
				(item) => (
					item.document
				)
			);
			console.log(dataTrash,"dataTrash")
			setQuizData(dataTrash)
			// setTrash(dataTrash)
			// setPagination({ totalPages: Math.ceil(resultTrash.found / (dataQuery?.limits ? dataQuery.limits : rowsPerPage)) })
			// setIsLoading(false)
			
			// const res = await getCollectionFirebase("quizzes");
			console.log(dataTrash)
			const questions = []
			if (dataTrash) {
				const resGroup = await getCollectionFirebase("groups");
				setGroupList(resGroup);

				dataTrash.forEach(async (questionList) => {
					console.log(questionList, 'quei')
					const questionArray = await getCollectionFirebase(`quizzes/${questionList.id}/question`)
					questions.push({
						...questionList,
						question: questionArray
					})
				})
				setQuizData(dataTrash);
			}
		} catch (error) {
			throw error;
		}
	};
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleFilter();
		}
	};


	const handleConfirmText = (item) => {
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
				if (item?.questions?.length > 0) {
					try {
						item?.questions.forEach((e) =>
							deleteDocumentFirebase(
								`quizzes/${item.id}/questions`,
								e
							)
						);
					} catch (error) {
						throw error;
					}
				}

				deleteDocumentFirebase("quizzes", item.id).then(
					(deleted) => {
						if (deleted) {
							MySwal.fire({
								icon: "success",
								title: "Deleted!",
								text: "Your file has been deleted.",
								customClass: {
									confirmButton: "btn btn-success",
								},
							});
							fetchDataQuiz()
						}
					}
				)

			}
		});
	};

	const handleFilter = () => {
		fetchDataQuiz()

	}

	useEffect(() => {
		fetchDataQuiz();
		return () => {
			setQuizData([]);
		};
	}, []);

	return (
		<Fragment>
			<Row>
				<Breadcrumbs title="Quiz" data={[{ title: "Quiz" }]} />
				<Card>
					<Col lg="12" className=" mt-2 d-flex justify-content-end" onKeyPress={handleKeyPress}>
						<div>
							<Label>Search</Label>
							<InputGroup className="mb-1">
								<Input
									onChange={(e) => setSearchValue(e.target.value)}
									className="dataTable-filter"
									type="text"
									bsSize="sm"
									id="search-input"
								value={searchValue}
								/>
								<Button color="primary"
								onClick={handleFilter}
								>
									<Search size={15}
									/>
								</Button>
							</InputGroup>
						</div>
					</Col>
					<CardBody>
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
								{quizData?.length > 0 ? quizData.map((item, index) => (
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
												{item?.course?.course_title}
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
															<div key={id} onClick={() => navigate('/groups')}>
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
													handleConfirmText(item)
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
								)) : <tr>
									<td></td>
									<td></td>
									<td>There is no quiz</td>
								</tr>}
							</tbody>
						</Table>
					</CardBody>
				</Card>

			</Row>
		</Fragment>
	);
};

export default QuizPage;
