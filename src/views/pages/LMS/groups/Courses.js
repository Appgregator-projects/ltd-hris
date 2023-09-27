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
	UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Book, Link, Trash, Users } from "react-feather";
import Select, { components } from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

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

const MySwal = withReactContent(Swal);

import courses from "../courses/course.json";
import {
	arrayRemoveFirebase,
	arrayUnionFirebase,
	deleteDocumentFirebase,
	getCollectionFirebase,
	setDocumentFirebase,
} from "../../../../sevices/FirebaseApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const options = [
	{
		value: "Introduction to Web Development",
		label: "Introduction to Web Development",
		avatar: "https://i.ytimg.com/vi/w__n0BvkqB4/maxresdefault.jpg",
	},
	{
		value: "Python for Beginners",
		label: "Python for Beginners",
		avatar: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F549550559%2F1234433154323%2F1%2Foriginal.20230706-115709?w=1000&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=84e3c74c34b060e7d28ccef3f6a5a6ec",
	},
	{
		value: "React.js Crash Course",
		label: "React.js Crash Course",
		avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqrgfrwbac7118tMFPTg1nNkY6-kCMuS9Ojg&usqp=CAU",
	},
	{
		value: "Machine Learning Basics",
		label: "Machine Learning Basics",
		avatar: "https://i.ytimg.com/vi/hjh1ikznScg/maxresdefault.jpg",
	},
];

const data = [
	{
		value: "Introduction to Web Development",
		name: "Introduction to Web Development",
		img: "https://i.ytimg.com/vi/w__n0BvkqB4/maxresdefault.jpg",
	},
	{
		value: "Python for Beginners",
		name: "Python for Beginners",
		img: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F549550559%2F1234433154323%2F1%2Foriginal.20230706-115709?w=1000&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=84e3c74c34b060e7d28ccef3f6a5a6ec",
	},
];

const OptionComponent = ({ data, ...props }) => {
	return (
		<components.Option {...props}>
			<div className="d-flex flex-wrap align-items-center">
				<Avatar className="my-0 me-1" size="sm" img={data.avatar} />
				<div>{data.label}</div>
			</div>
		</components.Option>
	);
};

const GroupCourses = ({ group_id, courses, fetchDataGroup }) => {
	const [show, setShow] = useState(false);
	const [dataCourse, setDataCourse] = useState([]);
	const [selectedOption, setSelectedOption] = useState([]);

	const fetchDataCourse = async () => {
		const res = await getCollectionFirebase("courses");
		let arr = [];
		if (res) {
			res.forEach((element) => {
				arr.push({
					value: element.id,
					label: element.course_title,
					avatar: element.course_thumbnail,
				});
			});
		}
		setDataCourse(arr);
	};

	const handleChangeOption = (selectedOption) => {
		setSelectedOption(selectedOption);
	};

	const handleConfirmText = (item) => {
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
					arrayRemoveFirebase(
						"groups",
						group_id,
						"group_courses",
						item.id
					).then((res) => {
						if (res) {
							deleteDocumentFirebase(
								`groups/${group_id}/group_courses`,
								item.id
							).then((response) => {
								if (response) {
									fetchDataGroup();
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
					});
				} catch (error) {
					throw error;
				}
			}
		});
	};

	const handleSubmitCourseToGroup = async () => {
		try {
			selectedOption.forEach(async (option) => {
				try {
					setDocumentFirebase(
						`groups/${group_id}/group_courses`,
						option.value,
						option
					).then((res) => {
						if (res) {
							arrayUnionFirebase(
								"groups",
								group_id,
								"group_courses",
								option.value
							).then((addCourse) => {
								if (addCourse) {
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
		fetchDataCourse();
		return () => {
			setDataCourse([]);
		};
	}, []);

	return (
		<Fragment>
			<Button
				color="primary"
				className="btn-icon me-1"
				onClick={() => setShow(true)}
				id="add-course"
			>
				<Book size={14} />
			</Button>
			<UncontrolledTooltip placement="top" target="add-course">
				Add Course
			</UncontrolledTooltip>

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
					<h1 className="text-center mb-1">Group Courses</h1>
					<p className="text-center">
						Add courses in projct team
					</p>
					<Label
						for="addMemberSelect"
						className="form-label fw-bolder font-size font-small-4 mb-50"
					>
						Add Course
					</Label>
					<Select
						options={
							courses?.length > 0
								? dataCourse.filter(
										(x) =>
											!courses.some(
												(y) =>
													y.value ===
													x.value
											)
								  )
								: dataCourse
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
						onChange={handleChangeOption}
					/>
					<p className="fw-bolder pt-50 mt-2">
						{courses?.length > 0
							? `${courses.length} Courses`
							: "0 Course"}
					</p>
					<ListGroup flush className="mb-2">
						{courses?.map((item) => {
							return (
								<ListGroupItem
									key={item.name}
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
											{/* <span>
												{item.value}
											</span> */}
										</div>

										<Button.Ripple
											className={"btn-icon"}
											color={"danger"}
											onClick={() =>
												handleConfirmText(
													item
												)
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
							onClick={() => handleSubmitCourseToGroup()}
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
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default GroupCourses;
