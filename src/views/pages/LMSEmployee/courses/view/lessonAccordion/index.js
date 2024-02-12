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
import { useNavigate, useParams } from "react-router-dom";
import { arrayUnionFirebase } from "../../../../../../sevices/FirebaseApi";
import { auth } from "../../../../../../configs/firebase";

const LessonAccordion = ({ lesson, section, logActivity }) => {
	console.log(logActivity, 'logs')
	const [open, setOpen] = useState("0");
	const [isHovered, setIsHovered] = useState(null);
	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};
	const param = useParams();
	const navigate = useNavigate();

	const handleLogActivity = async () => {
		if (logActivity) {
			const findActivity = await logActivity?.history?.findIndex(
				(x) => x.lesson_title === lesson.lesson_title
			);

			if (findActivity === -1) {
				try {
					const res = await arrayUnionFirebase(
						"user_course_progress",
						`${auth.currentUser.uid}-${param.id}`,
						"history",
						{
							lastUpdated: new Date(),
							lesson_title: decodeURIComponent(
								lesson.lesson_title
							),
							section_title: section.section_title,
							section_id: section.id,
						}
					);
					if (res) {
						navigate(
							`/course/${param.id}/section/${section.id
							}/lesson/${encodeURIComponent(
								lesson.lesson_title
							)}`
						);
					}
				} catch (error) {
					throw error;
				}
			} else {
				navigate(
					`/course/${param.id}/section/${section.id
					}/lesson/${encodeURIComponent(lesson.lesson_title)}`
				);
			}
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
					<Col className="pt-1 ms-1 d-flex">
						<Play size={22} className="me-1 handle" />
						<h6
							onClick={() => handleLogActivity()}
							style={{ cursor: "pointer" }}
						>
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
						<Col md={5} xs={12} className="me-2">
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
