// ** React Imports
import { Fragment, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
	Button,
	Form,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";

// ** Third Party Components
import { Link, Edit, Trash, Users, Save } from "react-feather";
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
import { toast } from "react-hot-toast";
import { setDocumentFirebase } from "../../../../../../sevices/FirebaseApi";
import { useParams } from "react-router-dom";

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
				<Avatar className="my-0 me-1" size="sm" img={data.avatar} />
				<div>{data.label}</div>
			</div>
		</components.Option>
	);
};

const ManageSection = ({
	Api,
	section,
	setSectionList,
	sectionList,
	fetchDataSection,
}) => {

	const [show, setShow] = useState(false);
	const [newDataSection, setNewDataSection] = useState({ ...section });
	const param = useParams();

	const handleSubmitSection = async () => {
		const findIndex = sectionList.findIndex((x) => x.id === section.id);
		sectionList[findIndex] = newDataSection;

		const newData = {
			section_index: section.id,
			section_title: newDataSection.section_title,
			section_description: newDataSection.section_description,
		};

		const updateSection = await setDocumentFirebase(
			`courses/${param.id}/course_section`,
			section.id,
			newData
		);

		if (updateSection) {
			toast.success(`Section has updated`, {
				position: "top-center",
			});
			setShow(false);
			fetchDataSection()
			// setNewDataSection({ ...section });
		} else {
			return toast.error(`Error : ${updateSection}`, {
				position: "top-center",
			});
		}
	};

	return (
		<Fragment>
			<div className="py-1" onClick={() => setShow(true)}>
				<Edit size={20} />
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
				<ModalBody className="px-sm-5 mx-50 pb-4">
					<h1 className="text-center mb-1">Edit Section</h1>
					<p className="text-center">Update section project</p>
					<Row>
						<Form>
							<Label>Section Title</Label>
							<Input
								type={"text"}
								defaultValue={section.section_title}
								onChange={(e) =>
									setNewDataSection({
										...newDataSection,
										section_title: e.target.value,
									})
								}
							/>
						</Form>
					</Row>

					<Row className="mt-1">
						<Form>
							<Label>Section Description</Label>
							<Input
								type={"textarea"}
								defaultValue={
									section.section_description
								}
								onChange={(e) =>
									setNewDataSection({
										...newDataSection,
										section_description:
											e.target.value,
									})
								}
							/>
						</Form>
					</Row>

					<Button.Ripple
						color={"success"}
						className={"mt-2"}
						onClick={() => handleSubmitSection()}
						block
					>
						<Save size={14} />
						<span className="align-middle ms-25">Submit</span>
					</Button.Ripple>
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default ManageSection;
