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
  Dropdown,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Edit, Trash, User, Plus, Lock, UserPlus, Circle, Eye, X } from "react-feather";
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
import { addDocumentFirebase, arrayUnionFirebase, getCollectionFirebase, getCollectionWithSnapshotFirebase, setDocumentFirebase } from "../../../sevices/FirebaseApi";
import Division from "./Division";
import { Cascader } from "antd";
import { RiArrowDownSLine } from "react-icons/ri";
const MySwal = withReactContent(Swal);

export default function DepartmentIndex() {
  const [department, setDepartment] = useState([]);
  const [nestedDepartement, setNestedDept] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [open, setOpen] = useState([])

  const toggle = itemId => {
    if (open.includes(itemId)) {
      setOpen(open.filter((id) => id !== itemId));
    } else {
      setOpen([...open, itemId]);
    }
  }
  const [modal, setModal] = useState({
    title: "Department form",
    mode: "add",
    item: null,
  });



  const fetchDepartment = async () => {
    try {
      const { status, data } = await Api.get(`/hris/departement`);

      if (status) {
        setDepartment(data)
      }
    } catch (error) {

      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };



  const AccordionComponent = ({ data, toggle, open }) => {
    return (
      <Accordion open={open} toggle={toggle} className='accordion-without-arrow'>
        {
          data?.map(item => {
            return (
              <AccordionItem key={item.id}>
                <AccordionHeader targetId={item.id} >
                  <div className="d-flex align-items-center justify-content-between w-100" >
                    {item.label}
                    <div className="d-flex">
                      <div className="pointer me-2">
                        <Trash
                          className="me-2"
                          size={15}
                          onClick={() => onDelete(item, item.id)}
                          id={`delete-tooltip-${item.id}`}
                        />{" "}
                        <span className="align-middle"></span>
                        <UncontrolledTooltip
                          placement="top"
                          target={`delete-tooltip-${item.id}`}>
                          Delete
                        </UncontrolledTooltip>
                        <Edit
                          size={15}
                          onClick={() => onEdit(item)}
                          id={`edit-tooltip-${item.id}`}
                        />{" "}
                        <span className="align-middle"></span>
                        <UncontrolledTooltip
                          placement="top"
                          target={`edit-tooltip-${item.id}`}>
                          Edit
                        </UncontrolledTooltip>
                      </div>
                      <div>

                        {item?.children?.length > 0 && <RiArrowDownSLine />}
                      </div>
                    </div>
                  </div>
                </AccordionHeader>
                <AccordionBody accordionId={item.id}>
                  {item.children && item.children.length > 0 && (
                    <AccordionComponent id={item.id} data={item.children} toggle={toggle} open={open} />
                  )}
                </AccordionBody>
              </AccordionItem>
            )
          })
        }
      </Accordion >
    );
  };


  useEffect(() => {

    function buildTree(data, parentId = null) {
      const tree = [];

      for (const item of data) {
        if (item.parent == parentId) {
          const children = buildTree(data, item.id);

          if (children.length) {
            item.children = children;
          }

          tree.push({ ...item, label: item.label, value: item.id })
        }
      }

      return tree;
    }


    if (nestedDepartement) {
      const tree = buildTree(department)

      setNestedDept(tree)
    }

    return () => {
      setNestedDept([])
      setOpen([])
    }

  }, [department]);

  useEffect(() => {
    fetchDepartment()
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
      title: "Edit Department Form",
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
      const { status, data } = await Api.put(`/hris/departement/${modal.item.id}`, params);
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
    try {
      if (modal.item) return postUpdate(params);
      const { status, data } = await Api.post(`/hris/departement`, params)

      setToggleModal(false);
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      toast.success("New division: " + data.label + " has been added", {
        position: "top-center",
      });
      fetchDepartment();
      setToggleModal(false);
    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const onDelete = (item, index) => {
    MySwal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this deletion of ${item.label} Department!`,
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
        const { status, data } = await Api.delete(`/hris/departement/${index}`);
        if (status) {
          fetchDepartment()
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

  const onAction = (item) => {
    const lengthItem = item.length
    const itemId = item[lengthItem - 1]

    const findInDepartment = department.find(e => e.id === itemId)

    MySwal.fire({
      title: "What action do you want?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: "Delete",
      confirmButtonText: "Edit",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
        denyButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        onEdit(findInDepartment)
      } else if (result.isDenied) {
        onDelete(findInDepartment, findInDepartment.id)
      }
    });
  }



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
                  {/* <th className="fs-6">Parent</th> */}
                  {/* <th className="fs-6">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                <AccordionComponent data={nestedDepartement} toggle={toggle} open={open} id={1} />
                {/* {nestedDepartement.map((x, index) => {
                  return ( 
                    // <Accordion className='accordion-margin' open={open} toggle={toggle}>
                    //   <AccordionItem>
                    //     <AccordionHeader targetId='1'>Accordion Item 1</AccordionHeader>
                    //     <AccordionBody accordionId='1'>
                    //       Pastry pudding cookie toffee bonbon jujubes jujubes powder topping. Jelly beans gummi bears sweet roll bonbon
                    //       muffin liquorice. Wafer lollipop sesame snaps. Brownie macaroon cookie muffin cupcake candy caramels tiramisu.
                    //       Oat cake chocolate cake sweet jelly-o brownie biscuit marzipan. Jujubes donut marzipan chocolate bar. Jujubes
                    //       sugar plum jelly beans tiramisu icing cheesecake.
                    //     </AccordionBody>
                    //   </AccordionItem>
                    // </Accordion>
                    // <>
                    //   <tr key={x.id}>
                    //     <td>
                    //       <UncontrolledDropdown direction="down">
                    //         {/* <DropdownToggle color="transparant">
                    //           {x.label} */}
                {/* <Cascader
                              options={[nestedDepartement?.[index]]}
                              defaultValue={x.label}
                              style={{ width: '100%' }}
                              bordered={false}
                              allowClear={false}
                              onChange={(e) => onAction(e)}
                            /> */}
                {/* <DropdownMenu>

                    //           {x.children?.map((y, id) => {
                    //             return (
                    //               <DropdownItem key={id}>
                    //                 {y.label}
                    //               </DropdownItem>
                    //             )
                    //           })}
                    //         </DropdownMenu> */}
                {/* </DropdownToggle> */}
                {/* </UncontrolledDropdown>
                         </td> */}
                {/* <td>{x.parent}</td> */}
                {/* <td>{x.division}</td> */}
                {/* <td>
                    //       <div className="d-flex">
                    //         <div className="pointer">
                    //           <Eye
                    //           className="me-50"
                    //           size={15}
                    //           onClick={() => onDetail(x, index)}
                    //           id={`detail-tooltip-${x.id}`}
                    //         />{" "}
                    //         <span className='align-middle'></span>
                    //         <UncontrolledTooltip
                    //           placement="top"
                    //           target={`detail-tooltip-${x.id}`}>
                    //           Detail
                    //         </UncontrolledTooltip>
                    //           {x.id !== 4 && x.id !== 1 ?
                    //             <Trash
                    //               className="me-50"
                    //               size={15}
                    //               onClick={() => onDelete(x, index)}
                    //               id={`delete-tooltip-${x.id}`}
                    //             /> : <></>}
                    //           <span className='align-middle'></span>
                    //           <UncontrolledTooltip
                    //           placement="top"
                    //           target={`delete-tooltip-${x.id}`}>
                    //             Delete
                    //         </UncontrolledTooltip>
                    //           <Edit
                    //           className="me-50"
                    //           size={15}
                    //           onClick={() => onEdit(x, index)}
                    //           id={`edit-tooltip-${x.id}`}
                    //         />{" "}
                    //         <span className="align-middle"></span>
                    //         <UncontrolledTooltip
                    //           placement="top"
                    //           target={`edit-tooltip-${x.id}`}>
                    //           Edit
                    //         </UncontrolledTooltip>
                    //         </div>
                    //       </div>
                    //     </td> */}
                {/* </tr>
                    </>
                 )
           })} */}
              </tbody>
            </Table >
          </CardBody >
        </Card >
      </Row >
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
              mode={modal.mode}
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              item={modal.item}
              department={department}
              nested={nestedDepartement}
            />
          ) : (
            <></>
          )}
          {modal.mode === "edit department" ? (
            <DepartmentForm
              mode={modal.mode}
              item={modal.item}
              onSubmit={onSubmit}
              close={() => setToggleModal(false)}
              department={department}
              nested={nestedDepartement}
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

