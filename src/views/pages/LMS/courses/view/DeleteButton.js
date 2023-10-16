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
import { Trash } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import {
	arrayRemoveFirebase,
	deleteDocumentFirebase,
	deleteFileFirebase,
} from "../../../../../sevices/FirebaseApi";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../../../configs/firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

const DeleteButton = ({
	type,
	item,
	fetchDataSection,
	lesson,
	section,
}) => {
	const param = useParams();
	const MySwal = withReactContent(Swal);
	const navigate = useNavigate()
	const [isHovered, setIsHovered] = useState(false);

	const iconHoverStyle = {
		cursor: "pointer",
	};

	const iconStyle = {
		backgroundColor: "#FFFFFF",
	};

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
				if (type === "section") {
					try {
						arrayRemoveFirebase(
							"courses",
							param.id,
							"course_section",
							section.id
						).then((res) => {
							if (res) {
								deleteDocumentFirebase(
									`courses/${param.id}/course_section`,
									section.id
								).then((response) => {
									if (response) {
										MySwal.fire({
											icon: "success",
											title: "Deleted!",
											text: "Your file has been deleted.",
											customClass: {
												confirmButton:
													"btn btn-success",
											},
										});
										fetchDataSection();
									} else {
										return toast.error(
											`Error : ${response}`,
											{
												position:
													"top-center",
											}
										);
									}
								});
							}
						});
					} catch (error) {
						throw error;
					}
				} else if (type === "lesson") {
					try {
						arrayRemoveFirebase(
							`courses/${param.id}/course_section`,
							section.id,
							"lesson_list",
							lesson
						).then((deleteSection) => {
							if (deleteSection) {
								MySwal.fire({
									icon: "success",
									title: "Deleted!",
									text: "Your file has been deleted.",
									customClass: {
										confirmButton:
											"btn btn-success",
									},
								});
								fetchDataSection();
							} else {
								return toast.error(
									`Error : ${deleteSection}`,
									{
										position: "top-center",
									}
								);
							}
						});
					} catch (error) {
						throw error;
					}
				} else if (type === "course") {
					if (item?.course_thumbnail) {
						const split = item.course_thumbnail.split("%2F");
						const finalSplit = split[1].split("?");
						const finalString = decodeURIComponent(
							finalSplit[0]
						);

						try {
							deleteFileFirebase(finalString, "courses");
						} catch (error) {
							throw error;
						}
					}

					deleteDocumentFirebase("courses", param.id).then(
						(deleteCourse) => {
							if (deleteCourse) {
								MySwal.fire({
									icon: "success",
									title: "Deleted!",
									text: "Your file has been deleted.",
									customClass: {
										confirmButton:
											"btn btn-success",
									},
								});
								navigate('/courses')
							}
						}
					);
				}
			}
		});
	};

	return (
		<Fragment>
			<div className="py-1 me-1" onClick={() => handleConfirmText()}>
				{type === "lesson" ? (
					<Trash
						size={isHovered ? 18 : 15}
						style={isHovered ? iconHoverStyle : iconStyle}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						id={`delete-lesson`}
					/>
				) : type === "course" ? (
					<Button.Ripple
						className="btn-icon"
						color={"danger"}
						id={"delete-course"}
					>
						<Trash size={14} />
					</Button.Ripple>
				) : (
					<Trash size={21} id={`delete-section`} />
				)}
				<UncontrolledTooltip
					placement="top"
					target={`delete-${type}`}
					style={{ textTransform: "capitalize" }}
				>
					Delete {type}
				</UncontrolledTooltip>
			</div>
		</Fragment>
	);
};

export default DeleteButton;
