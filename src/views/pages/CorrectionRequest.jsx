import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { 
  Badge, Card, CardBody, CardHeader, CardTitle, Col,Row, Table,UncontrolledTooltip,
  Modal,ModalBody,ModalHeader,Button, ModalFooter, Form, Label, Input, FormGroup
} from "reactstrap";
// import api from '../../plugins/api'
import {dateFormat,dateTimeFormat} from '../../Helper/index'
import {
  Check,
  Edit,
  Eye,
  X
} from 'react-feather'
import Api from "../../sevices/Api";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Controller, useForm } from "react-hook-form";
const MySwal = withReactContent(Swal)

export default function CorrectionIndex(){
  
  const [corrections, setCorrection] = useState([])
  const [users, setUsers] = useState([])
  const [selectCheck, setSelectCheck] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [toggleModal, setToggleModal] = useState(false)
  const [nestedToggle, setNestedToggle] = useState(false)
  const [selectItem, setSelectItem] = useState(null)
  
  //**State filtering */
  const [filterStatus, setFilterStatus] = useState("")
  const [searchStatus, setSearchStatus] = useState('')
  
  const {
    setValue, control, handleSubmit, formState: {errors}
  } = useForm({ mode: "onChange"});
  // console.log(errors, "error");

  const fetchCorrection = async() => {
    try {
      const {status,data} = await Api.get('/hris/correction')
      if(status){
        const filterData = data.filter((x) => filterStatus !== "Requested"?  
        x.current_status === filterStatus : x.current_status === null)
        if(filterStatus === ""){
          setCorrection([...data])
        } else{
          if(data){
            const updateDatFilter =  filterData.map((x) => {
              return {
                id : x.id,
                clock_in : x.clock_in,
                clock_out : x.clock_out,
                current_status : x.current_status,
                periode: x.periode,
                rejected_note: x.rejected_note,
                user_id : x.user_id,
                users : x.users,
                is_check : false,
                createdAt : x.createdAt,
                updateAt :  x.updateAt
              }
            })
            setCorrection(updateDatFilter)
          }
        }
      }
    } catch (error) {
      throw error
    }
  }
  useEffect(() => {
    fetchCorrection()
  },[filterStatus])

  const onDetail = (arg) => {
    console.log(arg, "arg on detail")
    setSelectItem(arg)
    setToggleModal(true)
  }

  const onReject = (arg) => {
    console.log(arg, "Rejected");
    setNestedToggle(true)
    return onSubmit(arg, "Rejected")
  };

  const onApproval = () => {
    console.log("Approved");
    return onSubmit(null,"Approved")
  };

  const onCloseAll = () => {  
    setNestedToggle(!nestedToggle)
    setCloseAll(true)
  }
  
  const handleFilter = (e) => {
    setFilterStatus(e.target.value)
  }

  const handleSelectAll = () => {
    const toggleAll =!selectAll;
    const updatedData = corrections.map((x) => ({...x, is_check : toggleAll}));
    console.log(updatedData,"chacked all")
    setCorrection(updatedData)
    setSelectAll(toggleAll)
    return console.log(toggleAll,"toggleAll")
  }
  
  const handleCheckChange = (params) => {
    console.log(params, "checked item")
    const updatedData = corrections.map((x) => 
      x.id === params.id? {...x, is_check : !x.is_check} : x
    );
    setCorrection(updatedData);
    setSelectAll(updatedData.every((item) => item.is_check))
  }

  const onProceed = () => {
    console.log("it works")
    return MySwal.fire({
      icon: 'info',
      title: 'Do you want to proceed correction at the same time?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: `Reject`,
      customClass: {
        confirmButton: 'btn btn-primary me-1',
        denyButton: 'btn btn-danger me-1',
        title: "fs-13"
      }
    }).then((result) => {
      let newArr = [];
      const correctionsFilter = corrections.filter((x) => x.is_check == true);
      correctionsFilter.forEach((x) => {newArr.push(x.id)})
      console.log(newArr, "hahah")
      if (result.isConfirmed) {
        return onSubmitAll(newArr,"Approved")
      } else if (result.isDenied) {
        return onRejectAll(newArr, "Rejected")
      }
    })
  }
  
  const onSubmitAll = async(x,y) => {
    console.log(x, y, "dfkshdfkj")
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${y} it!`,
      customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const params = {
            current_status: y,
            id : x
          }
          console.log(params,"result")
          const status = await Api.put(`/hris/corrections-check`, params)
          console.log(status, params,  "status submit all correction")
          if(!status) return toast.error(`Error : ${data}`, {
            position: 'top-center'
          }) 
          fetchCorrection()
          toast.success(status, {
            position: 'top-center'
          })
          setToggleModal(false)
    
        } catch (error) {
          setToggleModal(false)
          toast.error(`Error : ${error.message}`, {
            position: 'top-center'
          })
          throw error
        }
      }
    })
  }

  const onRejectAll = async(x,y) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${y} it!`,
      customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const params = {
            current_status: y,
            id : x
          }
          const status = await Api.put(`/hris/corrections-check`, params)
          console.log(status, params,  "status reject all correction")
          if(!status) return toast.error(`Error : ${data}`, {
            position: 'top-center'
          }) 
          fetchCorrection()
          toast.success(status, {
            position: 'top-center'
          })
          setToggleModal(false)
    
        } catch (error) {
          setToggleModal(false)
          toast.error(`Error : ${error.message}`, {
            position: 'top-center'
          })
          throw error
        }
      }
    })
  }

  const onSubmit = async(arg , param) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${param} it!`,
      customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false 
    }).then(async (result) => {
      if (result.value) {
        try {
          const params = {
            current_status:param,
            note: arg? arg.rejected_note : " "
          }
          const status = await Api.put(`/hris/correction/${selectItem.id}`, params)
          console.log(status, params,  "status post correction")
          if(!status) return toast.error(`Error : ${data}`, {
            position: 'top-center'
          }) 
          fetchCorrection()
          toast.success(status, {
            position: 'top-center'
          })
          setToggleModal(false)
    
        } catch (error) {
          setToggleModal(false)
          toast.error(`Error : ${error.message}`, {
            position: 'top-center'
          })
          throw error
        }
      }
    })
  }

  const renderStatus = (arg) => {
    if(!arg.current_status) return <Badge color="light-warning">Requested</Badge>
    if(arg.current_status === 'Approved') return <Badge color="light-success">Approved</Badge>
    if(arg.current_status === 'Rejected') return <Badge color="light-danger">Rejected</Badge>
    return <Badge color="light-info">Processed</Badge>
  }

  return(
    <>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Correction Request</CardTitle>
              <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                <Label className="me-1 w-50" for="filtering">Filter status</Label>
                <Input
                type="select"
                id="filter-by-sttus"
                value={filterStatus}
                onChange={handleFilter}
                >
                  <option value="">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="approved">Processed</option>
                  <option value="Requested">Requested</option>
                </Input>
              </Col>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead>
                  <tr className='text-xs'>
                    <th className='fs-6'>Employee</th>
                    <th className='fs-6'>Date</th>
                    <th className='fs-6'>Clock time</th>
                    <th className='fs-6'>Status</th>
                    <th className='fs-6'>Created At</th>
                    <th className='fs-6'>
                      <Col className="d-flex justify-content-between">
                      Action
                      {filterStatus === "Requested" ?
                        <Form className="d-flex justify-content-between">
                          <Button.Ripple size="sm" color="primary" onClick={handleSelectAll}>
                            {selectAll? <X size={11}/> :  <Check size={11}/>}
                            
                          </Button.Ripple>
                          <Button size="sm" color="warning" className="ms-1" onClick={onProceed}> Proceed </Button>
                        </Form>
                        : <></>
                      }
                      </Col>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    corrections.map((x,index) => (
                      <tr key={x.id}>
                        <td>{x?.users? x.users.name : "-"}</td>
                        <td>{dateFormat(x.clock_in)}</td>
                        <td>{dayjs(x.clock_in).format('HH:mm')} | { dayjs(x.clock_out).format('HH:mm')}</td>
                        <td>
                          {renderStatus(x)}
                        </td>
                        <td>{dateTimeFormat(x.createdAt)}</td>
                        <td>
                          <div className='column-action d-flex align-items-center d-flex justify-content-center'>
                            <div className='text-body pointer' onClick={() => onDetail(x)} id={`pw-tooltip-${x.id}`}>
                              <Eye size={17} className='mx-1' />
                            </div>
                            {filterStatus === "Requested" ?
                            <div className="form-check">
                              <Form>
                              <Input
                              type="checkbox"
                              checked={x.is_check}
                              onChange={() => handleCheckChange(x)}
                              ></Input>
                              </Form>
                            </div> : <></>
                            }
                          </div>
                        </td>
                      </tr>
                    ))
                  }
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
            {
              selectItem ? 
                <>
                  <ul className="list-none padding-none">
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Employee Name</span>
                      <span className="capitalize">{selectItem.users.name}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Employee Email</span>
                      <span>{selectItem.users.email}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Created At</span>
                      <span>{dateFormat(selectItem.createdAt)}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Current Status</span>
                      <span>{selectItem.current_status ? selectItem.current_status : " "}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Correction Date</span>
                      <span>{dateFormat(selectItem.clock_in)}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Clock in</span>
                      <span>{dayjs(selectItem.clock_in).format('HH:mm')}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Clock out</span>
                      <span>{dayjs(selectItem.clock_out).format('HH:mm')}</span>
                    </li>
                    {/* <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Attachment</span>
                      <span>
                        <Link to={selectItem.image} target="_blank">attachment</Link>
                      </span>
                    </li> */}
                    {/* <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Reason</span>
                      <span>{selectItem.reason}</span>
                    </li> */}
                </ul>
                </>
              : <></>
            }
          </ModalBody>
          <ModalFooter>
            {
              selectItem ? 
              <div className="">
                <Button type="button" size="md" color='danger' disabled={!!selectItem.current_status} onClick={() => setNestedToggle(!nestedToggle)}>
                <Modal
                    isOpen={nestedToggle}
                    toggle={onReject}
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
                <Button type="submit" size="md" color='primary' disabled={!!selectItem.current_status} className="m-1" onClick={() => onApproval()}>Approve</Button>
              </div> : <></>
            }
          </ModalFooter>
      </Modal>
    </>
  )
}