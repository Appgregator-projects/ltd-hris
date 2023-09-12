// ** Reactstrap Imports
import { Play } from "react-feather";
import {
	Accordion,
	AccordionBody,
	AccordionItem,
	Col,
	Label,
	Row,
} from "reactstrap";

// ** Third Party Components
import Prism from "prismjs";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import EditLesson from "./EditLesson";
import AddQuiz from "./AddQuiz";

import DeleteButton from "../DeleteButton";

const LessonAccordion = ({
	lesson,
	section,
	sectionList,
	lessonList,
	setSectionList,
	lessonIndex,
	course,
}) => {
	
	const [open, setOpen] = useState("0");

	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	

	useEffect(() => {
		Prism.highlightAll();
	}, []);
	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1 ms-1">
						<h6>
							<Play size={22} className="me-1 handle" />
							{lesson.lesson_title}
						</h6>
					</Col>

					<Col className="d-flex justify-content-end">
						<DeleteButton type='lesson' />

						<AddQuiz
							lesson={lesson}
							section={section}
							course={course}
						/>
						<EditLesson
							lesson={lesson}
							section={section}
							lessonList={lessonList}
							setSectionList={setSectionList}
							sectionList={sectionList}
							lessonIndex={lessonIndex}
						/>

						<div className="p-1">
							{open === "1" ? (
								<RiArrowUpSLine
									size={20}
									onClick={() => toggle("1")}
								/>
							) : (
								<RiArrowDownSLine
									size={20}
									onClick={() => toggle("1")}
								/>
							)}
						</div>
					</Col>
				</Row>

				<AccordionBody accordionId="1">
					<Row>
						<Col md={4} xs={12} className="me-2">
							<iframe
								// width="300"
								// height="180"
								src={`https://www.youtube-nocookie.com/embed/${lesson.lesson_video}`}
								title="YouTube video player"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							></iframe>
						</Col>
						<Col md={7} xs={12}>
							<Row>
								<Label>Description</Label>
								<p>{lesson.lesson_description}</p>
							</Row>
						</Col>
					</Row>
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default LessonAccordion;
