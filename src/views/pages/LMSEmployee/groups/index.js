// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Card } from "reactstrap";

// ** Images
import AvatarGroup from "@components/avatar-group";
import react from "@src/assets/images/icons/react.svg";

//** Icons
import { Badge, Table } from "reactstrap";

import {
	getCollectionFirebase,
	getCollectionWhereFirebase,
} from "../../../../sevices/FirebaseApi";
import SingleAvatarGroup from "../../../../@core/components/single-avatar-group";

const GroupsPage = () => {
	//** State
	const [groupData, setGroupData] = useState([]);
	const userData = localStorage.getItem("userData");
	const uid = JSON.parse(userData).id;

	//** Fetch Data
	const fetchDataGroup = async () => {
		try {
			const group = await getCollectionWhereFirebase(
				"groups",
				"group_members",
				"array-contains",
				uid
			);
			if (group) {
				const groupData = [];
				group.forEach(async (groupDoc) => {
					const groupMembers = await getCollectionFirebase(
						`groups/${groupDoc.id}/group_members`
					);
					const groupCourses = await getCollectionFirebase(
						`groups/${groupDoc.id}/group_courses`
					);
					groupData.push({
						...groupDoc,
						groupCourses: groupCourses,
						groupMembers: groupMembers,
					});
					if (group.length === groupData.length) {
						setGroupData(groupData);
					}
				});
			}
		} catch (error) {
			throw error;
		}
	};

	useEffect(() => {
		fetchDataGroup();
	}, []);

	return (
		<Fragment>
			<Breadcrumbs title="Groups" data={[{ title: "Groups" }]} />
			<Card>
				<Table responsive>
					<thead>
						<tr>
							<th>Group</th>
							<th>Tag</th>
							<th>Courses</th>
							<th>Members</th>
						</tr>
					</thead>
					<tbody>
						{groupData?.map((item, index) => (
							<tr key={index}>
								<td>
									<img
										className="me-75"
										src={
											item.group_thumbnail
												? item.group_thumbnail
												: react
										}
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
										{item.group_tag}
									</Badge>
								</td>
								<td>
									<div className="avatar-group">
										{item?.groupCourses?.map(
											(x, id) => {
												return (
													<SingleAvatarGroup
														key={id}
														id={id}
														data={x}
													/>
												);
											}
										)}
									</div>
								</td>
								<td>
									<div className="avatar-group">
										{item?.groupMembers?.map(
											(x, id) => {
												return (
													<SingleAvatarGroup
														key={id}
														id={id}
														data={x}
													/>
												);
											}
										)}
									</div>
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
