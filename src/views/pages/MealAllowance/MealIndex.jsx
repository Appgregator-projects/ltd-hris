import React, { useState } from 'react'
import { Eye } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import { dateFormat, dateTimeFormat } from '../../../Helper'
import MealDetail from './MealDetail'

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

  const dataDummy = 
  [
    {
      "user_id" : "Sutannata Putra",
      "division" : "Management",
      "level" : "Manager",
      "day" : 2,
      "total_allowance" : null,
      "attachment" : "sdfbksbfkj",
      "status" : "approved",
      "created_at" : "20234094374509"
    },
    {
      "user_id" : "Audi Rifqi",
      "division" : "Management",
      "level" : "Staff",
      "day" : 3,
      "total_allowance" : null,
      "attachment" : "sdfbksbfkj",
      "status" : "rejected", 
      "created_at" : "9374094365509"
    },
  ]

  const onDetail = (item, index) => {
    setModal({
      title : "Detail Reimburse",
      mode: "detail",
      item: item
    })
    setSelectItem(item)
    setToggleModal(true)
  }

  const onReject = (param) => {
    // return console.log(param, "reject")
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
                    <th className="fs-6">Attachment</th>
                    <th className="fs-6">Status</th>
                    <th className="fs-6">Created At</th>
                    <th className="fs-6">#</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDummy.map((x, index) => (
                    <tr key={index}>
                      <td>{x.user_id}</td>
                      <td>{x.level}</td>
                      <td>{x.day}</td>
                      <td>{x.attachment? x.attachment : "Empty"}</td>
                      <td>{renderStatus(x.status)}</td>
                      <td>{dateTimeFormat(x.created_at)}</td>
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
                            Preview Request
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
          {modal.mode === "detail" ? <MealDetail/> :<></> }
        </ModalBody>
        {selectItem ?
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
  )
}

export default MealIndex