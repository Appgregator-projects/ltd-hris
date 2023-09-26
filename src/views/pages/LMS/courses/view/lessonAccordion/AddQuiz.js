import React, { Fragment, useState } from "react";
import { FilePlus } from "react-feather";
// ** Reactstrap Imports
import {
	Button,
	Col,
	FormFeedback,
	Input,
	InputGroup,
	InputGroupText,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";

// ** Third Party Components
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { useNavigate, useParams } from "react-router-dom";
import UploadSingleFile from "../../../../Components/UploadSingleFile";
import {
	addDocumentFirebase,
	uploadFile,
} from "../../../../../../sevices/FirebaseApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getImage } from "../../../store/courses";

const defaultValues = {
	quiz_title: "",
	quiz_description: "",
	quiz_minGrade: "",
};
const AddQuiz = ({ lesson, course, image }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const param = useParams();
	const [show, setShow] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const iconHoverStyle = {
		// Set the desired background color on hover
		cursor: "pointer", // Optional: Change the cursor to a pointer on hover
	};

	const iconStyle = {
		backgroundColor: "#FFFFFF",
	};
	const {
		control,
		setError,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues });

	const onSubmit = async (data) => {
		console.log(Object.values(data)[2]);
		// if (Object.values(data).every((field) => field.length > 0)) {
		if (
			Object.values(data)[0].length > 0 &&
			Object.values(data)[1].length > 0
		) {
			try {
				let newData = {
					quiz_title: Object.values(data)[0],
					quiz_description: Object.values(data)[1],
					quiz_minGrade: Object.values(data)[2],
					course: {
						course_title: course.course_title,
						course_id: param.id,
					},
					// section_id: lesson.section_id,
				};
				if (image) {
					const res = await uploadFile(
						Object.values(data)[0],
						"quizzes",
						image
					);
					if (res) {
						newData.quiz_thumbnail = res;
					}
				}
				const addQuiz = await addDocumentFirebase(
					"quizzes",
					newData
				);
				if (addQuiz) {
					toast.success(`Quiz has created`, {
						position: "top-center",
					});
					dispatch(getImage());
					navigate(`/quiz/${addQuiz}`);
				} else {
					return toast.error(`Error : ${addQuiz}`, {
						position: "top-center",
					});
				}
			} catch (error) {
				throw error;
			}
		} else {
			for (const key in data) {
				if (data[key].length === 0) {
					setError(key, {
						type: "manual",
					});
				}
			}
		}
	};

	return (
		<Fragment>
			<div className="py-1 me-1" onClick={() => setShow(true)}>
				<FilePlus
					size={isHovered ? 18 : 15}
					style={isHovered ? iconHoverStyle : iconStyle}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				/>
			</div>
			<Modal
				isOpen={show}
				toggle={() => setShow(!show)}
				className="modal-dialog-centered modal-lg"
			>
				<ModalHeader
					className="bg-transparent"
					toggle={() => setShow(!show)}
				></ModalHeader>
				<ModalBody className="px-sm-5 mx-50 pb-5">
					<div className="text-center mb-2">
						<h1 className="mb-1">Add Quiz </h1>
						<p>Add quiz for lesson {lesson.lesson_title}</p>
					</div>
					<Row
						tag="form"
						className="gy-1 pt-75"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Col xs={12}>
							<UploadSingleFile />
						</Col>
						<Col xs={12}>
							<Label
								className="form-label"
								for="quiz_title"
							>
								Title
							</Label>
							<Controller
								name="quiz_title"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="quiz_title"
										placeholder={`Quiz ${lesson.lesson_title}`}
										invalid={
											errors.quiz_title && true
										}
									/>
								)}
							/>
							{errors.quiz_title && (
								<FormFeedback>
									Please enter a valid title
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label
								className="form-label"
								for="quiz_description"
							>
								Description
							</Label>

							<Controller
								name="quiz_description"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										type="textarea"
										id="quiz_description"
										placeholder={`Description of quiz ${lesson.lesson_title}`}
										invalid={
											errors.quiz_description &&
											true
										}
									/>
								)}
							/>
							{errors.quiz_description && (
								<FormFeedback>
									Please enter a valid description
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label
								for="quiz_minGrade"
								className="form-label"
							>
								Passing Grade
							</Label>

							{/* <small className="text-muted">
								(<i>optional</i>)
							</small> */}
							<Controller
								name="quiz_minGrade"
								control={control}
								render={({ field }) => (
									<InputGroup className="input-group-merge mb-2">
										<Input
											placeholder="70"
											{...field}
											id="quiz_minGrade"
											type={"number"}
										/>
										<InputGroupText>
											%
										</InputGroupText>
									</InputGroup>
								)}
							/>
						</Col>
						<Col xs={12} className="text-center mt-2 pt-50">
							<Button
								type="submit"
								className="me-1"
								color="primary"
							>
								Submit
							</Button>
							<Button
								type="reset"
								color="secondary"
								outline
								onClick={() => setShow(false)}
							>
								Discard
							</Button>
						</Col>
					</Row>
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default AddQuiz;
