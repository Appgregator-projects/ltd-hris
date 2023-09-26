// ** Reactstrap Imports
import { Col, Form, Input, InputGroup, InputGroupText, Row } from "reactstrap";

// ** Third Party Components
import Prism from "prismjs";
import { useEffect, useState } from "react";
import { Trash } from "react-feather";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const AnswerAccordion = ({
	answer,
	quiz,
	editQuiz,
	answerLength,
	newDataQuiz,
	setNewDataQuiz,
	setAnswerList
}) => {
	const MySwal = withReactContent(Swal);
	const [isHovered, setIsHovered] = useState(false);
console.log(answer,'answer nih')
	const iconHoverStyle = {
		cursor: "pointer",
	};

	const iconStyle = {
		backgroundColor: "#FFFFFF",
	};

	const handleChangeAnswer = (e, index) => {
		const { value, checked } = e.target;

		const findIndex = newDataQuiz?.answer.findIndex(
			(x) => x.id === index
		);
		const findIndexCorrect = newDataQuiz?.answer.findIndex(
			(x) => x.isCorrectAnswer === true
		);

		switch (true) {
			case findIndex === -1 && !checked:
				newDataQuiz.answer.push({
					isCorrectAnswer: checked,
					id: index,
					answerTitle: value,
				});
				newDataQuiz.id = quizList.length + 1;
				newDataQuiz.isCorrectAnswer = index;
				break;

			case findIndexCorrect === -1 && checked:
				newDataQuiz.answer[findIndex].isCorrectAnswer = checked;
				newDataQuiz.isCorrectAnswer = index;
				break;

			case findIndexCorrect !== -1 && checked:
				newDataQuiz.answer[
					findIndexCorrect
				].isCorrectAnswer = false;
				newDataQuiz.answer[findIndex].isCorrectAnswer = checked;
				newDataQuiz.isCorrectAnswer = index;
				break;

			default:
				newDataQuiz.answer[findIndex].answerTitle = value;
		}

	};

	const handleConfirmText = (index) => {
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
				const findIndex = newDataQuiz?.answer.findIndex(
					(x) => x.id === index
				);

				const newData = newDataQuiz.answer.splice(findIndex, 1);

				setNewDataQuiz({ ...newDataQuiz, answer: newData });
				setAnswerList([...newDataQuiz.answer]);


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
		Prism.highlightAll();
	}, []);

	return (
		<Row className="handle bg-white">
			{!editQuiz ? (
				<Col className="pt-1 ms-1">
					<Form>
						<div className="form-check">
							<h6>
								<Input
									type="radio"
									className="me-1"
									defaultChecked={
										quiz?.isCorrectAnswer ===
										answer?.id
									}
								/>
								{answer?.answerTitle}
							</h6>
						</div>
					</Form>
				</Col>
			) : (
				<>
					<Col
						className={
							answerLength !== 2 ? "mt-1 col-11" : "mt-1"
						}
					>
						<Form>
							<InputGroup
								onChange={(e) =>
									handleChangeAnswer(e, answer?.id)
								}
							>
								<InputGroupText>
									<div className="form-check">
										<Input
											type="radio"
											checked={
												newDataQuiz?.isCorrectAnswer ===
												answer?.id
											}
											onChange={() =>
												setNewDataQuiz({
													...newDataQuiz,
													isCorrectAnswer:
														answer?.id,
												})
											}
										/>
									</div>
								</InputGroupText>
								<Input
									type="text"
									defaultValue={
										newDataQuiz?.answer[
											answer?.id - 1
										]?.answerTitle
									}
								/>
							</InputGroup>
						</Form>
					</Col>
					{answerLength !== 2 && (
						<Col className="d-flex justify-content-end">
							<div className="py-2 pe-1">
								<Trash
									size={isHovered ? 18 : 15}
									style={
										isHovered
											? iconHoverStyle
											: iconStyle
									}
									onMouseEnter={() =>
										setIsHovered(true)
									}
									onMouseLeave={() =>
										setIsHovered(false)
									}
									onClick={() =>
										handleConfirmText(answer?.id)
									}
								/>
							</div>
						</Col>
					)}
				</>
			)}
		</Row>
	);
};

export default AnswerAccordion;
