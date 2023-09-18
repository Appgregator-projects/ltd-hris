// ** React Imports
import { Fragment, useState } from "react";

// ** Third Party Components
import { Trash } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const DeleteButton = ({ type }) => {
	const MySwal = withReactContent(Swal);
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

	return (
		<Fragment>
			<div className=" me-1" onClick={() => handleConfirmText()}>
				{type === "answer" ? (
					<Trash
						size={isHovered ? 18 : 15}
						style={isHovered ? iconHoverStyle : iconStyle}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					/>
				) : (
					<Trash size={20} />
				)}
			</div>
		</Fragment>
	);
};

export default DeleteButton;
