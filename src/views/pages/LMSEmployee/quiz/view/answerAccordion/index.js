// ** Reactstrap Imports
import { Col, Form, Input, Row } from "reactstrap";

// ** Third Party Components
import Prism from "prismjs";
import { useEffect } from "react";

const AnswerAccordion = ({ answer }) => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<Row className="handle bg-white">
			<Col className="pt-1 ms-1">
				<Form>
					<div className="form-check">
						<h6>
							<Input type="radio" className="me-1" />
							{answer?.answerTitle}
						</h6>
					</div>
				</Form>
			</Col>
		</Row>
	);
};

export default AnswerAccordion;
