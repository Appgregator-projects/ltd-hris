// ** React Imports
import { Fragment, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
	Button,
	Col,
	Label,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalBody,
	ModalHeader,
} from "reactstrap";

// ** Third Party Components
import { Link, Trash, UserPlus, Users } from "react-feather";
import Select, { components } from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";
import Api from "../../../../sevices/Api";

// ** Avatars
import avatar1 from "@src/assets/images/avatars/1-small.png";
import avatar6 from "@src/assets/images/avatars/11-small.png";
import avatar2 from "@src/assets/images/avatars/3-small.png";
import avatar3 from "@src/assets/images/avatars/5-small.png";
import avatar4 from "@src/assets/images/avatars/7-small.png";
import avatar5 from "@src/assets/images/avatars/9-small.png";

// ** Portraits
import portrait6 from "@src/assets/images/portrait/small/avatar-s-10.jpg";
import portrait5 from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import portrait2 from "@src/assets/images/portrait/small/avatar-s-3.jpg";
import portrait3 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import portrait8 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import portrait4 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import portrait7 from "@src/assets/images/portrait/small/avatar-s-8.jpg";
import portrait1 from "@src/assets/images/portrait/small/avatar-s-9.jpg";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
	addDocumentFirebase,
	arrayUnionFirebase,
	setDocumentFirebase,
} from "../../../../sevices/FirebaseApi";

const MySwal = withReactContent(Swal);

const options = [
	{ value: "Donna Frank", label: "Donna Frank", avatar: avatar1 },
	{ value: "Jane Foster", label: "Jane Foster", avatar: avatar2 },
	{
		value: "Gabrielle Robertson",
		label: "Gabrielle Robertson",
		avatar: avatar3,
	},
	{ value: "Lori Spears", label: "Lori Spears", avatar: avatar4 },
	{ value: "Sandy Vega", label: "Sandy Vega", avatar: avatar5 },
	{ value: "Cheryl May", label: "Cheryl May", avatar: avatar6 },
];

const data = [
	{
		img: portrait1,
		type: "Can Edit",
		name: "Lester Palmer",
		username: "pe@vogeiz.net",
	},
	{
		img: portrait2,
		type: "Owner",
		name: "Mittie Blair",
		username: "peromak@zukedohik.gov",
	},
	{
		img: portrait3,
		type: "Can Comment",
		name: "Marvin Wheeler",
		username: "rumet@jujpejah.net",
	},
	{
		img: portrait4,
		type: "Can View",
		name: "Nannie Ford",
		username: "negza@nuv.io",
	},
	{
		img: portrait5,
		type: "Can Edit",
		name: "Julian Murphy",
		username: "lunebame@umdomgu.net",
	},
	{
		img: portrait6,
		type: "Can View",
		name: "Sophie Gilbert",
		username: "ha@sugit.gov",
	},
	{
		img: portrait7,
		type: "Can Comment",
		name: "Chris Watkins",
		username: "zokap@mak.org",
	},
	{
		img: portrait8,
		type: "Can Edit",
		name: "Adelaide Nichols",
		username: "ujinomu@jigo.com",
	},
];

const OptionComponent = ({ data, ...props }) => {
	return (
		<components.Option {...props}>
			<div className="d-flex flex-wrap align-items-center">
				{data.avatar !== null ? (
					<Avatar
						className="me-75"
						img={data.avatar}
						imgHeight={38}
						imgWidth={38}
					/>
				) : (
					<Avatar
						className="me-75"
						content={data.label}
						color="light-primary"
						imgHeight={38}
						imgWidth={38}
						initials
					/>
				)}
				<div>{data.label}</div>
			</div>
		</components.Option>
	);
};

const GroupMembers = ({ group_id, fetchDataGroup, members }) => {
	const [show, setShow] = useState(false);
	const [dataUser, setDataUser] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);

	console.log(group_id, "datauser");

	// Fetch data
	const fetchDataUser = async () => {
		const res = await Api.get("/hris/employee?no_paginate=true");
		let arr = [];
		if (res) {
			res.forEach((element) => {
				arr.push({
					value: element.id,
					label: element.name,
					avatar: element.avatar,
				});
			});
		}

		setDataUser(arr);
	};

	// Handle
	const handleConfirmText = () => {
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
				MySwal.fire({
					icon: "success",
					title: "Deleted!",
					text: "Your file has been deleted.",
					customClass: {
						confirmButton: "btn btn-success",
					},
				});
			}
		});
	};

	const handleChangeOption = (selectedOption) => {
		setSelectedOption(selectedOption);
	};

	const handleSubmitUser = async () => {
		try {
			selectedOption.forEach(async (option) => {
				try {
					setDocumentFirebase(
						`groups/${group_id}/group_members`,
						option.value,
						option
					).then((res) => {
						if (res) {
							arrayUnionFirebase(
								"groups",
								group_id,
								"group_members",
								option.value
							).then((addGroupMember) => {
								if (addGroupMember) {
									toast.success(
										`Member ${option.value} has been added to the group`,
										{
											position: "top-center",
										}
									);
								} else {
									toast.error(
										`Error adding member ${option.value}`,
										{
											position: "top-center",
										}
									);
								}
							});
						}
					});
				} catch (error) {
					throw error;
				}
			});

			setShow(false);
			setSelectedOption([]);
			fetchDataGroup();
		} catch (error) {
			throw error;
		}
	};

	const handleDiscard = () => {
		setShow(false);
		setSelectedOption(null);
	};

	useEffect(() => {
		fetchDataUser();
	}, []);

	return (
		<Fragment>
			<Button
				color="primary"
				className="btn-icon me-1"
				onClick={() => setShow(true)}
			>
				<UserPlus size={14} />
			</Button>

			<Modal
				isOpen={show}
				toggle={() => handleDiscard()}
				className="modal-dialog-centered modal-lg"
			>
				<ModalHeader
					className="bg-transparent"
					toggle={() => handleDiscard()}
				></ModalHeader>
				<ModalBody className="px-sm-5 mx-50 pb-4">
					<h1 className="text-center mb-1">Group Members</h1>
					<p className="text-center">
						Share project with a team members
					</p>
					<Label
						for="addMemberSelect"
						className="form-label fw-bolder font-size font-small-4 mb-50"
					>
						Add Members
					</Label>
					<Select
						options={
							members?.length > 0
								? dataUser.filter(
										(x) =>
											!members.some(
												(m) =>
													m.value ===
													x.value
											)
								  )
								: dataUser
						}
						isClearable={false}
						isMulti
						id="addMemberSelect"
						theme={selectThemeColors}
						className="react-select"
						classNamePrefix="select"
						components={{
							Option: OptionComponent,
						}}
						value={selectedOption}
						onChange={handleChangeOption}
					/>
					<p className="fw-bolder pt-50 mt-2">
						{members?.length > 0
							? `${members.length} Members`
							: "0 Member"}
					</p>
					<ListGroup flush className="mb-2">
						{members?.map((item, index) => {
							return (
								<ListGroupItem
									key={index}
									className="d-flex align-items-start border-0 px-0"
								>
									{item.avatar ? (
										<Avatar
											className="me-75"
											img={item.avatar}
											imgHeight={38}
											imgWidth={38}
										/>
									) : (
										<Avatar
											content={item.label}
											initials
											className="me-75"
											imgHeight={38}
											imgWidth={38}
										/>
									)}

									<div className="d-flex align-items-center justify-content-between w-100">
										<div className="me-1">
											<h5 className="mb-25">
												{item.label}
											</h5>
											{/* <span>{item.email}</span> */}
										</div>
										<Button.Ripple
											className={"btn-icon"}
											color={"danger"}
											onClick={() =>
												handleConfirmText()
											}
										>
											<Trash size={15} />
										</Button.Ripple>
									</div>
								</ListGroupItem>
							);
						})}
					</ListGroup>
					<Col xs={12} className="text-center mt-2 pt-50">
						<Button
							type="submit"
							className="me-1"
							color="primary"
							onClick={() => handleSubmitUser()}
						>
							Submit
						</Button>
						<Button
							type="reset"
							color="secondary"
							outline
							onClick={() => handleDiscard()}
						>
							Discard
						</Button>
					</Col>
					{/* <div className="d-flex align-content-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center me-2">
              <Users className="font-medium-2 me-50" />
              <p className="fw-bolder mb-0">Public to Vuexy - Pixinvent</p>
            </div>
            <a
              className="fw-bolder"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <Link className="font-medium-2 me-50" />
              <span>Copy project link</span>
            </a>
          </div> */}
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default GroupMembers;
