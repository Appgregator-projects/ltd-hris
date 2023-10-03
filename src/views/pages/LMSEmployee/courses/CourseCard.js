// ** React Imports
import { useState } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";


// ** Third Party Components
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ item }) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const cardHoverStyle = {
    backgroundColor: "#F8F8F8", // Set the desired background color on hover
    cursor: "pointer", // Optional: Change the cursor to a pointer on hover
    boxShadow: "none",
  };

  const cardStyle = {
    backgroundColor: "#FFFFFF", // Set the desired background color on hover
  };

  return (
    <Col lg="3" md="6" onClick={() => navigate(`/courses-employee/${item?.id}`)}>
      <Card
        style={isHovered ? cardHoverStyle : cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody>
          <img
            className="img-fluid rounded mb-2"
            src={item?.course_thumbnail}
            alt="Card cap"
          />

          <CardTitle tag="h4">{item?.course_title}</CardTitle>

          <CardSubtitle className="text-muted mb-1">
            <Row className="mb-0">
              <Col lg={3} xs={6} className="mb-0">
                <h6 className="pb-0 mb-0">
                  <FaUserCircle size={16} className="me-1" />
                  25
                </h6>
              </Col>

              <Col xs={6} className="pb-0">
                <h6 className="pb-0 mb-0">
                  <HiOutlineUserGroup size={16} className="me-1" />5
                </h6>
              </Col>
            </Row>
          </CardSubtitle>
          <CardText>{item?.course_description}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CourseCard;
