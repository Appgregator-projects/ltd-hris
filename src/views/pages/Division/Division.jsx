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
} from "reactstrap";
import { Edit, Trash, User, Plus, Lock, UserPlus, Circle, Users } from "react-feather";
import DivisionForm from "./DivisionForm";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Api from "../../../sevices/Api";
import withReactContent from "sweetalert2-react-content";
import FormUserAssign from "../Components/FormUserAssign";
import { error } from "jquery";
import getNestedChildren from "../../../Helper/hierarchy";
import { addDocumentFirebase, arrayUnionFirebase, getCollectionFirebase, setDocumentFirebase } from "../../../sevices/FirebaseApi";
const MySwal = withReactContent(Swal);

export default function Division({details}) {
  const [divisions, setDivisions] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [modal, setModal] = useState({
    title: "Division form",
    mode: "add",
    item: null,
  });

  const fetchDivision = async() => {
    try {
      const {status,data} = await Api.get(`/hris/depertement/${details.id}`)
      const getData = await getCollectionFirebase(
        "department"
      )
      if (status){
        console.log(data, "data")
        setDivisions(data.division)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchDivision()
  }, [])

  const onAdd = () => {
    setModal({
      title: "Division form",
      mode: "add",
      item: null,
    });
    setToggleModal(true);
  };

  const onEdit = (item) => {
    setModal({
      title: "Division form",
      mode: "edit",
      item: item,
    });
    setToggleModal(true);
  };

  const postUpdate = async (params) => {
    try {
      console.log("kesini")
      const {status,data} = await Api.put(`/hris/division/${modal.item.id}`, params);
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      fetchDivision();
      toast.success("Division has been updated", {
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
    const itemPost = {
      name : params.name,
      departement_id : details.id
    }
    try {
      if (modal.item) return postUpdate(itemPost);
      const {status,data} = await Api.post(`/hris/division`, itemPost);
      console.log(status,data, "post division")
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      fetchDivision();
      toast.success("Division has been updated", {
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

  const onSubmitFirebase = async(arg) => {
    console.log(arg, "arg index")
    let response = ""
    try {
      response =  await arrayUnionFirebase(
        `department`,`${item.id}`, "details", arg
      )
      if (!response)
          return toast.error(`Error : ${arg.name}`, {
            position: "top-center",
          });
          // fetchDepartmentFirebase();
          toast.success("New department: " + item.name+ "has added", {
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
      Api.delete(`/hris/division/${id}`)
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
          const oldCom = divisions;
          oldCom.splice(index, 1);
          setDivisions([...oldCom]);
          return MySwal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Division has been deleted.",
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
        <Col lg="12" sm="12" className="mb-1 d-flex justify-content-end">
          <Fragment>
            <Button.Ripple size="sm" color="warning" onClick={onAdd}>
              <Plus size={14} />
               Add Division
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
      <Row>
        <ul>
          {divisions.map((x,i) => (
            <li className="d-flex justify-content-between">
              <div className="h6">{x.name}</div>
              <div>
              <Edit className="pointer" size={15} onClick={() => {onEdit(x,i)}}/>
              <Trash className="ms-1 pointer" size={15} onClick={() => {onDelete(x, i)}}/>
              </div>
            </li>
          ))
          }
        </ul>
      </Row>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}>
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          {modal.title}
        </ModalHeader>
        <ModalBody>
          {modal.mode === "add" ? (
            <DivisionForm
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              divisions={divisions}
              // item={modal.item}
            />
          ) : (
            <></>
          )}
          {modal.mode === "edit" ? (
            <DivisionForm
              item={modal.item}
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              divisions={divisions}
            />
          ) : (
            <></>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}
