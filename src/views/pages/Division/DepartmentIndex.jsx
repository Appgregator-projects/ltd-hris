import { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Modal,
  ModalBody,
  ModalHeader,
  Accordion,
  AccordionItem,
  AccordionBody,
  AccordionHeader,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import { Edit, Trash, User, Plus, Lock, UserPlus, Circle, Eye } from "react-feather";
import Avatar from "@components/avatar";
import { Link } from "react-router-dom";
import DivisionForm from "./DivisionForm";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Api from "../../../sevices/Api";
import withReactContent from "sweetalert2-react-content";
import FormUserAssign from "../Components/FormUserAssign";
import { error } from "jquery";
import getNestedChildren from "../../../Helper/hierarchy";
import DepartmentForm from "./DepartmentForm";
import { addDocumentFirebase, arrayUnionFirebase, getCollectionFirebase, setDocumentFirebase } from "../../../sevices/FirebaseApi";
import Division from "./Division";
const MySwal = withReactContent(Swal);

export default function DepartmentIndex() {
  const [department, setDepartment] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [modal, setModal] = useState({
    title: "Department form",
    mode: "add",
    item: null,
  });

  const fetchDepartment = async () => {
    try {
      const { status, data } = await Api.get(`/hris/depertement`);
      console.log(status, data)
      if (status) {
        setDepartment(data)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const fetchDepartmentFirebase = async () => {
    try {
      const getData = await getCollectionFirebase(
        "departments"
      )
      if (getData) {
        console.log(getData, "data")
        setDepartment(getData)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchDepartmentFirebase()
  }, [])

  const onAdd = () => {
    setModal({
      title: "Department Form",
      mode: "add department",
      item: null,
    });
    setToggleModal(true);
  };

  const onEdit = (item) => {
    setModal({
      title: "Department Form",
      mode: "edit department",
      item: item,
    });
    setToggleModal(true);
  };

  const onDetail = (item) => {
    setModal({
      title: "Detail " + item.name + " Department",
      mode: "detail department",
      item: item
    })
    setToggleModal(true)
  }

  const postUpdate = async (params) => {
    try {
      console.log(modal.item.id, "edit")
      const { status, data } = await Api.put(`/hris/depertement/${modal.item.id}`, params);
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      fetchDepartment();
      toast.success("Department has updated", {
        position: "top-center",
      });
      setToggleModal(false);
    } catch (error) {
      setToggleModal(false);
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const onSubmit = async (params) => {
    // return console.log(params,"arams")
    let response = ""
    let resChildren = ""
    try {
      if (modal.item) return postUpdate(params);
      // const {status,data} = await Api.post(`/hris/depertement`, params);
      response = await addDocumentFirebase("departments", params)
      if (params.parent !== null) {
        resChildren = await arrayUnionFirebase(
          `departments`, `${params.parent}`, "details", params
        )
      }
      toast.success("New division has been added as " + params.parent + " children", {
        position: "top-center",
      });
      fetchDepartmentFirebase();
      setToggleModal(false);
      if (!response)
        return toast.error(`Error : ${params.name}`, {
          position: "top-center",
        });
      fetchDepartmentFirebase();
      toast.success("New department: " + params.name + "has added", {
        position: "top-center",
      });
      setToggleModal(false);
    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const onSubmitFirebase = async (item) => {
    let response = ""
    console.log(item, item)
    try {
      response = await addDocumentFirebase("department", item)
      if (!response)
        return toast.error(`Error : ${item.name}`, {
          position: "top-center",
        });
      fetchDepartmentFirebase();
      toast.success("New department: " + item.name + "has added", {
        position: "top-center",
      });
      setToggleModal(false);
    } catch (error) {
      setToggleModal(false);
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  const postDelete = (id) => {
    return new Promise((resolve, reject) => {
      Api.delete(`/hris/depertement/${id}`)
        .then((res) => resolve(res))
        .catch((err) => reject(err.message));
    });
  };

  const onDelete = (item, index) => {
    MySwal.fire({
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
      if (result.value) {
        const data = await postDelete(item.id);
        if (data) {
          const oldCom = department;
          oldCom.splice(index, 1);
          setDepartment([...oldCom]);
          return MySwal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Department has deleted.",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      }
    });
  };

  return (
    <>
      <Row className="d-flex justify-content-between">
        <Col lg="2" sm="12" className="mb-1">
          <Fragment>
            <Button.Ripple size="sm" color="warning" onClick={onAdd}>
              <Plus size={14} />
              <span className="align-middle ms-25">Add Department</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle>Department</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className="text-xs">
                  <th className="fs-6">Name</th>
                  <th className="fs-6">Parent</th>
                  <th className="fs-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {department.map((x, index) => (
                  <>
                    <tr key={x.id}>
                      <td>{x.name}</td>
                      <td>{x.parent}</td>
                      {/* <td>{x.division}</td> */}
                      <td>
                        <div className="d-flex">
                          <div className="pointer">
                            <Eye
                              className="me-50"
                              size={15}
                              onClick={() => onDetail(x, index)}
                              id={`detail-tooltip-${x.id}`}
                            />{" "}
                            <span className='align-middle'></span>
                            <UncontrolledTooltip
                              placement="top"
                              target={`detail-tooltip-${x.id}`}>
                              Detail
                            </UncontrolledTooltip>
                            {x.id !== 4 && x.id !== 1 ?
                              <Trash
                                className="me-50"
                                size={15}
                                onClick={() => onDelete(x, index)}
                                id={`delete-tooltip-${x.id}`}
                              /> : <></>}
                            <span className='align-middle'></span>
                            {/* <UncontrolledTooltip
                              placement="top"
                              target={`delete-tooltip-${x.id}`}>
                                Delete
                            </UncontrolledTooltip> */}
                            <Edit
                              className="me-50"
                              size={15}
                              onClick={() => onEdit(x, index)}
                              id={`edit-tooltip-${x.id}`}
                            />{" "}
                            <span className="align-middle"></span>
                            <UncontrolledTooltip
                              placement="top"
                              target={`edit-tooltip-${x.id}`}>
                              Edit
                            </UncontrolledTooltip>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Row>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}>
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          {modal.title}
        </ModalHeader>
        <ModalBody>
          {modal.mode === "add department" ? (
            <DepartmentForm
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              item={modal.item}
              department={department}
            />
          ) : (
            <></>
          )}
          {modal.mode === "edit department" ? (
            <DepartmentForm
              item={modal.item}
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              department={department}
            // selectDivison={selectDivison}
            />
          ) : (
            <></>
          )}
          {modal.mode === "detail department" ? (
            <Division
              details={modal.item}
              close={() => setToggleModal(false)}
              department={department}
            />
          ) : (
            <></>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

