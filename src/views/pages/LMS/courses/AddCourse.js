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
} from "reactstrap";

// ** Third Party Components
import { Edit, Plus } from "react-feather";
import { Controller, useForm } from "react-hook-form";

// ** Utils
import Api from "../../../../sevices/Api";
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { toast } from "react-hot-toast";
import UploadSingleFile from "../../Components/UploadSingleFile";
import { useSelector } from "react-redux";
import { auth } from "../../../../configs/firebase";
import {
	addDocumentFirebase,
	uploadFile,
} from "../../../../sevices/FirebaseApi";

const statusOptions = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "suspended", label: "Suspended" },
];

const countryOptions = [
	{ value: "uk", label: "UK" },
	{ value: "usa", label: "USA" },
	{ value: "france", label: "France" },
	{ value: "russia", label: "Russia" },
	{ value: "canada", label: "Canada" },
];

const languageOptions = [
	{ value: "english", label: "English" },
	{ value: "spanish", label: "Spanish" },
	{ value: "french", label: "French" },
	{ value: "german", label: "German" },
	{ value: "dutch", label: "Dutch" },
];

const defaultValues = {
	course_title: "",
	course_description: "",
	course_tag: [],
	// course_author: "",
};

const AddCourse = ({ type, id, image, fetchDataCourse }) => {
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

	const onSubmit = async (data) => {
		if (Object.values(data).every((field) => field.length > 0)) {
			try {
				uploadFile(data.course_title, "courses", image[0]).then(
					(res) => {
						const newData = {
							course_title: data.course_title,
							course_description: data.course_description,
							course_thumbnail: res,
							course_author: {
								name: auth.currentUser.displayName,
								id: auth.currentUser.uid,
							},
							course_tag: data.course_tag,
							isOpen: true,
						};
						addDocumentFirebase("courses", newData).then(
							(response) => {
								if (response) {
									toast.success(
										`Course has ${type}ed`,
										{
											position: "top-center",
										}
									);
									fetchDataCourse();
									reset(defaultValues);
									setShow(false);
								} else {
									return toast.error(
										`Error : ${response}`,
										{
											position: "top-center",
										}
									);
								}
							}
						);
					}
				);
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
			{type === "Add" ? (
				<Button.Ripple
					color="primary"
					onClick={() => setShow(true)}
				>
					<Plus size={14} />
					<span className="align-middle ms-25">Course</span>
				</Button.Ripple>
			) : (
				<Button.Ripple
					className="btn-icon me-1"
					color="warning"
					onClick={() => setShow(true)}
				>
					<Edit size={14} />
				</Button.Ripple>
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
						<UploadSingleFile
							data={groupData.course_thumbnail}
						/>
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
						{/* <Col xs={12}>
							<Label
								for="course_author"
								class="form-label"
							>
								Author
							</Label>
							<Controller
								name="course_author"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="course_author"
										placeholder="John Doe"
										invalid={
											errors.course_author &&
											true
										}
									/>
								)}
							/>
							{errors.course_author && (
								<FormFeedback>
									Please enter a valid URL
								</FormFeedback>
							)}
						</Col> */}
						<Col xs={12}>
							<Label for="course_tag" class="form-label">
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
