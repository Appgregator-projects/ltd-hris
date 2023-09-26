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
import { Edit, Plus, Trash } from "react-feather";
import { Controller, useForm } from "react-hook-form";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { toast } from "react-hot-toast";
import UploadSingleFile from "../../Components/UploadSingleFile";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../../../configs/firebase";
import {
	addDocumentFirebase,
	deleteFileFirebase,
	setDocumentFirebase,
	uploadFile,
} from "../../../../sevices/FirebaseApi";
import { getImage } from "../store/courses";
import { useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const AddCourse = ({ type, id, image, fetchDataCourse, data }) => {
	const defaultValues = {
		course_title: data?.course_title,
		course_description: data?.course_description,
		course_tag: data?.course_tag,
	};

	const dispatch = useDispatch();
	const param = useParams();
	// ** States
	const [show, setShow] = useState(false);
	const [groupData, setGroupData] = useState({
		course_title: "",
		course_description: "",
		course_thumbnail: "",
		course_tag: [],
		course_author: "",
	});

	// ** Hooks
	const {
		control,
		setError,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues });

	const onSubmit = async (item) => {
		if (Object.values(item).every((field) => field.length > 0)) {
			try {
				let newData = {
					course_title: item.course_title,
					course_description: item.course_description,
					course_author: {
						name: auth.currentUser.displayName,
						id: auth.currentUser.uid,
					},
					course_tag: item.course_tag,
					isOpen: true,
				};
				if (image[0]) {
					const res = await uploadFile(
						item.course_title,
						"courses",
						image[0]
					);
					if (res) {
						newData.course_thumbnail = res;
					}
				}
				let response = "";

				if (type === "Add") {
					response = await addDocumentFirebase(
						"courses",
						newData
					);
				} else {
					response = await setDocumentFirebase(
						"courses",
						data.id,
						newData
					);
				}
				if (response) {
					toast.success(`Course has ${type}ed`, {
						position: "top-center",
					});
					if (image[0]) {
						dispatch(getImage());
					}
					reset(defaultValues);
					setShow(false);
					fetchDataCourse();
				} else {
					return toast.error(`Error : ${response}`, {
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

	const handleDeleteImage = () => {
		const split = data.course_thumbnail.split("%2F");
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
					deleteFileFirebase(finalString, "courses").then(() => {
						setDocumentFirebase("courses", data.id, {
							course_thumbnail: "",
						}).then((response) => {
							if (response) fetchDataCourse();
						});
					});
				} catch (error) {
					throw error;
				}
			}
		});
	};

	return (
		<Fragment>
			{type === "Add" ? (
				<Button.Ripple
					color="primary"
					onClick={() => setShow(true)}
				>
					<Plus size={14} />
					<span className="align-middle ms-25">Course</span>
				</Button.Ripple>
			) : (
				<>
					<Button.Ripple
						className="btn-icon me-1"
						color="warning"
						onClick={() => setShow(true)}
						id="edit-course"
					>
						<Edit size={14} />
					</Button.Ripple>
					<UncontrolledTooltip
						placement="top"
						target="edit-course"
					>
						Edit Course
					</UncontrolledTooltip>
				</>
			)}

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
						<h1 className="mb-1">{type} Course</h1>
						<p>
							{type} a course to your platform. Provide the
							title, description, author, and other
							details. Click 'Submit' to save the course
							and make it available to your users
						</p>
					</div>
					<Row
						tag="form"
						className="gy-1 pt-75"
						onSubmit={handleSubmit(onSubmit)}
					>
						{type === "Add" ? (
							<UploadSingleFile
								data={groupData.course_thumbnail}
							/>
						) : data?.course_thumbnail ? (
							<Col style={{ position: "relative" }}>
								<Button.Ripple
									className={"btn-icon"}
									color={"danger"}
									style={{
										position: "absolute",
										top: 0,
										right: 0,
									}}
									onClick={() => handleDeleteImage()}
								>
									<Trash size={14} />
								</Button.Ripple>
								<img
									src={data?.course_thumbnail}
									style={{
										width: "100%",
										height: "350px",
										objectFit: "contain",
									}}
								/>
							</Col>
						) : (
							<UploadSingleFile
								data={groupData.course_thumbnail}
							/>
						)}
						<Col xs={12}>
							<Label
								className="form-label"
								for="course_title"
							>
								Title
							</Label>
							<Controller
								name="course_title"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="course_title"
										placeholder="Introduction to Web Development"
										invalid={
											errors.course_title &&
											true
										}
									/>
								)}
							/>
							{errors.course_title && (
								<FormFeedback>
									Please enter a valid title
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label
								className="form-label"
								for="course_description"
							>
								Description
							</Label>
							<Controller
								name="course_description"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										type="textarea"
										id="course_description"
										placeholder={
											"Learn the fundamentals of web development with HTML, CSS, and JavaScript."
										}
										invalid={
											errors.course_description &&
											true
										}
									/>
								)}
							/>
							{errors.course_description && (
								<FormFeedback>
									Please enter a valid description
								</FormFeedback>
							)}
						</Col>
						<Col xs={12}>
							<Label
								for="course_tag"
								className="form-label"
							>
								Tag
							</Label>
							<Controller
								name="course_tag"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="course_tag"
										placeholder="IT"
										invalid={
											errors.course_tag && true
										}
									/>
								)}
							/>
							{errors.course_tag && (
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

export default AddCourse;
