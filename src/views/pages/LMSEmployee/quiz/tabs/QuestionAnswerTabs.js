// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Button, Card, Col, ListGroupItem, Row } from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

// ** Third Party Components
import { Save } from "react-feather";
import { useParams } from "react-router-dom";

// ** Styles
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss";
import QuizAccordion from "../view/quizAccordion";
import { useSelector } from "react-redux";
import {
	getCollectionFirebase,
} from "../../../../../sevices/FirebaseApi";

const QuestionAnswerTabs = ({ fetchDataQuiz }) => {
	const param = useParams();

	const store = useSelector((state) => state.coursesSlice);

	const [quizList, setQuizList] = useState([]);
	const fetchDataQuestion = async () => {
		const res = await getCollectionFirebase(
			`quizzes/${param.id}/questions`
		);
		setQuizList(res);
	};

	useEffect(() => {
		fetchDataQuestion();
		return () => {
			setQuizList([]);
		};
	}, []);

	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Question and Answer</h3>
				</Col>
			</Row>

			<Row id="dd-with-handle" className="pl-1">
				{quizList?.length > 0 && (
					<Col>
						{quizList?.map((item) => {
							return (
								<ListGroupItem
									key={item.id}
									className="ml-1 p-0 border-0 mb-1"
								>
									<Card
										className="mb-0 w-full"
										key={item.id}
									>
										<QuizAccordion
											id={item.id}
											data={item}
											quizList={quizList}
											setQuizList={setQuizList}
											fetchDataQuestion={
												fetchDataQuestion
											}
											fetchDataQuiz={
												fetchDataQuiz
											}
											image={store.image[0]}
										/>
									</Card>
								</ListGroupItem>
							);
						})}
					</Col>
				)}
			</Row>

			<Button.Ripple color={"primary"} className="me-1 mt-2" block>
				<Save size={14} />
				<span className="align-middle ms-25">Submit</span>
			</Button.Ripple>
		</Fragment>
	);
};

export default QuestionAnswerTabs;
