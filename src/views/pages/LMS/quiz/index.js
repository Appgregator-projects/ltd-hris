// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import {
	Button,
	Card,
	CardBody,
	Col,
	Input,
	InputGroup,
	InputGroupText,
	Row,
} from "reactstrap";
// ** Images
import { Search } from "react-feather";

import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import { Edit, Trash } from "react-feather";
import { Badge, Table } from "reactstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DetailQuiz from "./DetailQuiz";
import { useNavigate } from "react-router-dom";
// import AddGroup from "./AddGroup";

const MySwal = withReactContent(Swal);
const data = [{}, {}, {}, {}, {}, {}, {}, {}];

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

const thumbnailCourses = [
	{
		title: "Introduction to Web Development",
		img: "https://i.ytimg.com/vi/w__n0BvkqB4/maxresdefault.jpg",
		imgHeight: 26,
		imgWidth: 26,
	},
	{
		title: "Python for Beginners",
		img: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F549550559%2F1234433154323%2F1%2Foriginal.20230706-115709?w=1000&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=84e3c74c34b060e7d28ccef3f6a5a6ec",
		imgHeight: 26,
		imgWidth: 26,
	},
];

const QuizPage = () => {
	const navigate = useNavigate();

	const handleConfirmText = () => {
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
				MySwal.fire({
					icon: "success",
					title: "Deleted!",
					text: "Your file has been deleted.",
					customClass: {
						confirmButton: "btn btn-success",
					},
				});
			}
		});
	};
	const handleEdit = () => {};
	return (
		<Fragment>
			<Breadcrumbs
				title="Quiz"
				data={[{ title: "Quiz" }]}
				// rightMenu={<AddGroup type={"Create"} />}
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

			<Card>
				<Table responsive>
					<thead>
						<tr>
							<th>Group</th>
							<th>Lesson</th>
							<th>Members</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td>
									<img
										className="me-75"
										src={react}
										alt="react"
										height="20"
										width="20"
									/>
									<span className="align-middle fw-bold">
										Quiz Project
									</span>
								</td>

								<td>Introduction to Web Development</td>
								<td>
									<AvatarGroup
										data={thumbnailCourses}
									/>
								</td>
								<td width={250}>
									{/* <GroupMembers />
									<GroupCourses />
									<AddGroup type={"Edit"} /> */}
									{/* <DetailQuiz/> */}
									<Button.Ripple
										className={"btn-icon me-1"}
										color={"warning"}
										onClick={() =>
											navigate(
												"/quiz/testing",
												{
													state: {
														question:
															{
																id: 1,
																question_title:
																	"How far it could be?",
																question_description:
																	"Use 3rd Law of Newton",
																isCorrectAnswer: 3,
																answer: [
																	{
																		answerTitle:
																			"1600N",
																		isCorrectAnswer: false,
																		id: 1,
																	},
																	{
																		answerTitle:
																			"1000N",
																		isCorrectAnswer: false,
																		id: 2,
																	},
																	{
																		answerTitle:
																			"2000N",
																		isCorrectAnswer: true,
																		id: 3,
																	},
																],
															},
													},
												}
											)
										}
									>
										<Edit size={14} />
									</Button.Ripple>
									<Button.Ripple
										className={"btn-icon"}
										color={"danger"}
										onClick={() =>
											handleConfirmText()
										}
									>
										<Trash size={14} />
									</Button.Ripple>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Card>
		</Fragment>
	);
};

export default QuizPage;
