// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
	Button,
	Col,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";

// ** Third Party Components
import { Edit, Plus } from "react-feather";
import { useForm } from "react-hook-form";

// ** Utils

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

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
	firstName: "Bob",
	lastName: "Barton",
	username: "bob.dev",
};

const AddCourse = ({ type }) => {
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
	} = useForm({ defaultValues });

	const onSubmit = (data) => {
		if (Object.values(data).every((field) => field.length > 0)) {
			return null;
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
				<Button.Ripple className="btn-icon me-1" color="warning"
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
						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								course_title
							</Label>
							<Input id="lastName" placeholder="Doe" />
						</Col>

						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								course_description
							</Label>
							<Input
								type={"textarea"}
								id="lastName"
								placeholder="Doe"
							/>
						</Col>

						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								course_author
							</Label>
							<Input id="lastName" placeholder="Doe" />
						</Col>

						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								course_tag
							</Label>{" "}
							<small className="text-muted">
								eg. <i>someone@example.com</i>
							</small>
							<Input id="lastName" placeholder="Doe" />
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
