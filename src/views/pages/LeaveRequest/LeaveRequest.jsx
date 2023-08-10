import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import Api from "../../../sevices/Api";
import { dateFormat, dateTimeFormat } from "../../../Helper/index";
import { Eye } from "react-feather";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Controller, useForm } from "react-hook-form";
import { error } from "jquery";
import { yupResolver } from "@hookform/resolvers/yup";
const MySwal = withReactContent(Swal);

export default function CorrectionIndex() {
  const [corrections, setCorrection] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [nestedToggle, setNestedToggle] = useState(false)
  const [close, setCloseAll] = useState(false)
  const [selectItem, setSelectItem] = useState(null);

  const fetchLeave = async () => {
    try {
      const data = await Api.get("hris/leave-request");
      setCorrection([...data]);
      // console.log(data[0]['userReq.name'],'data')
      
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchLeave();
  }, []);

  const onDetail = (arg) => {
    setSelectItem(arg);
    setToggleModal(true);
  };

  const onReject = () => {
    console.log("i am rejected");
    setNestedToggle(true)
  };

  const onCloseAll = () => {  
    setNestedToggle(!nestedToggle)
    setCloseAll(true)
  }

  const onApproval = async (arg) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${arg} it!`,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        try {
          const params = {
            status: arg,
          };
          const status = await Api.post(
            `/hris/leave-request/${selectItem.id}/approval`,
            params
          );
          if (!status)
            return toast.error(`Error : ${data}`, {
              position: "top-center",
            });
          fetchLeave();
          toast.success(data, {
            position: "top-center",
          });
          setToggleModal(false);
        } catch (error) {
          setToggleModal(false);
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
          throw error;
        }
      }
    });
  };

  const renderStatus = (arg) => {
    if (!arg.status)
      return <Badge color="light-warning">Requested</Badge>;
    if (arg.status === "requested")
      return <Badge color="light-primary">Requested</Badge>;
    if (arg.status === "Approved")
      return <Badge color="light-success">Approved</Badge>;
    if (arg.status === "Rejected")
      return <Badge color="light-danger">Rejected</Badge>;
    return <Badge color="light-info">Processed</Badge>;
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Leave Request</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead>
                  <tr className="text-xs">
                    <th className="fs-6">Employee</th>
                    <th className="fs-6">Begin Date</th>
                    <th className="fs-6">End Date</th>
                    <th className="fs-6">Status</th>
                    <th className="fs-6">Created At</th>
                    <th className="fs-6">#</th>
                  </tr>
                </thead>
                <tbody>
                  {corrections.map((x, index) => (
                    <tr key={index}>
                      <td>{x['userReq.name']}</td>
                      <td>{dateFormat(x.start_date)}</td>
                      <td>{dateFormat(x.end_date)}</td>
                      <td>{renderStatus(x.status)}</td>
                      <td>{dateTimeFormat(x.createdAt)}</td>
                      <td>
                        <div className="column-action d-flex align-items-center">
                          <div
                            className="text-body pointer"
                            onClick={() => onDetail(x)}
                            id={`pw-tooltip-${x.leave_category_id}`}
                          >
                            <Eye size={17} className="mx-1" />
                          </div>
                          <UncontrolledTooltip
                            placement="top"
                            target={`pw-tooltip-${x.leave_category_id}`}
                          >
                            Preview Correction
                          </UncontrolledTooltip>
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
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}
      >
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          Correction Detail
        </ModalHeader>
        <ModalBody>
          {selectItem ? (
            <>
              <ul className="list-none padding-none">
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Employee Name</span>
                  <span className="capitalize">{selectItem['userReq.name'] }</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Employee Email</span>
                  <span>{selectItem['userReq.email']}</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Created At</span>
                  <span>{dateFormat(selectItem.createdAt)}</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Current Status</span>
                  <span>{renderStatus(selectItem.status)}</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Begin Date</span>
                  <span>{dateFormat(selectItem.start_date)}</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">End Date</span>
                  <span>{dateFormat(selectItem.end_date)}</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Total</span>
                  <span>{selectItem ? selectItem.total_day : "-"} day</span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Attachment</span>
                  <span>
                    <Link
                      to={selectItem ? selectItem.image : "-"}
                      target="_blank"
                    >
                      attachment
                    </Link>
                  </span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Reason</span>
                  <span></span>
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter>
          {selectItem ? (
            <div className="">
              <Button
                type="button"
                size="md"
                color="danger"
                onClick={() => setNestedToggle(!nestedToggle)}
                // onClosed = {close}
              >
                  <Modal
                    isOpen={nestedToggle}
                    toggle={onReject}
                    className={`modal-dialog-centered modal-lg`}
                    backdrop={"static"}

                    // onClosed={close}
                  >
                    <ModalHeader>Note</ModalHeader>
                    <ModalBody>
                      <Label for="rejected_note"
                      >Rejected Note</Label>
                      <Input
                      id="rejected_note"
                      name="rejected_note"
                      type="textarea"/>
                      
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={() =>  onCloseAll()}>
                        Cancel
                      </Button>{' '}
                      <Button color="primary" onClick={() => onReject()}>
                        Send
                      </Button>
                    </ModalFooter>
                  </Modal>  
                Reject
              </Button>
              <Button
                type="submit"
                size="md"
                color="primary"
                className="m-1"
                onClick={() => onApproval("approved")}
              >
                Approv
              </Button>
            </div>
          ) : (
            <></>
          )}

        </ModalFooter>
      </Modal>
    </>
  );
}
