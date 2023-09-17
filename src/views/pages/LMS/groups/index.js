// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Button, Card } from "reactstrap";

// ** Images
import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";

//** Icons
import { Edit, Trash } from "react-feather";
import { Badge, Table } from "reactstrap";

//** Folders
import GroupCourses from "./Courses";
import GroupMembers from "./Members";
import AddGroup from "./AddGroup";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

//** API
import Api from "../../../../sevices/Api";

// const data = [{}, {}, {}, {}, {}, {}, {}, {}];

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

const GroupsPage = () => {
	//** State
	const [groupData, setGroupData] = useState([]);

	//** Fetch Data
	const fetchDataGroup = async () => {
		try {
			const res = await Api.get("/hris/lms/lms-group");
			setGroupData(res.data);
		} catch (error) {
			throw error;
		}
	};

	//** Handle
	const handleConfirmText = (id) => {
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
				const deleted = Api.delete(`/hris/lms/lms-group/${id}`);
				if (deleted) {
					fetchDataGroup();
					MySwal.fire({
						icon: "success",
						title: "Deleted!",
						text: "Your file has been deleted.",
						customClass: {
							confirmButton: "btn btn-success",
						},
					});
				}
			}
		});
	};

	useEffect(() => {
		fetchDataGroup();
	}, []);

	return (
		<Fragment>
			<Breadcrumbs
				title="Groups"
				data={[{ title: "Groups" }]}
				rightMenu={
					<AddGroup
						type={"Create"}
						fetchDataGroup={fetchDataGroup}
					/>
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

			<Card>
				<Table responsive>
					<thead>
						<tr>
							<th>Group</th>
							<th>Tag</th>
							<th>Courses</th>
							<th>Members</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{groupData?.map((item, index) => (
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
										{item.group_name}
									</span>
								</td>
								<td>
									<Badge
										pill
										color="light-success"
										className="me-1"
									>
										fun_project
									</Badge>
								</td>
								<td>
									<AvatarGroup
										data={[
											{
												title: item.group_name,
												img: item.group_thumbnail,
												imgHeight: 26,
												imgWidth: 26,
											},
										]}
									/>
								</td>
								<td>
									<AvatarGroup
										data={avatarGroupData2}
									/>
								</td>
								<td width={250}>
									<GroupMembers group_id={item.id}/>
									<GroupCourses />
									<AddGroup
										type={"Edit"}
										singleGroup={item}
										fetchDataGroup={
											fetchDataGroup
										}
									/>
									<Button.Ripple
										className={"btn-icon"}
										color={"danger"}
										onClick={() =>
											handleConfirmText(
												item.id
											)
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

export default GroupsPage;
