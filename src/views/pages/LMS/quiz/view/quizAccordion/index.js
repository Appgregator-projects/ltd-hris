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
	UncontrolledTooltip,
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
	Trash,
	X,
} from "react-feather";
import AnswerAccordion from "../answerAccordion";
import DeleteButton from "../../DeleteButton";
import { useDropzone } from "react-dropzone";
import { Fragment } from "react";

// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";
import UploadMultipleFile from "../../../../Components/UploadMultipleFile";
import {
	deleteFileFirebase,
	setDocumentFirebase,
	uploadFile,
} from "../../../../../../sevices/FirebaseApi";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import UploadSingleFile from "../../../../Components/UploadSingleFile";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const QuizAccordion = ({
	data,
	id,
	fetchDataQuestion,
	image,
	fetchDataQuiz,
}) => {
	const [answerList, setAnswerList] = useState([]);
	const [editQuiz, setEditQuiz] = useState(false);
	const [newDataQuiz, setNewDataQuiz] = useState({});
	const [open, setOpen] = useState("1");
	const [answerCount, setAnswerCount] = useState(0);
	const param = useParams();

	const handleCount = () => {
		let answerLength = answerCount.length + 1;

		let arr = {
			id: answerList[answerList.length - 1]?.id + 1,
			answerTitle: "",
			isCorrectAnswer: false,
		};

		setAnswerCount([...answerCount, answerLength]);
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

	const handleSubmitQuestion = async (type) => {
		if (type === "save") {
			let newData = {
				...newDataQuiz,
			};
			if (image) {
				try {
					const res = await uploadFile(
						newDataQuiz.question_title,
						"questions",
						image
					);
					if (res) {
						newData.question_img = res;
					}
				} catch (error) {
					throw error;
				}
			}
			try {
				const res = await setDocumentFirebase(
					`quizzes/${param.id}/questions`,
					data.id,
					newData
				);
				if (res) {
					fetchDataQuestion();
					fetchDataQuiz();
					setEditQuiz(false);
					toast.success(`Question has edited`, {
						position: "top-center",
					});
				} else {
					return toast.error(`Error : ${res}`, {
						position: "top-center",
					});
				}
			} catch (error) {
				throw error;
			}
		} else if (type === "cancel") {
			setEditQuiz(false);
			setNewDataQuiz({ ...data });
			setAnswerList([...data.answer]);
		}
	};
	const handleDeleteImage = () => {
		const split = data.question_img.split("%2F");
		const finalSplit = split[1].split("?");
		const finalString = decodeURIComponent(finalSplit[0]);
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
				try {
					deleteFileFirebase(finalString, "questions").then(
						() => {
							setDocumentFirebase(
								`quizzes/${param.id}/questions`,
								data.id,
								{
									question_img: "",
								}
							).then((response) => {
								if (response) {
									fetchDataQuestion();
									fetchDataQuiz();
									MySwal.fire({
										icon: "success",
										title: "Deleted!",
										text: "Your file has been deleted.",
										customClass: {
											confirmButton:
												"btn btn-success",
										},
									});
								}
							});
						}
					);
				} catch (error) {
					throw error;
				}
			}
		});
	};
	useEffect(() => {
		Prism.highlightAll();
		if (data?.answer) {
			setAnswerList([...data.answer]);
			setAnswerCount(
				Array.from(
					{ length: data?.answer?.length },
					(_, index) => index + 1
				)
			);
		}
		if (data) {
			setNewDataQuiz({
				...data,
			});
		}
		return () => {
			setAnswerList([]);
			setAnswerCount(0);
			setNewDataQuiz({});
		};
	}, [data?.answer]);

	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					{!editQuiz ? (
						<Col className="pt-1">
							{data?.question_img && (
								<img
									src={data?.question_img}
									className="p-2"
									style={{
										width: "100%",
										height: "270px",
										objectFit: "contain",
									}}
								/>
							)}
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
						<Row>
							<Col className="ms-2 pt-1">
								<Col className="d-flex justify-content-end">
									<div className="pt-1">
										<Save
											size={20}
											onClick={() =>
												handleSubmitQuestion(
													"save"
												)
											}
											id="save-question"
										/>
										<UncontrolledTooltip
											placement="top"
											target="save-question"
										>
											Save Question
										</UncontrolledTooltip>
									</div>
									<div className="pt-1 px-1">
										<X
											onClick={() =>
												handleSubmitQuestion(
													"cancel"
												)
											}
											id="cancel-edit-question"
										/>
										<UncontrolledTooltip
											placement="top"
											target="cancel-edit-question"
										>
											Cancel
										</UncontrolledTooltip>
									</div>
								</Col>
								{data?.question_img ? (
									<Col
										style={{
											position: "relative",
										}}
									>
										<Button.Ripple
											className={
												"btn-icon mt-2"
											}
											color={"danger"}
											style={{
												position:
													"absolute",
												top: 0,
												right: 0,
											}}
											onClick={() =>
												handleDeleteImage()
											}
											id="delete-img-question"
										>
											<Trash size={14} />
										</Button.Ripple>
										<UncontrolledTooltip
											placement="top"
											target="delete-img-question"
										>
											Delete Image
										</UncontrolledTooltip>
										<img
											src={data?.question_img}
											className="p-2"
											style={{
												width: "100%",
												height: "270px",
												objectFit:
													"contain",
											}}
										/>
									</Col>
								) : (
									<UploadSingleFile data={[]} />
								)}
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
						</Row>
					)}

					<Col className="d-flex justify-content-end">
						<div className="py-1">
							{!editQuiz && (
								<Col className="d-flex">
									<DeleteButton
										type={"question"}
										newDataQuiz={newDataQuiz}
										id={id}
										fetchDataQuestion={
											fetchDataQuestion
										}
									/>
									<Edit
										size={20}
										onClick={() =>
											setEditQuiz(true)
										}
										id='edit-question'
									/>
									<UncontrolledTooltip
										placement="top"
										target="edit-question"
									>
										Edit Question
									</UncontrolledTooltip>
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
										fetchDataQuestion={
											fetchDataQuestion
										}
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
