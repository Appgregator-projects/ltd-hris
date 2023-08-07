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
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
  const data = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
  ];

  const navigate = useNavigate();
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

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

  useEffect(() => {
    return () => {};
  }, [active]);

  return (
    <Fragment>
      <Breadcrumbs title="Courses" data={[{ title: "Courses" }]} />

      <Card>
        <CardBody className="px-1">
          <Row>
            <Col lg="4" md="12">
              <InputGroup>
                <InputGroupText>Search</InputGroupText>
                <Input />
                <Button color="secondary">
                  <Search size={12} />
                </Button>
              </InputGroup>
            </Col>

            <Col lg="4" md="12">
              <InputGroup>
                <InputGroupText>Search</InputGroupText>
                <Input />
                <Button color="secondary">
                  <Search size={12} />
                </Button>
              </InputGroup>
            </Col>

            <Col lg="4" md="12" className="d-flex justify-content-end">
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

              <AddCourse />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <Row className="match-height">
            {data.map((item, index) => {
              return (
                <Col
                  lg="3"
                  md="6"
                  key={index}
                  onClick={() => navigate(`/courses/${index}`)}
                >
                  <Card>
                    <CardBody>
                      <CardTitle tag="h4">Card Title</CardTitle>

                      <CardSubtitle className="text-muted">
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
                      <img
                        className="img-fluid my-2"
                        src={img3}
                        alt="Card cap"
                      />
                      <CardText>
                        Bear claw sesame snaps gummies chocolate.
                      </CardText>
                      <CardLink href="/" onClick={(e) => e.preventDefault()}>
                        Card Link
                      </CardLink>
                      <CardLink href="/" onClick={(e) => e.preventDefault()}>
                        Another Link
                      </CardLink>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </TabPane>

        <TabPane tabId="2">
          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Client</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* <tbody>
                {data.map((item, index2) => {
                  return (
                    <tr key={index2}>
                      <td>
                        <img
                          className="me-75"
                          src={react}
                          alt="react"
                          height="20"
                          width="20"
                        />
                        <span className="align-middle fw-bold">
                          React Project
                        </span>
                      </td>
                      <td>Ronald Frest</td>
                      <td>
                        <AvatarGroup data={avatarGroupData2} />
                      </td>
                      <td>
                        <Badge pill color="light-success" className="me-1">
                          Completed
                        </Badge>
                      </td>
                      <td width={210}>
                        <Button.Ripple
                          className={"btn-icon me-1"}
                          color={"primary"}
                          onClick={() => navigate(`/courses/${item.id}`)}
                        >
                          <Eye size={14} />
                        </Button.Ripple>

                        <Button.Ripple
                          className={"btn-icon me-1"}
                          color={"warning"}
                        >
                          <Edit size={14} />
                        </Button.Ripple>

                        <Button.Ripple
                          className={"btn-icon"}
                          color={"danger"}
                          onClick={() => handleConfirmText()}
                        >
                          <Trash size={14} />
                        </Button.Ripple>
                      </td>
                    </tr>
                  );
                })}
              </tbody> */}
            </Table>
          </Card>
        </TabPane>
      </TabContent>
    </Fragment>
  );
};

export default CoursesPage;
