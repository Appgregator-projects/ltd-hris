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
import { useNavigate, useParams } from "react-router-dom";

const LessonAccordion = ({
	lesson,
	section
}) => {
	const [open, setOpen] = useState("0");

	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};
	const param = useParams()
	const navigate = useNavigate()
	useEffect(() => {
		Prism.highlightAll();
	}, []);
	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1 ms-1 d-flex">
							<Play size={22} className="me-1 handle" />
						<h6 onClick={()=>navigate(`/course/${param.id}/section/${section.id}/lesson/${lesson.lesson_title}`)} style={{'cursor':'pointer'}}>
							{lesson.lesson_title}
						</h6>
					</Col>

					<Col className="d-flex justify-content-end">
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
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
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
