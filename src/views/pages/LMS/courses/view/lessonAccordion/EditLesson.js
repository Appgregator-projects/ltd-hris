// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
	Button,
	Col,
	FormFeedback,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
	UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Edit } from "react-feather";
import { Controller, useForm } from "react-hook-form";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import {
	arrayRemoveFirebase,
	arrayUnionFirebase,
	setDocumentFirebase,
} from "../../../../../../sevices/FirebaseApi";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const EditLesson = ({
	lesson,
	sectionList,
	lessonList,
	setSectionList,
	lessonIndex,
	section,
	fetchDataSection,
}) => {
	const param = useParams();
	const defaultValues = {
		lesson_title: lesson.lesson_title,
		lesson_description: lesson.lesson_description,
		lesson_video: `https://www.youtube.com/watch?v=${lesson.lesson_video}`,
	};
	// ** States
	const [show, setShow] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const iconHoverStyle = {
		// Set the desired background color on hover
		cursor: "pointer", // Optional: Change the cursor to a pointer on hover
	};

	const iconStyle = {
		backgroundColor: "#FFFFFF",
	};

	// ** Hooks
	const {
		control,
		setError,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues });

	const onSubmit = async (data) => {
		let newData = {
			...data,
			section_id: section.section_index,
			chosen: false,
			selected: false,
		};

		if (Object.values(data).every((field) => field.length > 0)) {
			if (data.lesson_video.includes("?v=")) {
				const newString = data.lesson_video.split("?v=");
				newData.lesson_video = newString[1];
			} else {
				const newString = data.lesson_video.split("be/");
				newData.lesson_video = newString[1];
			}
			const newLessonList = [...lessonList]; // Salin array lessonList agar tidak merubah array asli
			newLessonList[lessonIndex] = newData;

			let newSection = {
				...section,
				lesson_list: newLessonList,
			};
			try {
				const res = await setDocumentFirebase(
					`courses/${param.id}/course_section`,
					section.section_index,
					newSection
				);
				if (res) {
					toast.success(`Lesson has updated`, {
						position: "top-center",
					});
					reset(defaultValues);
					setShow(false);
					fetchDataSection();
				} else {
					return toast.error(`Error : ${res}`, {
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
			<div className="py-1" onClick={() => setShow(true)}>
				<Edit
					size={isHovered ? 18 : 15}
					style={isHovered ? iconHoverStyle : iconStyle}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					id='edit-lesson'
				/>
				<UncontrolledTooltip placement="top" target="edit-lesson">
					Edit Lesson
				</UncontrolledTooltip>
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
						<h1 className="mb-1">Edit Lesson</h1>
						<p>Update lesson {lesson.lesson_title}.</p>
					</div>
					<Row
						tag="form"
						className="gy-1 pt-75"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Col xs={12}>
							<Label
								className="form-label"
								for="lesson_title"
							>
								Title
							</Label>
							<Controller
								name="lesson_title"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="lesson_title"
										placeholder="Introduction"
										invalid={
											errors.lesson_title &&
											true
										}
									/>
								)}
							/>
							{errors.lesson_title && (
								<FormFeedback>
									Please enter a valid title
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label
								className="form-label"
								for="lesson_description"
							>
								Description
							</Label>
							<Controller
								name="lesson_description"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										type="textarea"
										id="lesson_description"
										placeholder={`This is introduction for ${lesson.lesson_title}`}
										invalid={
											errors.lesson_description &&
											true
										}
									/>
								)}
							/>
							{errors.lesson_description && (
								<FormFeedback>
									Please enter a valid description
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label for="lesson_video" class="form-label">
								Youtube URL
							</Label>
							<Controller
								name="lesson_video"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="lesson_video"
										placeholder="https://youtu.be/SBmSRK3feww"
										invalid={
											errors.lesson_video &&
											true
										}
									/>
								)}
							/>
							{errors.lesson_video && (
								<FormFeedback>
									Please enter a valid URL
								</FormFeedback>
							)}
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

export default EditLesson;
