// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Input,
	Label,
	ListGroupItem,
	Row,
} from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";

import { Edit, List, Plus, Save, X } from "react-feather";
import SectionAccordion from "../sectionAccordion";
import { useParams } from "react-router-dom";

import data from "../../course.json";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";
import { FaSort } from "react-icons/fa";

const CourseSyllabusTab = ({courseData, setCourseData}) => {

	let sectionListData = [...courseData.course_section];
	const [sectionList, setSectionList] = useState([...sectionListData]);
	const [isAddSection, setIsAddSection] = useState(false);
	const [newSection, setNewSection] = useState({
		section_title: "",
		section_description: "",
	});

	// ** handle
	const handleAddSection = (type) => {
		if (type === "add") {
			setIsAddSection(true);
		} else if (type === "cancel") {
			setIsAddSection(false);
			setNewSection({
				section_title: "",
				section_description: "",
			});
		} else if (type === "submit") {
			setIsAddSection(false);
			setNewSection({
				section_title: "",
				section_description: "",
			});
		}
	};

	const handleSectionIndex = (data) => {
		setSectionList([...data]);
	};

	useEffect(() => {
		return () => {};
	}, [sectionList]);

	console.log(
		"🚀 ~ file: index.js:54 ~ CourseDetailPage ~ sectionList:",
		sectionList
	);
	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Course Syllabus</h3>
				</Col>

				{/* <Col className="d-flex justify-content-end">
                <Button.Ripple className="btn-icon" color={"primary"} outline>
                  <Settings size={14} />
                </Button.Ripple>
              </Col> */}
			</Row>

			<Row id="dd-with-handle" className="pl-1">
				<Col>
					<ReactSortable
						tag="ul"
						className="list-group"
						handle=".handle"
						list={sectionList}
						setList={(e) => handleSectionIndex(e)}
					>
						{sectionList?.map((item, index) => {
							return (
								<ListGroupItem
									key={index}
									className="ml-1 p-0 border-0 mb-1"
								>
									<Card
										className="mb-0 w-full"
										key={item.id}
									>
										<SectionAccordion
											data={item}
											sectionList={sectionList}
											course={courseData}
											setSectionList={
												setSectionList
											}
										/>
									</Card>
								</ListGroupItem>
							);
						})}
					</ReactSortable>
				</Col>
			</Row>

			{isAddSection && (
				<Card className="mb-1">
					<CardHeader>
						<h4 className="mb-0">Add New Section</h4>

						<Button.Ripple
							color={"danger"}
							className="btn-icon"
							onClick={() => handleAddSection("cancel")}
						>
							<X size={14} />
						</Button.Ripple>
					</CardHeader>

					<CardBody>
						<Row>
							<Form>
								<Label>Section Title</Label>
								<Input type={"text"} />
							</Form>
						</Row>

						<Row className="mt-1">
							<Form>
								<Label>Section Description</Label>
								<Input type={"textarea"} />
							</Form>
						</Row>

						<Button.Ripple
							color={"success"}
							className={"mt-2"}
							onClick={() => handleAddSection("submit")}
							block
						>
							<Save size={14} />
							<span className="align-middle ms-25">
								Submit
							</span>
						</Button.Ripple>
					</CardBody>
				</Card>
			)}

			{!isAddSection && (
				<Button.Ripple
					color={"primary"}
					className="me-1 mt-2"
					block
					onClick={() => handleAddSection("add")}
				>
					<Plus size={14} />
					<span className="align-middle ms-25">Section</span>
				</Button.Ripple>
			)}
		</Fragment>
	);
};

export default CourseSyllabusTab;
