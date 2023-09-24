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
import Api from "../../../../sevices/Api";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { toast } from "react-hot-toast";
import UploadSingleFile from "../../Components/UploadSingleFile";
import {
	addDocumentFirebase,
	uploadFile,
} from "../../../../sevices/FirebaseApi";
import { useDispatch } from "react-redux";
import { getImage } from "../store/courses";

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

const AddGroup = ({ type, singleGroup, fetchDataGroup, image }) => {
	console.log(image, "image");
	// ** States
	const [show, setShow] = useState(false);
	const [groupData, setGroupData] = useState({
		group_name: "",
		group_description: "",
		group_tag: [],
	});
	const dispatch = useDispatch();
	// ** Hooks
	const {
		control,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues });

	const onSubmit = async (data) => {
		console.log({ data });
		if (Object.values(groupData).every((field) => field.length > 0)) {
			if (type === "Edit") {
				const update = await Api.put(
					`/hris/lms/lms-group/${singleGroup.id}`,
					groupData
				);
				if (!update)
					return toast.error(`Error : ${update}`, {
						position: "top-center",
					});
			} else {
				const newData = {
					...groupData,
				};
				if (image[0]) {
					try {
						const res = await uploadFile(
							groupData.group_name,
							"groups",
							image[0]
						);
						if (res) {
							newData.group_thumbnail = res;
						}
					} catch (error) {
						throw error;
					}
				}
				console.log(newData, "dada");
				try {
					await addDocumentFirebase("groups", newData).then(
						(response) => {
							if (response) {
								fetchDataGroup();
								toast.success(`Group has ${type}ed`, {
									position: "top-center",
								});
								setShow(false);
								dispatch(getImage());
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
				} catch (error) {
					throw error;
				}
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
			{type === "Create" ? (
				<Button.Ripple
					color="primary"
					onClick={() => setShow(true)}
				>
					<Plus size={14} />
					<span className="align-middle ms-25">Group</span>
				</Button.Ripple>
			) : (
				<Button.Ripple
					className={"btn-icon me-1"}
					color={"warning"}
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
						<h1 className="mb-1">{type} Learning Group</h1>
						<p>
							{type} learning group to assign multiple
							course for specified user
						</p>
					</div>
					<Row
						tag="form"
						className="gy-1 pt-75"
						onSubmit={handleSubmit(onSubmit)}
					>
						<UploadSingleFile data={image} />
						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								Name
							</Label>
							<Input
								id="lastName"
								placeholder="IT"
								onChange={(e) =>
									setGroupData({
										...groupData,
										group_name: e.target.value,
									})
								}
							/>
						</Col>

						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								Description
							</Label>
							<Input
								type={"textarea"}
								id="lastName"
								placeholder="This is group for IT Division"
								onChange={(e) =>
									setGroupData({
										...groupData,
										group_description:
											e.target.value,
									})
								}
							/>
						</Col>

						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								Tag
							</Label>{" "}
							<small className="text-muted">
								eg. <i>IT</i>
							</small>
							<Input
								id="lastName"
								placeholder="IT"
								onChange={(e) =>
									setGroupData({
										...groupData,
										group_tag: e.target.value,
									})
								}
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

export default AddGroup;
