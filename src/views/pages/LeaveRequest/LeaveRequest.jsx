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
  Form,
  FormFeedback,
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

export default function LeaveRequestIndex() {
  const [request, setRequest] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [nestedToggle, setNestedToggle] = useState(false)
  const [close, setCloseAll] = useState(false)
  const [selectItem, setSelectItem] = useState(null);
  const [modal, setModal] = useState({
    title: "",
    mode: "detail",
    item: null
  })

  //**State filtering */
  const [filterStatus, setFilterStatus] = useState("")
  const [category, setCategory] = useState([])

  const {
    setValue, control, handleSubmit, formState: {errors}
  } = useForm({ mode: "onChange"});
  console.log(errors, "error");

  const fetchLeave = async () => {
    try {
      const {status,data} = await Api.get("hris/leave-request");
      const filtering = data.filter((x) => x.user_uid && x['userReq.name'] !== null)
      const filterData = filtering.filter((x) =>  x.status === filterStatus)
      if(status && filterStatus === ""){
        setRequest([...filtering]);
      } else {
        setRequest([...filterData])
      }
      fetchLeaveCategory()
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchLeave();
  }, [filterStatus]);

  const fetchLeaveCategory = async () => {
    try {
      const {status,data} = await Api.get(`/hris/leave-category`)
      if(status) {
        const dataLeave = request?.map((x) => {
          x.leave_category_name = "Cuti tidak diketahui"
          const category = data?.find(y => y.id === x.leave_category_id)
          if(category){
            x.leave_category_name = category? category.name : "Cuti tidak diketahui"
          }
          return x
        })
        setCategory(dataLeave)
      } else {
        setCategory([...request.map(x => {
          x.leave_category_name = "Cuti tidak terdaftar"
          return x
        })])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchLeaveCategory()
  },[request])

  const onDetail = (arg) => {
    console.log(arg,"arg")
    setModal({
      title: "Detail Request",
      mode: "detail",
      item: arg
    })
    setSelectItem(arg);
    setToggleModal(true);
  };

  const onReject = (param) => {
    setNestedToggle(true)
    return onSubmit(param, selectItem, "reject")
  };

  const onApproval = () => {
    return onSubmit("",selectItem,"approve")
  };

  const onCloseAll = () => {  
    setNestedToggle(!nestedToggle)
    setCloseAll(true)
  }

  const handleFilter = (e) => {
    setFilterStatus(e.target.value)
  }

  const onSubmit = async (x, y,z) => {
    console.log(x, y, "arg leave request")
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${z} it!`,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        try {
          const itemPut = {
            leave_request_id: y.id,
            status: z,
            note: x.rejected_note? x.rejected_note : " "
          };

          const {status,data} = await Api.put(`/hris/leave-approval-aprove`,itemPut);
          console.log(itemPut, status,  "put leave request")
          if (!status)
            return toast.error(`Error : ${status}`, {
              position: "top-center",
            });
          // fetchLeave();
          toast.success(status, {
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
    // return console.log(arg, "arg status")
    if (!arg)
      return <Badge color="light-primary">Waiting</Badge>;
    if (arg === "processed")
      return <Badge color="light-warning">Requested</Badge>;
    if (arg === "approve")
      return <Badge color="light-success">Approved</Badge>;
    if (arg === "reject")
      return <Badge color="light-danger">Rejected</Badge>;
    return <Badge color="light-info">Waiting</Badge>;
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Leave Request</CardTitle>
              <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                <Label className="me-1 w-50" for="filtering">Filter status</Label>
                <Input
                type="select"
                id="filter-by-sttus"
                value={filterStatus}
                onChange={handleFilter}
                >
                  <option value="">All</option>
                  <option value="approve">Approved</option>
                  <option value="reject">Rejected</option>
                  <option value="processed">Requested</option>
                  <option value="waiting">Waiting</option>
                </Input>
              </Col>
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
                    <th className="fs-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {category.map((x, index) => (
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
                            Detail Request
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
          Request Detail
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
                  <span className="fw-bold">Leave Category</span>
                  <span>{selectItem?.leave_category_name}</span>
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
                      to={selectItem ? selectItem.file : "-"}
                      target="_blank"
                    >
                      Attachment
                    </Link>
                  </span>
                </li>
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Reason</span>
                  {selectItem.status === "reject"?
                  <span></span>
                   :<></>}
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}
        </ModalBody>
        {selectItem?.status === "processed" ?
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
                    toggle={() => onReject(selectItem)}
                    className={`modal-dialog-centered modal-lg`}
                    backdrop={"static"}

                    // onClosed={close}
                  >
                    <Form onSubmit={handleSubmit(onReject)}>
                    <ModalHeader>Note</ModalHeader>
                    <ModalBody>
                      <Label for="rejected_note"
                      >Rejected Note</Label>
                      <Controller
                      name="rejected_note"
                      defaultValue=""
                      control={control}
                      render={({field}) => (
                        <Input
                        id="rejected_note"
                        {...field}
                        name="rejected_note"
                        type="textarea"
                        invalid={errors.rejected_note && true}/>
                      )}/>
                      {errors.rejected_note && <FormFeedback>{errors.rejected_note.message}</FormFeedback>}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={() =>  onCloseAll()}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" size="md">
                        Send
                      </Button>
                    </ModalFooter>
                    </Form>
                  </Modal>  
                Reject
              </Button>
              <Button
                type="submit"
                size="md"
                color="primary"
                className="m-1"
                onClick={() => onApproval()}
              >
                Approve
              </Button>
            </div>
          ) : (
            <></>
          )}

        </ModalFooter> : <></>} 
      </Modal>
    </>
  );
}
