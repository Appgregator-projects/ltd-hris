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

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { List } from "react-feather";
import { getLessons } from "../../../../LMS/store/courses";

const SectionAccordion = ({ data, dispatch, logActivity }) => {
	const [lessonList, setLessonList] = useState([]);
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
			dispatch(getLessons([...data.lesson_list]));
		}
		Prism.highlightAll();
	}, [data?.lesson_list]);

	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1 d-flex" lg={9} >

						<List
							size={25}
							className="me-1 ms-1 handle"
						/>
						<h5 className="text-wrap">
							{data?.section_title}
						</h5>
					</Col>


					<Col className="d-flex justify-content-end">
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
					{lessonList &&
						lessonList?.map((item, index) => {
							return (
								<ListGroupItem
									key={index}
									className="p-0 border-0"
								>
									<LessonAccordion
										lesson={item}
										section={data}
										logActivity={logActivity}
									/>
								</ListGroupItem>
							);
						})}
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default SectionAccordion;
