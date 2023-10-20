import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import Api from "../../../sevices/Api";
import { numberFormat } from "../../../Helper";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Trash, Edit, Eye, CheckCircle, Plus } from "react-feather";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function PayrolIndex() {
  const [payrolls, setPayrolls] = useState([]);

  const fetchPayroll = async () => {
    try {
      const data = await Api.get("/hris/payroll");
      setPayrolls([...data]);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const onDelete = (id) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await Api.delete(`/hris/payroll/${id}`);
          if (typeof data.status !== "undefined")
            return toast.error(`Error : ${data.data}`, {
              position: "top-center",
            });
          toast.success(data, {
            position: "top-center",
          });
          return fetchPayroll();
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  };

  const onApprove = (id) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await Api.patch(`/hris/payroll/${id}`);
          if (typeof data.status !== "undefined")
            return toast.error(`Error : ${data.data}`, {
              position: "top-center",
            });
          toast.success(data, {
            position: "top-center",
          });
          return fetchPayroll();
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  };

  return (
    <>
      <Row>
        <Col lg="6" className="mb-2">
          <Button.Ripple
            size="sm"
            color="primary"
            tag={Link}
            to="/payroll-form"
          >
            <Plus size={14} />
            <span className="align-middle text-sm ms-25">Create Payroll</span>
          </Button.Ripple>
        </Col>
        <Col lg="12">
          <Card>
            <CardBody>
              <Table striped>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Employee</th>
                    <th>Periode</th>
                    <th className="text-right">Amount (IDR)</th>
                    <th>Status</th>
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((x, index) => (
                    <tr key={x.id} className="text-xs">
                      <td>{index + 1}</td>
                      <td>{x.user.name}</td>
                      <td>
                        {x.periode ? dayjs(x.periode).format("MMMM-YYYY") : "-"}
                      </td>
                      <td className="text-right">{numberFormat(x.total)}</td>
                      <td>
                        <Badge
                          pill
                          color={x.approved_at ? "light-success" : "light-info"}
                          className="me-1"
                        >
                          {x.approved_at ? "Approved" : "Waiting"}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex">
                          <div className="pointer">
                            {!x.approved_at ? (
                              <div>
                                <Trash
                                  className="me-50"
                                  size={15}
                                  title="Delete"
                                  onClick={() => onDelete(x.id)}
                                  id={`payrol-delete-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payrol-delete-${x.id}`}
                                >
                                  Delete
                                </UncontrolledTooltip>
                              </div>
                            ) : (
                              <></>
                            )}
                            <span className="align-middle"></span>
                            <Link
                              to={`/payroll/${x.id}`}
                              // title="Detail"
                            >
                              <Eye
                                className="me-50"
                                size={15}
                                id={`paycheck-${x.id}`}
                              />
                            </Link>
                            <UncontrolledTooltip
                              placement="top"
                              target={`paycheck-${x.id}`}
                            >
                              Detail
                            </UncontrolledTooltip>
                            <span className="align-middle"></span>
                            {!x.approved_at ? (
                              <Link to={`/payroll/${x.id}/edit`}>
                                <Edit
                                  className="me-50"
                                  size={15}
                                  id={`payroll-edit-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payroll-edit-${x.id}`}
                                >
                                  Edit
                                </UncontrolledTooltip>
                              </Link>
                            ) : (
                              <></>
                            )}
                            {!x.approved_at ? (
                              <div>
                                <CheckCircle
                                  className="me-50"
                                  title="Approve"
                                  size={15}
                                  onClick={() => onApprove(x.id)}
                                  id={`payrol-approve-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payrol-approve-${x.id}`}
                                >
                                  Approve
                                </UncontrolledTooltip>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
