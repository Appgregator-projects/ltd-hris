// ** Reactstrap Imports
import { File, Play, Search } from "react-feather";
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
	image,
	getCourseDetail,
	fetchDataSection
}) => {
	const [open, setOpen] = useState("0");
	const [isHovered, setIsHovered] = useState(null);

	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	const cardHoverStyle = {
		backgroundColor: "#F8F8F8", // Set the desired background color on hover
		cursor: "pointer", // Optional: Change the cursor to a pointer on hover
		boxShadow: "none",
	};

	const cardStyle = {
		backgroundColor: "#FFFFFF", // Set the desired background color on hover
	};

	useEffect(() => {
		Prism.highlightAll();
	}, []);
	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1 ms-1 d-flex" lg={9} md={5}>
						<Play size={22} className="me-1 handle" />
						<h6>
							{lesson.lesson_title}
						</h6>
					</Col>

					<Col className="d-flex justify-content-end">
						<DeleteButton
							type="lesson"
							lesson={lesson}
							section={section}
							getCourseDetail={getCourseDetail}
							fetchDataSection={fetchDataSection}
						/>

						<AddQuiz
							lesson={lesson}
							section={section}
							course={course}
							image={image}
						/>
						<EditLesson
							lesson={lesson}
							section={section}
							lessonList={lessonList}
							setSectionList={setSectionList}
							sectionList={sectionList}
							lessonIndex={lessonIndex}
							fetchDataSection={fetchDataSection}
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
					<Row className="d-flex">
						<Col md={5} xs={12} className="me-2" >
							{typeof lesson.lesson_video === 'string' ?
								<iframe
									// width="300"
									// height="180"
									src={`https://www.youtube-nocookie.com/embed/${lesson.lesson_video}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
								></iframe>
								: <Col className="d-flex flex-wrap">{lesson.lesson_video?.map((item, index) => (
									<div className="d-flex justify-content-center me-1 mt-1">

										<a href={item.url} target="_blank" key={index} onMouseEnter={() => setIsHovered(index)}
											onMouseLeave={() => setIsHovered(null)} style={isHovered === index ? cardHoverStyle : cardStyle}>
											<div className=" d-flex position-relative p-1">
												<File size={50} className="text-end" />
												{isHovered === index ?
													<Search className="position-absolute top-0 end-0" size={15} />
													: <></>}

											</div>
										</a>
									</div>

								))}
								</Col>
							}
						</Col>
						<Col md={6} xs={12}>

							<Label>Description</Label>
							<p>{lesson.lesson_description}</p>

						</Col>
					</Row>
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default LessonAccordion;
