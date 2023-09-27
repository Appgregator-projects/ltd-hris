import React from 'react'
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, CardTitle, Col,Row, Table,UncontrolledTooltip,Modal,ModalBody,ModalHeader,Button, ModalFooter, Form, Label, Input, FormGroup} from "reactstrap";
import { dateFormat, dateTimeFormat } from '../../../Helper';
import {Eye} from 'react-feather'
import Api from "../../../sevices/Api"
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Controller, useForm } from "react-hook-form";
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../configs/firebase';
const MySwal = withReactContent(Swal)

const OvertimeRequest = () => {
    const user = auth.currentUser
    const [overtime, setOvertime] = useState([])
    const [dataUser, setDataUser] = useState(null)
    const [toggleModal, setToggleModal] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    //**State filtering */
    const [filterStatus, setFilterStatus] = useState("")
    const [filteredOvertime, setFilteredOvertime] = useState(overtime)
    
    const {
      setValue, control, handleSubmit, formState: {errors}
    } = useForm({ mode: "onChange"});
    
    const getOvertime = async () => {
      let arr = []
      const fetchData = await getDocs(collection(db,'overtimes'))
      fetchData.forEach((doc) => {
        const data = doc.data()
        arr.push({...data, id:doc.id})
        setOvertime(arr)
      })
    }
    useEffect(() => {
      getOvertime()
    }, [])

    console.log(overtime,'ceks')
    const onDetail = (arg) => {
      setSelectItem(arg)
      setToggleModal(true)
    }
    
    const handleFilter = (e) => {
      setFilterStatus(e.target.value)
    }

    const filterOvertime = () => {
      if (filterStatus === '') {
        setFilteredOvertime(overtime)
      } else {
        const filtered = overtime.filter((x) => x.status === filterStatus);
        setFilteredOvertime(filtered);
      }
    };

    useEffect(() => {
      filterOvertime();
    }, [filterStatus, overtime]);
  

    const onApprove = (select) => {
      console.log('approve', select)
      return MySwal.fire({
        icon: 'info',
        title: 'Do you want to approve this request?',
        showDenyButton: true,
        confirmButtonText: 'Approve',
        denyButtonText: `Cancel`,
        customClass: {
          confirmButton: 'btn btn-primary me-1',
          denyButton: 'btn btn-danger me-1',
          title: "fs-13"
        }
      }).then(async(result) => {
        if (result.isConfirmed) {
          const data = await doc(db,'overtimes',`${select.id}`)
          await updateDoc(data, {
            status:'approved'
          })
        }
        setToggleModal(false)
        getOvertime()
      })
    }

    const onReject = (select) => {
      console.log('reject', select)
      return MySwal.fire({
        icon: 'info',
        title: 'Do you want to reject this request?',
        showDenyButton: true,
        confirmButtonText: 'Reject',
        denyButtonText: `Cancel`,
        customClass: {
          confirmButton: 'btn btn-primary me-1',
          denyButton: 'btn btn-danger me-1',
          title: "fs-13"
        }
      }).then(async(result) => {
        if (result.isConfirmed) {
          const data = await doc(db,'overtimes',`${select.id}`)
          await updateDoc(data, {
            status:'rejected'
          })
        }
        setToggleModal(false)
        getOvertime()
      })
    }
    const getDataUser = async () => {
      try {
        const data = await Api.get(`/hris/employee/${user.uid}`)
        setDataUser(data)
        console.log(data)
      } catch (error) {
        throw(error)
      }
    }
    useEffect(() => {
      getDataUser()
    },[])


    const onSubmitForm = async (payload) => {
      console.log(payload,'aaa')
      if (dataUser.id === dataUser.division.manager_id) {
        const newData = {
          approvals:[{id:'xxx', name:'hr'}],
          approved_hr:null,
          company_id: dataUser.company_id,
          date: payload.date,
          duration: payload.duration,
          employee: dataUser.name,
          manager_id:dataUser.division.manager_id,
          status:'process',
          createdAt: serverTimestamp(),
          division_id: dataUser.division_id,

        }
        const set = await addDoc(collection(db,"overtimes"), newData)
        console.log(set.id,'ini manager')
      } else {
        const newDatas = {
          approvals:[{id:'xxx', name:'hr'}, {id:dataUser.division.manager_id, name:'manager'}],
          approved_hr:null,
          approved_manager:null,
          company_id: dataUser.company_id,
          date: payload.date,
          duration: payload.duration,
          employee: dataUser.name,
          manager_id:dataUser.division.manager_id,
          status:'waiting',
          createdAt: serverTimestamp(),
          division_id: dataUser.division_id,
        }
        const set = await addDoc(collection(db,"overtimes"), newDatas)
        console.log(set.id,'ini user biasa')
      }
    }
  
    const renderStatus = (arg) => {
      if(arg.status === 'waiting') return <Badge color="light-warning">Waiting</Badge>
      if(arg.status === 'approved') return <Badge color="light-success">Approved</Badge>
      if(arg.status === 'rejected') return <Badge color="light-danger">Rejected</Badge>
      return <Badge color="light-info">Processed</Badge>
    }
  
    return(
      <>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Overtime Request</CardTitle>
                <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                  <Label className="me-1 w-50" for="filtering">Filter status</Label>
                  <Input
                  type="select"
                  id="filter-by-sttus"
                  value={filterStatus}
                  onChange={handleFilter}
                  >
                    <option value="">All</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="process">Processed</option>
                    <option value="waiting">Waiting</option>
                  </Input>
                </Col>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr className='text-xs'>
                      <th className='fs-6'>Employee</th>
                      <th className='fs-6'>Date</th>
                      <th className='fs-6'>Overtime Duration</th>
                      <th className='fs-6'>Status</th>
                      <th className='fs-6'>Created At</th>
                      <th className='fs-6'>
                        <Col className="d-flex justify-content-between">
                        Action
                        
                        </Col>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!filteredOvertime.approved_manager ? 
                    <>
                      {
                      filteredOvertime?.map((x,index) => (
                        <tr key={x.id}>
                          <td>{x?.employee}</td>
                          <td>{dateFormat(x.date)}</td>
                          <td>{x.duration} Hours</td>
                          <td>
                            {renderStatus(x)}
                          </td>
                          <td>{dateTimeFormat(x.createdAt)}</td>
                          <td>
                            <div className='column-action d-flex align-items-center d-flex justify-content-center'>
                              <div className='text-body pointer' onClick={() => onDetail(x)} id={`pw-tooltip-${x.id}`}>
                                <Eye size={17} className='mx-1' />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                    </> : <></>}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
                <CardHeader>
                  <CardTitle>Overtime Request to Manager</CardTitle>
                  <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                    <Label className="me-1 w-50" for="filtering">Filter status</Label>
                    <Input
                    type="select"
                    id="filter-by-sttus"
                    value={filterStatus}
                    onChange={handleFilter}
                    >
                      <option value="">All</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="process">Processed</option>
                      <option value="waiting">Waiting</option>
                    </Input>
                  </Col>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr className='text-xs'>
                        <th className='fs-6'>Employee</th>
                        <th className='fs-6'>Date</th>
                        <th className='fs-6'>Overtime Duration</th>
                        <th className='fs-6'>Status</th>
                        <th className='fs-6'>Created At</th>
                        <th className='fs-6'>
                          <Col className="d-flex justify-content-between">
                          Action
                          </Col>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filteredOvertime?.map((x,index) => (
                          <tr key={index}>
                            <td>{x?.employee}</td>
                            <td>{dateFormat(x.date)}</td>
                            <td>{x.duration} Hours</td>
                            <td>
                              {renderStatus(x)}
                            </td>
                            <td>{dateTimeFormat(x.createdAt)}</td>
                            <td>
                              <div className='column-action d-flex align-items-center d-flex justify-content-center'>
                                <div className='text-body pointer' onClick={() => onDetail(x)} id={`pw-tooltip-${x.id}`}>
                                  <Eye size={17} className='mx-1' />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </CardBody>
            </Card>
            <Card>
              <CardHeader>
              <CardTitle>Form Pengajuan Lembur</CardTitle>
              </CardHeader>
              <CardBody>
              <Form onSubmit={handleSubmit(onSubmitForm)}>
              <Row>
                <Col md="12" sm="12" className="mb-1">
                  <Label className="form-label" for="date">
                    Date
                  </Label>
                  <Controller
                    name="date"
                    defaultValue={null}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        {...field}
                        name="date"
                        // invalid={errors.name && true}
                      />
                    )}
                  />
                  {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                </Col>
                <Col md="12" sm="12" className="mb-1">
                  <Label className="form-label" for="duration">
                    Duration (hours)
                  </Label>
                  <Controller
                    name="duration"
                    defaultValue={null}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        name="duration"
                        // invalid={errors.name && true}
                      />
                    )}
                  />
                  {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                </Col>
                <Col>
                  <Button type="submit" size="md" color="primary" className="m-1">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
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
                Overtime Request Detail
            </ModalHeader>
            <ModalBody>
              {
                selectItem ? 
                  <>
                    <ul className="list-none padding-none">
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Employee Name</span>
                        <span className="capitalize">{selectItem.employee}</span>
                      </li>
                      
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Created At</span>
                        <span>{dateFormat(selectItem.createdAt)}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Date</span>
                        <span>{dateTimeFormat(selectItem.date)}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Overtime Duration</span>
                        <span>{selectItem.duration}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Current Status</span>
                        <span>{selectItem.status ? selectItem.status : " "}</span>
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
                  <Button type="button" size="md" color='danger' onClick={() => onReject(selectItem)}>  
                    Reject
                  </Button>
                  <Button type="submit" size="md" color='primary' className="m-1" onClick={() => onApprove(selectItem)}>Approve</Button>
                </div> : <></>
              }
            </ModalFooter>
        </Modal>
      </>
    )
}

export default OvertimeRequest