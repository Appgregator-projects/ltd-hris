// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Button,
	ButtonGroup,
	Card,
	Col,
	Row,
	TabContent,
	TabPane,
	UncontrolledTooltip,
} from "reactstrap";

// ** Images
import AvatarGroup from "@components/avatar-group";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import { Badge, Table } from "reactstrap";

// ** Third Party Components
import { Eye, List, Square } from "react-feather";

import CourseCard from "./CourseCard";

import {
	getCollectionFirebase,
	getCollectionWhereFirebase,
	getSingleDocumentFirebase,
} from "../../../../sevices/FirebaseApi";

const avatarGroupData2 = [
	{
		title: "Diana",
		img: avatar1,
		imgHeight: 26,
		imgWidth: 26,
	},
	{
		title: "Rey",
		img: avatar2,
		imgHeight: 26,
		imgWidth: 26,
	},
	{
		title: "James",
		img: avatar3,
		imgHeight: 26,
		imgWidth: 26,
	},
];

const CoursesPage = () => {
	const navigate = useNavigate();

	//** Initial State
	const [active, setActive] = useState("1");
	const [dataCourse, setDataCourse] = useState([]);
	const userData = localStorage.getItem("userData");
	const uid = JSON.parse(userData).id;

	//** Fetch Data
	const fetchDataCourse = async () => {
		try {
			const group = await getCollectionFirebase("groups", [
				{
					field: "group_members",
					operator: "array-contains",
					value: uid,
				},
			]);

			const coursesData = await Promise.all(
				group.map(async (e) => {
					if (e.group_courses) {
						return await Promise.all(
							e.group_courses.map(async (element) => {
								const courseData =
									await getSingleDocumentFirebase(
										`courses`,
										element
									);
								return { ...courseData, id: element };
							})
						);
					}
					return;
				})
			);

			const courses = coursesData.flat();
			setDataCourse(courses);
		} catch (error) {
			throw error;
		}
	};

	//** Handle
	const toggle = (tab) => {
		if (active !== tab) {
			setActive(tab);
		}
	};

	useEffect(() => {
		fetchDataCourse();
		return () => {
			setActive("1");
			setDataCourse([]);
		};
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Courses"
				data={[{ title: "Courses" }]}
				rightMenu={
					<Col className="d-flex justify-content-end">
						<ButtonGroup className={"me-1"}>
							<Button
								outline={active !== "1" ? true : false}
								color="primary"
								onClick={() => {
									toggle("1");
								}}
							>
								<Square size={15} />
							</Button>
							<Button
								outline={active !== "2" ? true : false}
								color="primary"
								onClick={() => {
									toggle("2");
								}}
							>
								<List size={15} />
							</Button>
						</ButtonGroup>
					</Col>
				}
			/>

			<TabContent className="py-50" activeTab={active}>
				<TabPane tabId="1">
					<Row className="match-height">
						{dataCourse.map((item, index) => {
							return (
								<CourseCard
									key={index}
									item={item}
									index={index}
								/>
							);
						})}
					</Row>
				</TabPane>

				<TabPane tabId="2">
					<Card>
						<Table responsive>
							<thead>
								<tr>
									<th>Course Title</th>
									<th>Description</th>
									<th>Enrolled</th>
									<th>Tag</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{dataCourse.map((item, index2) => {
									return (
										<tr key={index2}>
											<td>
												<span className="align-middle fw-bold">
													{
														item?.course_title
													}
												</span>
											</td>

											<td>
												{
													item?.course_description
												}
											</td>

											<td>
												<AvatarGroup
													data={
														avatarGroupData2
													}
												/>
											</td>

											<td>
												<Badge
													pill
													color="light-success"
													className="me-1"
												>
													{
														item?.course_tag
													}
												</Badge>
											</td>

											<td width={210}>
												<Button.Ripple
													className="btn-icon me-1"
													color={
														"primary"
													}
													onClick={() =>
														navigate(
															`/courses-employee/${item?.id}`
														)
													}
													id="detail-course"
												>
													<Eye
														size={14}
													/>
												</Button.Ripple>
												<UncontrolledTooltip
													placement="top"
													target="detail-course"
												>
													Detail Course
												</UncontrolledTooltip>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Card>
				</TabPane>
			</TabContent>
		</Fragment>
	);
};

export default CoursesPage;
