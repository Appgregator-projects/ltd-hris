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

// ** Third Party Components
import Prism from "prismjs";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { List} from "react-feather";
import AnswerAccordion from "../answerAccordion";

// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";


const QuizAccordion = ({
	data,

}) => {
	const [answerList, setAnswerList] = useState([]);
	const [open, setOpen] = useState("1");


	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	useEffect(() => {
		Prism.highlightAll();
		if (data?.answer) {
			setAnswerList([...data.answer]);
		}

		return () => {
			setAnswerList([]);
		};
	}, [data?.answer]);

	return (
		<Accordion open={open} toggle={toggle}>
			<AccordionItem>
				<Row>
					<Col className="pt-1">
						{data?.question_img && (
							<img
								src={data?.question_img}
								className="p-2"
								style={{
									width: "100%",
									height: "270px",
									objectFit: "contain",
								}}
							/>
						)}
						<h5>
							<List
								size={25}
								className="me-1 ms-1 handle"
							/>

							{data.question_title}
						</h5>
						<div className="user-info mt-2 ps-5">
							<p>{data.question_description}</p>
						</div>
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
					{answerList?.map((item, index) => {
						return (
							<ListGroupItem
								key={index}
								className="p-0 border-0"
							>
								<AnswerAccordion
									answer={item}
								/>
							</ListGroupItem>
						);
					})}
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default QuizAccordion;
