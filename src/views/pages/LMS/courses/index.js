// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import AddCourse from "./AddCourse";

// ** Reactstrap Imports
import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardLink,
	CardSubtitle,
	CardText,
	CardTitle,
	Col,
	Input,
	InputGroup,
	InputGroupText,
	Row,
	TabContent,
	TabPane,
	UncontrolledTooltip,
} from "reactstrap";

// ** Images
import img3 from "@src/assets/images/slider/06.jpg";
import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import { Badge, Table } from "reactstrap";

// ** Third Party Components
import { Eye, List, Search, Square, Edit, Trash } from "react-feather";
// import { FaUserCircle } from "react-icons/fa";
// import { HiOutlineUserGroup } from "react-icons/hi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CourseCard from "./CourseCard";

//** API
import Api from "../../../../sevices/Api";

import data from "./course.json";
import {
	deleteDocumentFirebase,
	deleteFileFirebase,
	getCollectionFirebase,
} from "../../../../sevices/FirebaseApi";
import { useSelector } from "react-redux";

const MySwal = withReactContent(Swal);

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
	const store = useSelector((state) => state.coursesSlice);

	//** Initial State
	const [active, setActive] = useState("1");
	const [dataCourse, setDataCourse] = useState([]);

	//** Fetch Data
	const fetchDataCourse = async () => {
		const condition = [{ field: "isOpen", operator: "==", value: true }];
		const getData = await getCollectionFirebase("courses", condition);
		setDataCourse(getData);
	};

	//** Handle
	const toggle = (tab) => {
		if (active !== tab) {
			setActive(tab);
		}
	};

	const handleConfirmText = async (item) => {
		return MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			customClass: {
				confirmButton: "btn btn-primary",
				cancelButton: "btn btn-outline-danger ms-1",
			},
			buttonsStyling: false,
		}).then(function (result) {
			if (result.value) {
				if (item?.course_thumbnail) {
					const split = item.course_thumbnail.split("%2F");
					const finalSplit = split[1].split("?");
					const finalString = decodeURIComponent(finalSplit[0]);

					try {
						deleteFileFirebase(finalString, "courses");
					} catch (error) {
						throw error;
					}
				}

				deleteDocumentFirebase("courses", item.id).then(
					(deleteCourse) => {
						if (deleteCourse) {
							MySwal.fire({
								icon: "success",
								title: "Deleted!",
								text: "Your file has been deleted.",
								customClass: {
									confirmButton: "btn btn-success",
								},
							});
							fetchDataCourse();
						}
					}
				);
			}
		});
	};

	useEffect(() => {
		fetchDataCourse();
		console.log(store, "stores");
		return () => {};
	}, [active]);

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

						<AddCourse
							type={"Add"}
							image={store.image}
							fetchDataCourse={fetchDataCourse}
						/>
					</Col>
				}
			/>

			{/* <Card>
        <CardBody className="px-1">
          <Row>
            <Col lg="6" md="12">
              <InputGroup>
                <InputGroupText>Search</InputGroupText>
                <Input />
                <Button color="secondary">
                  <Search size={12} />
                </Button>
              </InputGroup>
            </Col>

            <Col lg="6" md="12">
              <InputGroup>
                <InputGroupText>Search</InputGroupText>
                <Input />
                <Button color="secondary">
                  <Search size={12} />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card> */}

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
												{/* <img
                          className="me-75"
                          src={react}
                          alt="react"
                          height="20"
                          width="20"
                        /> */}
												<span className="align-middle fw-bold">
													{
														item.course_title
													}
												</span>
											</td>

											<td>
												{
													item.course_description
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
														item.course_tag
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
															`/courses/${item.id}`
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

												<AddCourse
													type={"Update"}
													id={item.id}
													data={item}
													image={
														store.image
													}
													fetchDataCourse={
														fetchDataCourse
													}
												/>

												<Button.Ripple
													className={
														"btn-icon"
													}
													color={
														"danger"
													}
													onClick={() =>
														handleConfirmText(
															item
														)
													}
													id="delete-course"
												>
													<Trash
														size={14}
													/>
												</Button.Ripple>
												<UncontrolledTooltip
													placement="top"
													target="delete-course"
												>
													Delete Course
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
