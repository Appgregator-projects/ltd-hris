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
import { Controller, useForm } from "react-hook-form";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import {
	arrayRemoveFirebase,
	arrayUnionFirebase,
	setDocumentFirebase,
} from "../../../../../../sevices/FirebaseApi";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ButtonSpinner from "../../../../components/ButtonSpinner";
import UploadMultipleFile from "../../../../Components/UploadMultipleFile";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "../../../../../../Helper/firebaseStorage";
import { auth } from "../../../../../../configs/firebase";

const defaultValues = {
	lesson_title: "",
	lesson_description: "",
	// lesson_video: "",
};

const AddLesson = ({
	section,
	sectionList,
	lessonList,
	setSectionList,
	fetchDataSection,
}) => {
	const param = useParams();
	// ** States
	const [show, setShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [URLvalid, setURLvalid] = useState(false);
	const [lessonType, setLessonType] = useState('youtube')
	const [loading, setLoading] = useState(false);
	const [defProps, setDefProps] = useState("");
	const [dataTask, setDataTask] = useState([]);
	const [byteProgress, setByteProgress] = useState(0);
	const [attachment, setAttachment] = useState([])
	const store = useSelector((state) => state.coursesSlice);
	console.log({ store })
	const uploadFile = (fileName, file, title) => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onprogress = (event) => {
				if (event.lengthComputable) {
					const percentLoaded = Math.round((event.loaded / event.total) * 100);
					setByteProgress(percentLoaded);
				}
			};
			reader.onload = async () => {
				const baseURL = reader.result;
				try {
					const result = await Upload(fileName, title, baseURL, `lessons`);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			};
		});
	};

	const handleUploadFiles = async (fileName) => {
		setLoading(true);

		const name = defProps.length !== 0 ? defProps.filter((e) => e.label === "Name") : '';
		const fileNames = name ? `${name[0]?.value?.value}-${new Date()}` : `${auth.currentUser.uid}-${fileName}-${new Date()}`;
		try {
			const uploadPromises = store?.image?.map((file, index) => uploadFile(`${fileName}-[${index + 1}]`, file, fileName));
			const results = await Promise.all(uploadPromises);
			setAttachment(results)
			return results

		} catch (error) {
			console.log(error, "ERROR UPLOAD");
		} finally {
			// handleData(parseInt(id));
		}
	}
	console.log(attachment, 'att')
	// ** Hooks
	const {
		control,
		setError,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues })


	const onSubmit = async (data) => {
		setIsLoading(true);

		let newData = {
			...data,
			section_id: section.section_index,
			chosen: false,
			selected: false,
			createdAt: new Date(),
		};
		// setIsLoading(false)
		// return console.log({ newData })

		if (Object.values(data)[0].length > 0 &&
			Object.values(data)[1].length > 0) {
			console.log('first')
			if (lessonType === 'youtube') {
				if (data.lesson_video.includes("youtube.com")) {
					const newString = data.lesson_video.split("?v=");
					newData.lesson_video = newString[1];
				} else if (data.lesson_video.includes("youtu.be")) {
					const newString = data.lesson_video.split("be/");
					newData.lesson_video = newString[1];
				} else {
					setError("lesson_video", {
						type: "manual",
					});

					return setIsLoading(false);
				}
			} else {
				const files = await handleUploadFiles(data.lesson_title)
				newData.lesson_video = files
			}

			let newSection = {
				...section,
				lesson_list: [newData],
			};
			const resDel = await arrayUnionFirebase(
				`courses/${param.id}/course_section`,
				section.id,
				"lesson_list",
				newData
			);

			if (resDel) {
				setIsLoading(false);
				fetchDataSection();
				toast.success(`Lesson has created`, {
					position: "top-center",
				});
				let arr = sectionList;
				arr[parseInt(section.id) - 1] = newSection;

				setSectionList(arr);
				reset(defaultValues);
				setShow(false);
			} else {
				setIsLoading(false);
				return toast.error(`Error : ${resDel}`, {
					position: "top-center",
				});
			}
		} else {
			setIsLoading(false);
			console.log('second')
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
				<MdOutlineBookmarkAdd size={24} id="add-lesson" />
				<UncontrolledTooltip placement="top" target="add-lesson">
					Add Lesson
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
						<h1 className="mb-1">Add Lesson</h1>
						<p>
							Add new lesson in section{" "}
							{section.section_title}.
						</p>
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
										placeholder={`This is introduction for ${section.section_title}`}
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
						<Col>
							<Label>Lesson Type</Label>
							<div className='d-flex'>
								<div className='form-check me-1'>
									<Input type='radio' id='ex1-active' name='ex1' defaultChecked onChange={(e) => setLessonType('youtube')} />
									<Label className='form-check-label' for='ex1-active'>
										Youtube Video
									</Label>
								</div>
								<div className='form-check'>
									<Input type='radio' name='ex1' id='ex1-inactive' onChange={(e) => setLessonType('file')} />
									<Label className='form-check-label' for='ex1-inactive'>
										File
									</Label>
								</div>
							</div>
						</Col>
						{lessonType === 'youtube' ?
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
										// invalid={
										// 	errors.lesson_video &&
										// 	true
										// }
										/>
									)}
								/>
								{/* {errors.lesson_video && (
									<FormFeedback>
										Please enter a valid Youtube URL
									</FormFeedback>
								)} */}
							</Col>
							: <Col xs={12}>
								<UploadMultipleFile />
							</Col>
						}
						<Col xs={12} className="text-center mt-2 pt-50">
							<ButtonSpinner
								type={"submit"}
								isLoading={isLoading}
								color={"primary"}
								label={"Submit"}
							/>
							{/* <Button
								type="submit"
								className="me-1"
								color="primary"
							>
								Submit
							</Button> */}
							<Button
								type="reset"
								color="secondary"
								outline
								onClick={() => setShow(false)}
								className="ms-1"
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

export default AddLesson;
