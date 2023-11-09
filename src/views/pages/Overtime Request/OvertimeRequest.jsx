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
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../configs/firebase';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import FormUserAssign from '../Components/FormUserAssign';
import { getCollectionFirebase, getCollectionFirebaseV2 } from '../../../sevices/FirebaseApi';
const MySwal = withReactContent(Swal)
const animatedComponents = makeAnimated()

const OvertimeRequest = () => {
    const user = auth.currentUser
    const [users, setUsers] = useState([])
    const [overtime, setOvertime] = useState([])
    const [dataUser, setDataUser] = useState()
    const [toggleModal, setToggleModal] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    const [selectItem2, setSelectItem2] = useState(null)
    /*State filtering */
    const [filterStatus, setFilterStatus] = useState("")
    const [filterUser, setFilterUser] = useState("")
    const [filterDate, setFilterDate] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [selectedDate, setSelectedDate] = useState("");
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 10 

    const {
      setValue, control, handleSubmit, formState: {errors}
    } = useForm({ mode: "onChange"});

    const getDataUser = async () => {
      try {
        const {status,data} = await Api.get(`/hris/employee/${user?.uid}`)
        if(status){
          setDataUser(data)
        }
      } catch (error) {
        console.log(error.message)
        toast.error(`Error : ${error.message}`, {
          position: "top-center",
      });
      }
    }

    const fetchUser = async () => {
      try {
        const data = await Api.get(`/hris/employee?no_paginate=true`)
        if (data) {
          const userData = data.map((x) => {
            return {
              value: x.id,
              label: x.email
            }
          })
          setUsers([...userData])
        }
      } catch (error) {
        throw error
      }
    }
    useEffect(() => {
      fetchUser()
      getDataUser()
    },[])

    
    const getOvertime = async() => {
      const conditions = []
      if (filterStatus !== '') {
        console.log({filterStatus})
        conditions.push({field: 'status', operator: '==', value:filterStatus})
      }
      if (selectedUsers.length > 0) {
        conditions.push({field: 'employee_id', operator: '==', value:selectedUsers[0]})
      }
      if (startDate !== '' || endDate !== '') {
        conditions.push({field: 'date', operator: '>=', value: startDate})
        conditions.push({field: 'date', operator: '<=', value: endDate})
      }
      if (dataUser?.title === "Manager") {
        conditions.push({field: 'division_id', operator: '==', value:dataUser?.division_id})
      }

      const sortBy = {field: "date", direction: "desc"}
      const limitValue = startIndex + itemsPerPage
      try {
      const res = await getCollectionFirebaseV2('overtimes', 
      conditions,
      sortBy,
      limitValue,
      )
      if(res){
        const filterData =  res.filter((x) => x.employee_id && x.employee)
        setOvertime(filterData)
        console.log(filterData, "res")
      }
      } catch (error) {
        console.log(error.message)
        toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
      }
    }

    const handleLoadMore = () => {
      setStartIndex(prev => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
    };

    // useEffect(() => {
    //   getDataUser()
    // },[])

    useEffect(() => {
      getOvertime()
    }, [filterStatus,selectedUsers, startDate, endDate, dataUser, startIndex])


    const onDetail = (arg) => {
      setSelectItem(arg)
      setToggleModal(true)
    }

    const onDetail2 = (arg) => {
      setSelectItem2(arg)
      setToggleModal(true)
    }

    const handleFilter = (e) => {
      setFilterStatus(e.target.value)
    }

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

    const onProcess = (select) => {
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
            status:'processed'
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
    
    const onSubmitForm = async (payload) => {
      console.log(payload,'aaa')
      if (dataUser?.id === dataUser?.division?.manager_id) {
        const newData = {
          approvals:[{id:'xxx', name:'hr'}],
          approved_hr:null,
          company_id: dataUser?.company_id,
          date: payload.date,
          duration: payload.duration,
          employee: dataUser?.name,
          employee_id:user.uid,
          manager_id:dataUser?.division?.manager_id,
          status:'process',
          createdAt: serverTimestamp(),
          division_id: dataUser?.division_id,

        }
        const set = await addDoc(collection(db,"overtimes"), newData)
      } else {
        const newDatas = {
          approvals:[{id:'xxx', name:'hr'}, {id:dataUser?.division?.manager_id, name:'manager'}],
          approved_hr:null,
          approved_manager:null,
          company_id: dataUser?.company_id,
          date: payload.date,
          duration: payload.duration,
          employee: dataUser?.name,
          employee_id:user.uid,
          manager_id:dataUser?.division?.manager_id,
          status:'waiting',
          createdAt: serverTimestamp(),
          division_id: dataUser?.division_id,
        }
        const set = await addDoc(collection(db,"overtimes"), newDatas)
        console.log(set.id,'ini user biasa')
      }
      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
      getOvertime()
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    }

    
    const totalDuration = overtime?.reduce((total, item) => {
      if (item.duration) {
        // Mengubah string duration menjadi angka dan menambahkannya ke total
        total += parseInt(item.duration);
      }
      return total;
    }, 0)

    const renderStatus = (arg) => {
      if(arg.status === 'waiting') return <Badge color="light-warning">Waiting</Badge>
      if(arg.status === 'approved') return <Badge color="light-success">Approved</Badge>
      if(arg.status === 'rejected') return <Badge color="light-danger">Rejected</Badge>
      return <Badge color="light-info">Processed</Badge>
    }

    return(
      <>
        <Row>
          {dataUser?.role_id === 24 ? 
          <>
          <Col>
            <Card>
              <CardHeader>
                <Col className="px-1 align-items-center justify-content-sm-end mt-sm-0 mt-1">
                  <CardTitle>Overtime Request</CardTitle>
                  {selectedUsers?.length === 0 ? 
                  <></> 
                  : 
                  <Label>Total : {totalDuration} Hours</Label>
                  }
                  </Col>
                <Col className="px-1 align-items-center justify-content-sm-end mt-sm-0 mt-1" >
                </Col>
                <Col className="px-1 align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                <Label className="form-label" for="filtering">Date</Label>
                  <Input
                    type="date"
                    id="filter-by-start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />

                  <Label className="form-label" for="filtering">End Date</Label>
                  <Input
                    type="date"
                    id="filter-by-end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Col>
                
                <Col className="px-1 align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                  <Label className="form-label" for="filtering">Filter status</Label>
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
                  <Label className='form-label' for='amount'>Select User</Label>
                  <Select
                    isDisabled={false}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti={true}
                    options={users}
                    onChange={(selectedOptions) => {
                      const selectedUserIds = selectedOptions.map((option) => option.value);
                      setSelectedUsers(selectedUserIds);
                    }}
                  />
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
                        overtime?.map((x,index) => (
                          <tr key={index}>
                            <td>{x?.employee}</td>
                            <td>{dateFormat(x.date)}</td>
                            <td>{x.duration} Hours</td>
                            <td>
                              {renderStatus(x)}
                            </td>
                            <td>{dateTimeFormat(x.createdAt.seconds * 1000)}</td>
                            <td>
                            
                              <div className='column-action d-flex align-items-center d-flex justify-content-center'>
                              <div className='text-body pointer' onClick={() => onDetail(x)} id={`pw-tooltip-${x.id}`}>
                                <Eye size={17} className='mx-1' />
                                <span className='align-middle'></span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`pw-tooltip-${x.id}`}
                                >
                                  Detail Overtime
                                </UncontrolledTooltip>
                              </div>
                            </div>
                            
                            </td>
                          </tr>
                        ))
                      }
                  </tbody>
                </Table>
                <Col className='d-flex align-items-center justify-content-center py-1'>
                  <Button color='primary' onClick={handleLoadMore}>Load more</Button>
                </Col>
              </CardBody>
            </Card>
          </Col>
          </> : 
          dataUser?.role_id === 36 ? 
          <>
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
                    {!overtime?.approved_manager ? 
                    <>
                      {
                      overtime?.map((x,index) => (
                        <tr key={x.id}>
                          <td>{x?.employee}</td>
                          <td>{dateFormat(x.date)}</td>
                          <td>{x.duration} Hours</td>
                          <td>
                            {renderStatus(x)}
                          </td>
                          <td>{dateTimeFormat(x.createdAt.seconds * 1000)}</td>
                          <td>
                            
                              <div className='column-action d-flex align-items-center d-flex justify-content-center'>
                              <div className='text-body pointer' onClick={() => onDetail2(x)} id={`pw-tooltip-${x.id}`}>
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
          </> : 
          <>
          <Col>
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
                      />
                    )}
                  />
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
                      />
                    )}
                  />
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
          </>}
          

          
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
                : selectItem2 ? 
                <>
                    <ul className="list-none padding-none">
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Employee Name</span>
                        <span className="capitalize">{selectItem2.employee}</span>
                      </li>
                      
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Created At</span>
                        <span>{dateFormat(selectItem2.createdAt)}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Date</span>
                        <span>{dateTimeFormat(selectItem2.date)}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Overtime Duration</span>
                        <span>{selectItem2.duration}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Current Status</span>
                        <span>{selectItem2.status ? selectItem2.status : " "}</span>
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
                  </> :''
              }
            </ModalBody>
            <ModalFooter>
              {
                selectItem ? 
                
                <div className="">
                  {selectItem.status === 'processed' ? 
                  <>
                  <Button type="button" size="md" color='danger' onClick={() => onReject(selectItem)}>  
                    Reject
                  </Button>
                  <Button type="submit" size="md" color='primary' className="m-1" onClick={() => onApprove(selectItem)}>Approve</Button>
                  </> : <></>}
                  
                </div> : selectItem2? 
                <div className="">
                  {selectItem2.status === 'waiting' ? 
                  <>
                  <Button type="button" size="md" color='danger' onClick={() => onReject(selectItem2)}>  
                  Reject
                </Button>
                <Button type="submit" size="md" color='primary' className="m-1" onClick={() => onProcess(selectItem2)}>Approve</Button>
                  </> : <></>}
                
              </div> :''
              }
            </ModalFooter>
        </Modal>
      </>
    )
}

export default OvertimeRequest