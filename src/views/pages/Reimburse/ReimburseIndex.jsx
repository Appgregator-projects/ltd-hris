import React, { useEffect, useState } from 'react'
import { Check, CheckCircle, ChevronDown, Eye } from 'react-feather'
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
import { setDocumentFirebase } from '../../../sevices/FirebaseApi'
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
  const [selectItem, setSelectItem] = useState([])
  const [modal, setModal] = useState({
    title: "",
    mode : "",
    item : null
  })

  const dataDummy = 
  [
    {
    "project_id" : 12,
    "manager_id" : "Sutannata Putra",
    "periode" : "2023-12-14",
    "details" : 
      [
        {
          "label" : "Axel",
          "image" : "jskfhkfsjhbfk",
          "clock_in" : "12.00",
          "clock_out" : "18.00"
        },
        {
          "label" : "Axel",
          "image" : "jskfhkfsjhbfk",
          "clock_in" : "12.00",
          "clock_out" : "18.00"
        },
        {
          "label" : "Axel",
          "image" : "jskfhkfsjhbfk",
          "clock_in" : "12.00",
          "clock_out" : "18.00"
        },
        {
          "label" : "Axel",
          "image" : "jskfhkfsjhbfk",
          "clock_in" : "12.00",
          "clock_out" : "18.00"
        },
      ]
    
    },
    {
    "project_id" : 12,
    "manager_id" : "Sutannata Putra",
    "periode" : "2023-12-14",
    "details" : 
      [
        {
          "label" : "Axel",
          "image" : "jskfhkfsjhbfk",
          "clock_in" : "12.00",
          "clock_out" : "18.00"
        }
      ]
    
    }
  ]

  const {
    setValue, control, handleSubmit, formState: {errors}
  } = useForm({ mode: "onChange"});
  console.log(errors, "error");

  const fetchList = async() => {
    try {
      const data = await Api.get(`/api/v1/crm/project-number/all`)
      if(data){
        const listDeals = data.map((x) => {
          return {
            value: x.id,
            label : x.number
          }
        })
        setList(listDeals)
        return listDeals
      }
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  useEffect(() =>{
    fetchList()
  }, [])

  const setFilter = (item) => {
    const filterAttendance =  attendance.map(x => {
      const findFilter = item?.find(y => y.date == x.periode)
      x.periode = null
      if(findFilter) {
        x.periode =  findFilter? findFilter.date : null
      }
      return x
    })
    .filter(x => x.deal_id === selectProject.value && x.periode !== null)
    return setLeave(filterAttendance)
  }

  const fetchDaysOff = async (arg) => {
    try {
      const {status,data} = await Api.get(`/hris/day-off?month=${arg.month}&year=${arg.year}`);
      if(status){
        const dataDaysOff = data.map(x => {
          const type = x.type === "non_management" ? x.type : null
          console.log(type, "type")
          if(type){
            x.date = dayjs(x.date).format('YYYY-MM-DD')
            return x
          }
          })
        console.log(dataDaysOff, "dataday")
        setDaysOff([...dataDaysOff])
        setToggleModal(false)
        setSelectPeriode(arg)
        setFilter(dataDaysOff)
      }
    } catch (error) {
      return []
    }
  }


  const fetchAttendanceNon = async () => {
    try {
      const {status, data} = await Api.get(`/api/v1/crm/attendance-non-management`)
      if(status){
        setAttendance(data.data)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchAttendanceNon()
  },[selectProject])

  const fetchReimburse = async () => {
    try {
      const {status, data} = await Api.get(`/hris/leave-reimburse`)
      console.log(status, data, "reimburse")
      if(status) {
        setReimburse(data)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchReimburse()
  },[])

  const onSelectProject = () => {
    setModal({
      title : "Select Project",
      mode : "project",
      item : null
    })
    setSelectItem()
    setToggleModal(true)
  }

  const onSelectPeriode = () => {
    setModal({
      title : "Select Periode",
      mode : "periode",
      item : null
    })
    setToggleModal(true)
  }

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
          const itemPost = {
            user_id: y.manager_uid,
            status: z,
            note: x.rejected_note? x.rejected_note : " ",
            detail_length : y.details.length,
            periode : y.periode,
            project_number : y.project_number ,
            project_id : y.deal_id
          };
          const {status,data} = await Api.post(`/hris/leave-reimburse`,itemPost);
          console.log(itemPost, status,  "put leave request")
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

  const onSubmitFireStore = async() => {
    let response = ""
    try {
      response = await setDocumentFirebase(
        "leaveReimburse", 
      )
    } catch (error) {
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

  console.log(leave, "leave")

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
                      {selectPeriode ? selectPeriode.month+"-"+selectPeriode.year : "Input Periode"}
                    </Button>
                  </div>
              </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Col>
              { selectProject === null && selectPeriode === null? 
              reimburse?.map((x,i) => (
                <Card outline style={{border :"gray 1px solid"}}>
                  <CardBody>
                    <Col className='d-flex'>
                      <Row className='justify-content w-25 me-3'>
                        <h3 className='w-30'>{dateTimeFormat(x.periode)}</h3>
                        <span> Manager  : {x.users.name}</span>
                      </Row>
                      <Col className='d-flex justify-content-between w-75 align-items-center '> 
                        <h4>{x.project_number}</h4>
                        <h4>{x.detail_length} people</h4>
                        <h5 className='pointer'>
                          {renderStatus(x.status)}
                        </h5>
                      </Col>
    
                    </Col>
                  </CardBody>
                </Card>
              ))
              :
              leave.length !== 0? 
              leave?.map((x, i) => (
                <Card outline style={{border :"gray 1px solid"}}>
                  <CardBody>
                    <Col className='d-flex'>
                      <Row className='justify-content w-25 me-3'>
                        <h3 className='w-30'>{x.periode}</h3>
                        <span> Manager  : {x.manager.name}</span>
                      </Row>
                      <Col className='d-flex justify-content-between w-75'>
                        <div className=''>
                        {x.details?.map((y,index) => {
                          return (
                            <AvatarGroup
                              key={index}
                              id={index}
                              data={y}/>
                          )
                          })}
                        </div>
                        <div className='pointer'>
                        <Eye
                         size={20}
                         onClick={() => {onDetail(x, i)}}></Eye>
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
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}  className='mb-0'>
          {modal.title}
        </ModalHeader>
        <ModalBody className='mt-0'>
          {modal.mode === "project"? 
            <FormProjectSelect 
            multiple={false}
            list={list} 
            label={"Search project number"} 
            onSelect={(arg) => {
              setSelectProject(arg) ; setToggleModal(false) ; fetchDaysOff()
            }}
            disabled={false}
            close={() => setToggleModal(false)}
            /> : <></>}
          {modal.mode === "detail" ?
            <ReimburseDetail
            item = {modal.item}
            close = {() => setToggleModal(false)}/> 
            : <></>
            }
          {modal.mode === "periode" ? 
          <FormPeriodeSelect submit= {fetchDaysOff}/> : <></>}
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

export default ReimburseIndex