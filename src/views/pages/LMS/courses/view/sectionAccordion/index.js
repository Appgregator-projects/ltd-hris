import { useEffect, useState } from "react";
// ** Reactstrap Imports
import {
	Accordion,
	AccordionBody,
	AccordionItem,
	Col,
	ListGroupItem,
	Row,
} from "reactstrap";
import LessonAccordion from "../lessonAccordion";

// ** Third Party Components
import Prism from "prismjs";
import { ReactSortable } from "react-sortablejs";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { List } from "react-feather";

import AddLesson from "./AddLesson";
import DeleteButton from "../DeleteButton";
import ManageSection from "./ManageSection";

const SectionAccordion = ({
	data,
	setSectionList,
	sectionList,
	course,
	getCourseDetail,
	Api,
	image,
	fetchDataSection,
}) => {
	const [lessonList, setLessonList] = useState([]);
	console.log(lessonList, "lessonList");
	const [open, setOpen] = useState("1");
	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	useEffect(() => {
		if (data?.lesson_list) {
			setLessonList([...data.lesson_list]);
		}
		Prism.highlightAll();
	}, [data?.lesson_list]);
	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1">
						<h5>
							<List
								size={25}
								className="me-1 ms-1 handle"
							/>
							{data?.section_title}
						</h5>
					</Col>

					<Col className="d-flex justify-content-end">
						<DeleteButton
							Api={Api}
							type={"section"}
							id={data?.section_index}
							section={data}
							fetchDataSection={fetchDataSection}
						/>
						<AddLesson
							section={data}
							fetchDataSection={fetchDataSection}
							setLessonList={setLessonList}
							lessonList={lessonList}
							setSectionList={setSectionList}
							sectionList={sectionList}
						/>

						<ManageSection
							Api={Api}
							section={data}
							setSectionList={setSectionList}
							sectionList={sectionList}
							fetchDataSection={fetchDataSection}
						/>

						<div className="p-1">
							{open === "1" ? (
								<RiArrowUpSLine
									size={24}
									onClick={() => toggle("1")}
								/>
							) : (
								<RiArrowDownSLine
									size={24}
									onClick={() => toggle("1")}
								/>
							)}
						</div>
					</Col>
				</Row>

				<AccordionBody accordionId="1">
					{lessonList && (
						<ReactSortable
							tag="ul"
							className="list-group sortable"
							group="shared-handle-group"
							handle=".handle"
							list={lessonList}
							setList={setLessonList}
						>
							{lessonList?.map((item, index) => {
								return (
									<ListGroupItem
										key={index}
										className="p-0 border-0"
									>
										<LessonAccordion
											image={image}
											lesson={item}
											course={course}
											section={data}
											setLessonList={
												setLessonList
											}
											lessonList={lessonList}
											setSectionList={
												setSectionList
											}
											fetchDataSection={
												fetchDataSection
											}
											lessonIndex={index}
											sectionList={sectionList}
											getCourseDetail={
												getCourseDetail
											}
										/>
									</ListGroupItem>
								);
							})}
						</ReactSortable>
					)}
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default SectionAccordion;
