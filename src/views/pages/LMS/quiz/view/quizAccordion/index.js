import { useEffect, useState } from "react";
// ** Reactstrap Imports
import {
	Accordion,
	AccordionBody,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Col,
	Form,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
	Row,
} from "reactstrap";

// ** Third Party Components
import Prism from "prismjs";
import { ReactSortable } from "react-sortablejs";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import {
	DownloadCloud,
	Edit,
	FileText,
	List,
	Plus,
	Save,
	X,
} from "react-feather";
import AnswerAccordion from "../answerAccordion";
import DeleteButton from "../../DeleteButton";
import { useDropzone } from "react-dropzone";
import { Fragment } from "react";

// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";
import UploadMultipleFile from "../../../../Components/UploadMultipleFile";

const QuizAccordion = ({ data, setQuizList, quizList }) => {
	const [answerList, setAnswerList] = useState([...data.answer]);
	const [editQuiz, setEditQuiz] = useState(false);
	const [newDataQuiz, setNewDataQuiz] = useState({
		...data,
	});
	const [open, setOpen] = useState("1");
	const [answerCount, setAnswerCount] = useState(
		Array.from({ length: answerList.length }, (_, index) => index + 1)
	);

	console.log({ newDataQuiz });
	const handleCount = () => {
		let answerLength = answerCount.length + 1;
		setAnswerCount([...answerCount, answerLength]);

		let arr = {
			id: answerLength,
			answerTitle: "",
			isCorrectAnswer: false,
		};
		setNewDataQuiz({ ...newDataQuiz, answer: [...answerList, arr] });
		setAnswerList([...answerList, arr]);
	};

	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	const handleSubmitQuestion = (type) => {
		if (type === "save") {
			setAnswerList(newDataQuiz.answer);
			setEditQuiz(false);
		} else if (type === "cancel") {
			setEditQuiz(false);
		}
	};

	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					{!editQuiz ? (
						<Col className="pt-1">
							<h5>
								<List
									size={25}
									className="me-1 ms-1 handle"
								/>
								{data.question_title}
							</h5>
							<div className="user-info mt-2 ps-5">
								<p>{data.question_description}</p>
							</div>
						</Col>
					) : (
						<>
							<Col className="d-flex justify-content-end">
								<div className="pt-1">
									<Save
										size={20}
										onClick={() =>
											handleSubmitQuestion(
												"save"
											)
										}
									/>
								</div>
								<div className="pt-1 px-1">
									<X
										onClick={() =>
											handleSubmitQuestion(
												"cancel"
											)
										}
									/>
								</div>
							</Col>

							<Col className="ms-2 pt-1 col-10">
								<UploadMultipleFile />
								<Form>
									<Label>Question Title</Label>
									<Input
										type="text"
										defaultValue={
											newDataQuiz.question_title
										}
										onChange={(e) =>
											setNewDataQuiz({
												...newDataQuiz,
												question_title:
													e.target.value,
											})
										}
									/>
								</Form>
								<Form className="mt-1">
									<Label>Question Description</Label>
									<Input
										type={"textarea"}
										defaultValue={
											newDataQuiz.question_description
										}
										onChange={(e) =>
											setNewDataQuiz({
												...newDataQuiz,
												question_description:
													e.target.value,
											})
										}
									/>
								</Form>
								{editQuiz && (
									<Label className="mt-1">
										Answer
									</Label>
								)}
							</Col>
						</>
					)}

					<Col className="d-flex justify-content-end">
						<div className="py-1">
							{!editQuiz && (
								<Col className="d-flex">
									<DeleteButton type={"question"} />
									<Edit
										size={20}
										onClick={() =>
											setEditQuiz(true)
										}
									/>
								</Col>
							)}
						</div>

						<div className="p-1">
							{!editQuiz &&
								(open === "1" ? (
									<RiArrowUpSLine
										size={24}
										onClick={() => toggle("1")}
									/>
								) : (
									<RiArrowDownSLine
										size={24}
										onClick={() => toggle("1")}
									/>
								))}
						</div>
					</Col>
				</Row>

				<AccordionBody accordionId="1">
					<ReactSortable
						tag="ul"
						className="list-group sortable"
						group="shared-handle-group"
						handle=".handle"
						list={answerList}
						setList={setAnswerList}
					>
						{answerList?.map((item, index) => {
							return (
								<ListGroupItem
									key={index}
									className="p-0 border-0"
								>
									<AnswerAccordion
										answer={item}
										quiz={data}
										editQuiz={editQuiz}
										answerLength={
											answerList.length
										}
										newDataQuiz={newDataQuiz}
										setNewDataQuiz={
											setNewDataQuiz
										}
										setAnswerList={setAnswerList}
									/>
								</ListGroupItem>
							);
						})}
					</ReactSortable>
					{editQuiz && (
						<Button.Ripple
							color={"primary"}
							className={"mt-2 "}
							block
							onClick={() => handleCount()}
						>
							<Plus size={14} />
							<span className="align-middle ms-25">
								Answer
							</span>
						</Button.Ripple>
					)}
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default QuizAccordion;
