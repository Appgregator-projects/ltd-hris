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
	Spinner,
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

//** Api
import Api from "../../../../../../sevices/Api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
	addDocumentFirebase,
	arrayUnionFirebase,
	getCollectionFirebase,
} from "../../../../../../sevices/FirebaseApi";
import ButtonSpinner from "../../../../components/ButtonSpinner";

const CourseSyllabusTab = ({ courseData, setCourseData, getCourseDetail }) => {
	const param = useParams();
	// let sectionListData = [...courseData?.course_section];
	// console.log(sectionListData, "sasa");

	const [sectionList, setSectionList] = useState([]);
	const [isAddSection, setIsAddSection] = useState(false);
	const [newSection, setNewSection] = useState({
		section_title: "",
		section_description: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const store = useSelector((state) => state.coursesSlice);

	//** Fetch data
	const fetchDataSection = async () => {
		const res = await getCollectionFirebase(
			`courses/${param.id}/course_section`
		);
		setSectionList(res);
	};

	// ** handle
	const handleAddSection = async (type) => {
		if (type === "add") {
			setIsAddSection(true);
		} else if (type === "cancel") {
			setIsAddSection(false);
			setNewSection({
				section_title: "",
				section_description: "",
			});
		} else if (type === "submit") {
			try {
				setIsLoading(true);
				let newData = {
					// course_id: courseData.id,
					section_title: newSection?.section_title,
					section_description: newSection?.section_description,
				};

				if (courseData?.course_section) {
					newData.section_index =
						parseInt(courseData?.course_section.length) + 1;
				} else {
					newData.section_index = 1;
				}

				addDocumentFirebase(
					`courses/${param.id}/course_section`,
					newData
				).then((submitDoc) => {
					arrayUnionFirebase(
						"courses",
						param.id,
						"course_section",
						submitDoc
					).then((arraySubmit) => {
						if (arraySubmit) {
							setIsLoading(false);
							toast.success(`Section has created`, {
								position: "top-center",
							});
							setIsAddSection(false);
							setNewSection({
								section_title: "",
								section_description: "",
							});
							fetchDataSection();
						} else {
							setIsLoading(false);
							return toast.error(
								`Error : ${arraySubmit}`,
								{
									position: "top-center",
								}
							);
						}
					});
				});
			} catch (error) {
				throw error;
			}
		}
	};

	const handleSectionIndex = (data) => {
		setSectionList([...data]);
	};

	useEffect(() => {
		fetchDataSection();
		return () => {
			setSectionList();
		};
	}, []);

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
					{sectionList && (
						<ReactSortable
							// tag="ul"
							// className="list-group"
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
											key={index}
										>
											<SectionAccordion
												image={
													store?.image[0]
												}
												Api={Api}
												data={item}
												sectionList={
													sectionList
												}
												course={courseData}
												setSectionList={
													setSectionList
												}
												fetchDataSection={
													fetchDataSection
												}
												getCourseDetail={
													getCourseDetail
												}
											/>
										</Card>
									</ListGroupItem>
								);
							})}
						</ReactSortable>
					)}
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
								<Input
									type={"text"}
									onChange={(e) =>
										setNewSection({
											...newSection,
											section_title:
												e.target.value,
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
									onChange={(e) =>
										setNewSection({
											...newSection,
											section_description:
												e.target.value,
										})
									}
								/>
							</Form>
						</Row>
						{!isLoading ? (
							<Button.Ripple
								color={"success"}
								className={"mt-2"}
								onClick={() =>
									handleAddSection("submit")
								}
								block
							>
								<Save size={14} />
								<span className="align-middle ms-25">
									Submit
								</span>
							</Button.Ripple>
						) : (
							<Button className={"mt-2"} block>
								<Spinner size={"sm"} type="grow" />
								<span className="align-middle ms-25">
									Loading...
								</span>
							</Button>
						)}
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
