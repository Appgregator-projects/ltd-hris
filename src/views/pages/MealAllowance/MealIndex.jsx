import React, { useEffect, useState } from 'react'
import { Eye } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import { dateFormat, dateTimeFormat, numberFormat } from '../../../Helper'
import MealDetail from './MealDetail'
import Api from "../../../sevices/Api";
import toast from 'react-hot-toast'
import { addDocumentFirebase, getCollectionFirebase, setDocumentFirebase } from '../../../sevices/FirebaseApi'


const MealIndex = () => {
  const [meal, setMeal] = useState([])
  const [toggleModal, setToggleModal] = useState(false);
  const [nestedToggle, setNestedToggle] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [modal, setModal] = useState({
    title: "",
    mode: "detail",
    item: null
  })

  const {
    setValue, control, handleSubmit, formState: {errors}
  } = useForm({ mode: "onChange"});
  console.log(errors, "error");

  const fetchMeal = async() => {
    try {
      const getData = await getCollectionFirebase(
        "meal_allowance"
      )
      const {status, data} = await Api.get(`/hris/meal-allowance`)
      console.log(getData, "data meal")
      if(getData){
        setMeal([...getData])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchMeal()
  }, [])

  const onDetail = (item, index) => {
    setModal({
      title : "Detail Meal Allowance",
      mode: "detail",
      item: item
    })
    setSelectItem(item)
    setToggleModal(true)
  }

  const onReject = (param) => {
    // return console.log(param, "reject")
    setNestedToggle(true)
    return onSubmitFirebase(param, selectItem, "reject")
  };

  const onApproval = () => {
    return onSubmitFirebase("",selectItem,"approve")
  };

  const onCloseAll = () => {  
    setNestedToggle(!nestedToggle)
    setCloseAll(true)
  }

  const onSubmit = async (x, y,z) => {
    return console.log(x, y,z, "arg leave request")
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

          const status = await Api.put(`/hris/leave-approval-aprove`,itemPut);
          console.log(itemPut, status,  "put leave request")
          if (!status)
            return toast.error(`Error : ${status}`, {
              position: "top-center",
            });
          fetchDaysOff();
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

  const onSubmitFirebase = async(note, item, status) => {
    // return console.log(item, "item submit firebase")
    let response = ""
    const itemUpdate =  {
      item : {
        status : status
      },
      note,
      // status
    }
    console.log(itemUpdate, "itemPost")
    try {
      // response = await addDocumentFirebase(
      //   "meal_allowance", itemPost
      // )
      response = await setDocumentFirebase(
        "meal_allowance",
        item.id,
        itemUpdate
      )
      if (!response)
          return toast.error(`Error : ${status}`, {
            position: "top-center",
          });
          // fetchDaysOff();
          toast.success(status, {
            position: "top-center",
          });
          setToggleModal(false);
    } catch (error) {
      setToggleModal(false);
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
      throw error
    }
  }

  const renderStatus = (arg) => {
    // return console.log(arg, "arg status")
    if (!arg)
      return <Badge color="light-warning">Requested</Badge>;
    if (arg === "requested")
      return <Badge color="light-primary">Requested</Badge>;
    if (arg === "approve")
      return <Badge color="light-success">Approved</Badge>;
    if (arg === "reject")
      return <Badge color="light-danger">Rejected</Badge>;
    return <Badge color="light-info">Processed</Badge>;
  };

  console.log(selectItem, "select")

  return (
    <>
    <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Meal Allowance</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead>
                  <tr className="text-xs">
                    <th className="fs-6">Employee</th>
                    <th className="fs-6">Level</th>
                    <th className="fs-6">Day</th>
                    <th className="fs-6">Total Allowance</th>
                    <th className="fs-6">Status</th>
                    <th className="fs-6">Created At</th>
                    <th className="fs-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.map((x, index) => (
                    <tr key={index}>
                      <td>{x.item.users?.name}</td>
                      <td>{x.item.users? x.item.users.title : "Manager"}</td>
                      <td>{x.item.quantity} days</td>
                      <td>Rp {numberFormat(x.item.total? x.item.total : "0")}</td>
                      <td>{renderStatus(x.item.status)}</td>
                      <td>{dateTimeFormat(x.createdAt.nanoseconds)}</td>
                      <td>
                        <div className='pointer'>
                        <Eye
                         size={20}
                         onClick={() => {onDetail(x)}}></Eye>
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
          {modal.title}
        </ModalHeader>
        <ModalBody>
          {modal.mode === "detail" ? 
          <MealDetail 
          item={modal.item}
          close = {() => setToggleModal(false)}/> :<></> }
        </ModalBody>
        {selectItem?.item.status === "requested" ?
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
                    <Form onSubmitFirebase={handleSubmit(onReject)}>
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
  )
}

export default MealIndex