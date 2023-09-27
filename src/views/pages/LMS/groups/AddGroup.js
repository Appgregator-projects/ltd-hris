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
	UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Edit, Plus, Trash } from "react-feather";
import { useForm } from "react-hook-form";

// ** Utils
import Api from "../../../../sevices/Api";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { toast } from "react-hot-toast";
import UploadSingleFile from "../../Components/UploadSingleFile";
import {
	addDocumentFirebase,
	deleteFileFirebase,
	setDocumentFirebase,
	uploadFile,
} from "../../../../sevices/FirebaseApi";
import { useDispatch } from "react-redux";
import { getImage } from "../store/courses";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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
const MySwal = withReactContent(Swal);

const AddGroup = ({ type, singleGroup, fetchDataGroup, image }) => {
	console.log(singleGroup, "singleGroup");
	// ** States
	const [show, setShow] = useState(false);
	const [groupData, setGroupData] = useState({
		group_name: singleGroup?.group_name,
		group_description: singleGroup?.group_description,
		group_tag: singleGroup?.group_tag,
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
		if (Object.values(groupData).every((field) => field.length > 0)) {
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

			let response = "";

			if (type === "Edit") {
				response = await setDocumentFirebase(
					"groups",
					singleGroup.id,
					newData
				);
			} else {
				try {
					response = await addDocumentFirebase(
						"groups",
						newData
					);
				} catch (error) {
					throw error;
				}
			}

			if (response) {
				fetchDataGroup();
				toast.success(`Group has ${type}ed`, {
					position: "top-center",
				});
				setShow(false);
				dispatch(getImage());
			} else {
				return toast.error(`Error : ${response}`, {
					position: "top-center",
				});
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
		const split = singleGroup.group_thumbnail.split("%2F");
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
					deleteFileFirebase(finalString, "groups").then(() => {
						setDocumentFirebase("groups", singleGroup.id, {
							group_thumbnail: "",
						}).then((response) => {
							if (response) fetchDataGroup();
						});
					});
					fetchDataGroup();
				} catch (error) {
					throw error;
				}
			}
		});
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
				<>
					<Button.Ripple
						className={"btn-icon me-1"}
						color={"warning"}
						onClick={() => setShow(true)}
						id="edit-group"
					>
						<Edit size={14} />
					</Button.Ripple>
					<UncontrolledTooltip
						placement="top"
						target="edit-group"
					>
						Edit Group
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
						{singleGroup?.group_thumbnail ? (
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
									src={singleGroup?.group_thumbnail}
									style={{
										width: "100%",
										height: "350px",
										objectFit: "contain",
									}}
								/>
							</Col>
						) : (
							<UploadSingleFile data={image} />
						)}
						<Col md={12} xs={12}>
							<Label className="form-label" for="lastName">
								Name
							</Label>
							<Input
								value={groupData?.group_name}
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
								value={groupData?.group_description}
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
								value={groupData?.group_tag}
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
