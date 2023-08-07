// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";
// ** Styles
import "@styles/react/apps/app-users.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import { Plus, Settings } from "react-feather";
import SectionAccordion from "./sectionAccordion";

const CourseDetailPage = () => {
  let sectionData = [{}, {}, {}, {}, {}];
  return (
    <Fragment>
      <Breadcrumbs
        title="Course"
        data={[{ title: "Course" }, { title: "Detail" }]}
      />

      <div className="app-user-view">
        <Row>
          <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardBody>
                <div className="user-avatar-section">
                  <div className="d-flex align-items-center flex-column">
                    <img
                      height="110"
                      width="110"
                      alt="user-avatar"
                      src={avatar1}
                      className="img-fluid rounded mt-3 mb-2"
                    />
                    <div className="d-flex flex-column align-items-center text-center">
                      <div className="user-info">
                        <h4>Eleanor Aguilar</h4>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="fw-bolder border-bottom pb-50 mb-1">Details</h4>
                <div className="info-container">
                  <ul className="list-unstyled">
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Username:</span>
                      <span>username</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Billing Email:</span>
                      <span>@email.com</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Status:</span>
                      <Badge className="text-capitalize" color={"primary"}>
                        status
                      </Badge>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Role:</span>
                      <span className="text-capitalize">Admin</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Tax ID:</span>
                      <span>Tax-</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Contact:</span>
                      <span>contact</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Language:</span>
                      <span>English</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Country:</span>
                      <span>England</span>
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
            <Row className="mb-1">
              <Col>
                <h3>Course Syllabus</h3>
              </Col>

              <Col className="d-flex justify-content-end">
                <Button.Ripple className="btn-icon" color={"primary"} outline>
                  <Settings size={14} />
                </Button.Ripple>
              </Col>
            </Row>

            {sectionData.map((item, index) => {
              return (
                <Card className="mb-1" key={index}>
                  <SectionAccordion />
                </Card>
              );
            })}

            <Button.Ripple color={"primary"} className="me-1 mt-2" block>
              <Plus size={14} />
              <span className="align-middle ms-25">Section</span>
            </Button.Ripple>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default CourseDetailPage;
