// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Card, Col, ListGroupItem, Row } from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import SectionAccordion from "../sectionAccordion";
import { useParams } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";

//** Api
import Api from "../../../../../../sevices/Api";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionFirebase } from "../../../../../../sevices/FirebaseApi";
import { getSections } from "../../../../LMS/store/courses";

const CourseSyllabusTab = ({ logActivity }) => {
	const param = useParams();
	const dispatch = useDispatch();

	const [sectionList, setSectionList] = useState([]);

	const store = useSelector((state) => state.coursesSlice);

	//** Fetch data
	const fetchDataSection = async () => {
		try {
			const res = await getCollectionFirebase(
				`courses/${param.id}/course_section`
			);
			if (res) {
				dispatch(getSections(res));
				setSectionList(res);
			}
		} catch (error) {
			throw error;
		}
	};


	useEffect(() => {
		fetchDataSection();
		return () => {
			setSectionList();
		};
	}, []);

	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Course Syllabus</h3>
				</Col>
			</Row>

			<Row id="dd-with-handle" className="pl-1">
				<Col>
					{sectionList &&
						sectionList?.map((item, index) => {
							return (
								<ListGroupItem
									key={index}
									className="ml-1 p-0 border-0 mb-1"
								>
									<Card
										className="mb-0 w-full"
										key={index}
									>
										<SectionAccordion
											data={item}
											dispatch={dispatch}
											logActivity={logActivity}
										/>
									</Card>
								</ListGroupItem>
							);
						})}
				</Col>
			</Row>
		</Fragment>
	);
};

export default CourseSyllabusTab;
