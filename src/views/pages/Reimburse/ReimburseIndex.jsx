import React, { useEffect, useState } from 'react'
import { Check, CheckCircle, ChevronDown, CloudOff, Eye } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import Api from "../../../sevices/Api"
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import FormUserAssign from '../Components/FormUserAssign'
import SingleAvatarGroup from '../../../@core/components/single-avatar-group'
import FormProjectSelect from './component/FormProjectSelect'
import AvatarGroup from './component/AvatarGroup'
import ReimburseDetail from './ReimburseDetail'
import dayjs from 'dayjs'
import FormPeriodeSelect from './component/FormPeriodeSelect'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { dateTimeFormat } from '../../../Helper'
import { addDocumentFirebase, getCollectionFirebase, setDocumentFirebase } from '../../../sevices/FirebaseApi'
const MySwal = withReactContent(Swal);


const ReimburseIndex = () => {
  const [reimburse, setReimburse] = useState([])
  const [attendance, setAttendance] = useState([])
  const [periode, setPeriode] = useState([])
  const [leave, setLeave] = useState([])
  const [list, setList] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [nestedToggle, setNestedToggle] = useState(false)
  const [selectProject, setSelectProject] = useState(null)
  const [daysOff, setDaysOff] = useState([])
  const [selectPeriode, setSelectPeriode] = useState(null)
  const [closeAll, setCloseAll] = useState(false)
  const [selectItem, setSelectItem] = useState(null)
  const [modal, setModal] = useState({
    title: "",
    mode: "",
    item: null
  })

  console.log(selectProject, "selectprojet")

  const {
    setValue, control, handleSubmit, formState: { errors }
  } = useForm({ mode: "onChange" });
  console.log(errors, "error");

  const fetchList = async () => {
    try {
      const data = await Api.get(`/api/v1/crm/project-number/all`)
      if (data) {
        const listDeals = data.map((x) => {
          return {
            value: x.id,
            label: x.number
          }
        })
        setList(listDeals)
        return listDeals
      }
    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const setFilter = (item) => {
    console.log(attendance, item, "item")
    const filterAttendance = attendance.map(x => {
      const findFilter = item?.find(y => y.date == x.periode)
      x.periode = null
      if (findFilter) {
        x.periode = findFilter ? findFilter.date : null
      }
      return x
    })
      .filter(x => x.deal_id === selectProject.value && x.periode !== null)
    setLeave([...filterAttendance])
    console.log(attendance, item, "hahahah")
  }

  const fetchDaysOff = async (arg) => {
    return console.log(arg, "data and status")
    try {
      const { status, data } = await Api.get(`/hris/day-off?month=${arg.month}&year=${arg.year}`);
      if (status) {
        const dataDaysOff = data.map(x => {
          const type = x.type === "non_management" ? x.type : null
          if (type) {
            x.date = dayjs(x.date).format('YYYY-MM-DD')
            return x
          }
        })
        .filter((y) => y !== undefined)
        setDaysOff([...dataDaysOff])
        setToggleModal(false)
        setSelectPeriode(arg)
        setFilter(dataDaysOff)
        console.log(dataDaysOff, "arg")
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchDaysOff()
  }, [selectProject])


  const fetchAttendanceNon = async () => {
    try {
      const { status, data } = await Api.get(`/api/v1/crm/attendance-non-management?status=empty`)
      console.log(status, data.data, "jajaj")
      if (status) {
        setAttendance(data.data)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchAttendanceNon()
  }, [selectProject])

  const fetchReimburse = async () => {

    try {
      const { status, data } = await Api.get(`/api/v1/crm/attendance-non-management?status=approval&&level=manager`)
      console.log(status, data.data, "dta reimburse approval")
      if (status) {
        setReimburse(data.data)
      }

    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchReimburse()
  }, [])

  const onSelectProject = () => {
    setModal({
      title: "Select Project",
      mode: "project",
      item: null
    })
    setToggleModal(true)
  }

  const onSelectPeriode = () => {
    setModal({
      title: "Select Periode",
      mode: "periode",
      item: null
    })
    setToggleModal(true)
  }

  const onDetail = (item, index) => {
    setModal({
      title: "Detail Reimburse",
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
    return onSubmit("", selectItem, "approve")
  };

  const onCloseAll = () => {
    setNestedToggle(!nestedToggle)
    setCloseAll(true)
  }

  const onSubmit = async (comment, items, arg) => {
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
          // return console.log(comment, items, arg, "damn" )

          const itemPost = {
            status: arg,
            note: comment.rejected_note ? comment.rejected_note : " ",
            attendance_non_management_id  : items.id,
            level_uid: items.manager_uid,
            level:items.manager.level !== null ? items.manager.level : arg
          };
          const itemPut = {
            leaveReimburseId: items.id,
            status: arg
          }
          const { status, message,  data } = await Api.post(`/api/v1/crm/attendance-non-management-approval`, itemPost);
          console.log(itemPost, status, message, data, "put leave reimburse")
          if (!status)
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
          throw error;
        }
      }
    });
  };

  const onSubmitFirebase = async (note, item, status) => {
    let response = ""
    const itemPost = {
      item,
      note,
      status
    }
    console.log(itemPost, "itemPost")
    try {
      response = await addDocumentFirebase(
        "leave_reimburse", itemPost
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
      return <Badge color="light-info">Waiting</Badge>;
    if (arg === "approve")
      return <Badge color="light-success">Approved</Badge>;
    if (arg === "reject")
      return <Badge color="light-danger">Rejected</Badge>;
    return <Badge color="light-warning">Requested</Badge>;
  };

  console.log(selectItem, "item")

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardHeader className='w-100'>
              <Row>
                <CardTitle>Leave Reimburse</CardTitle>
                <Col lg="5" sm="12">
                  <div className="mt-1">
                    <Button
                      color="warning"
                      outline
                      className="w-full"
                      onClick={onSelectProject}
                    >
                      {selectProject ? (selectProject.label) : "Select Project"}
                      <ChevronDown size={15} />
                    </Button>
                  </div>
                </Col>
                <Col lg="5" sm="12">
                  <div className="mt-1">
                    <Button
                      color="warning"
                      outline
                      className="w-full"
                      onClick={onSelectPeriode}
                      disabled={selectProject == undefined}
                    >
                      {selectPeriode ? selectPeriode.month + "-" + selectPeriode.year : "Input Periode"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Col>
                {selectProject === null && selectPeriode === null ?
                  reimburse?.map((x, i) => (
                    <Card outline style={{ border: "gray 1px solid" }}>
                      <CardBody>
                        <Col className='d-flex'>
                          <Row className='justify-content w-25 me-3'>
                            <h3 className='w-30'>{dateTimeFormat(x.periode)}</h3>
                            <span> Manager  : {x.manager_uid ? x.manager.name : "-"}</span>
                          </Row>
                          <Col className='d-flex justify-content-between w-75 align-items-center '>
                            <h4>{x.project_number ? x.project_number : "required"}</h4>
                            <div className='d-flex justify-item-center pointer'>
                              {/* <h4>{x.details.length} people</h4> */}
                              <Eye size={20} className='align-item-center' onClick={() => onDetail(x, i)}
                                id={`detail-tooltip-${x.id}`}
                              />
                              <span className='align-middle'></span>
                              <UncontrolledTooltip
                                placement="top"
                                target={`detail-tooltip-${x.id}`}>
                                Detail
                              </UncontrolledTooltip>
                            </div>
                            <Row className='d-flex-column align-items-center'>
                              <h5 className='pointer'>
                                {renderStatus(x.status)}
                              </h5>
                              <h6>{dateTimeFormat(x.createdAt)}</h6>

                            </Row>
                          </Col>

                        </Col>
                      </CardBody>
                    </Card>
                  ))
                  :
                  leave.length !== 0 && leave[0]?.deal_id === selectProject?.value ?
                    leave?.map((x, i) => (
                      <Card outline style={{ border: "gray 1px solid" }}>
                        <CardBody>
                          <Col className='d-flex'>
                            <Row className='justify-content w-25 me-3'>
                              <h3 className='w-30'>{x.periode}</h3>
                              <span> Manager  : {x.manager?.name ? x.manager.name : "-"}</span>
                            </Row>
                            <Col className='d-flex justify-content-between w-75'>
                              <div className=''>
                                {x.details?.map((y, index) => {
                                  return (
                                    <AvatarGroup
                                      key={index}
                                      id={index}
                                      data={y} />
                                  )
                                })}
                              </div>
                              <div className='pointer align-item-center'>
                                <Eye
                                  size={20}
                                  onClick={() => { onDetail(x, i) }}></Eye>
                                <h5>{renderStatus(x.status)}</h5>
                              </div>
                            </Col>

                          </Col>
                        </CardBody>
                      </Card>
                    )) : "There is no data in this periode"}
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}
      >
        <ModalHeader toggle={() => setToggleModal(!toggleModal)} className='mb-0'>
          {modal.title}
        </ModalHeader>
        <ModalBody className='mt-0'>
          {modal.mode === "project" ?
            <FormProjectSelect
              multiple={false}
              list={list}
              label={"Search project number"}
              onSelect={(arg) => {
                setSelectProject(arg); setToggleModal(false); fetchDaysOff(); console.log(arg,"eeeee")
              }}
              disabled={false}
              close={() => setToggleModal(false)}
            /> : <></>}
          {modal.mode === "detail" ?
            <ReimburseDetail
              item={modal.item}
              close={() => setToggleModal(false)} />
            : <></>
          }
          {modal.mode === "periode" ?
            <FormPeriodeSelect submit={fetchDaysOff} /> : <></>}
        </ModalBody>
        {selectItem?.status !== "approve" && selectItem?.status !== "reject" ?
          <ModalFooter>
            {selectItem ? (
              <div className="">
                <Button
                  type="button"
                  size="md"
                  color="danger"
                  onClick={() => setNestedToggle(!nestedToggle)}
                >
                  <Modal
                    isOpen={nestedToggle}
                    toggle={() => onReject(selectItem)}
                    className={`modal-dialog-centered modal-lg`}
                    backdrop={"static"}
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
                          render={({ field }) => (
                            <Input
                              id="rejected_note"
                              {...field}
                              name="rejected_note"
                              type="textarea"
                              invalid={errors.rejected_note && true} />
                          )} />
                        {errors.rejected_note && <FormFeedback>{errors.rejected_note.message}</FormFeedback>}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onClick={() => onCloseAll()}>
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

export default ReimburseIndex