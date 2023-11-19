import React from 'react'
import { useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import toast from 'react-hot-toast'
import WorkingForm from './WorkingForm'
import Api from '../../../sevices/Api'
import { useEffect } from 'react'
import { addDocumentFirebase, arrayUnionFirebase, getCollectionFirebase, setDocumentFirebase, updateDocumentFirebase } from '../../../sevices/FirebaseApi'
import { Fragment } from 'react'
import { Edit, Plus, Search, Trash } from 'react-feather'
import FormUserAssign from '../Components/FormUserAssign'
import WorkingDetail from './WorkingDetail'

const WorkingIndex = () => {
  const [working, setWorking] = useState([])
  const [userAssign, setUserAssign] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [users, setUsers] = useState([])
  const [userSelect, setUserSelect] = useState([])
  const [alluser, setAllUser] = useState(false);
  const [modal, setModal] = useState({
    title: 'Leave Form',
    mode: 'add',
    item: null
  })

  const fetchWorkhours = async () => {
    try {
      const getData = await getCollectionFirebase("work_hours")
      if (getData) {
        setWorking(getData)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchWorkhours()
  }, [])

  const fetchUserAssign = async (item) => {
    console.log(item.id, "ini dia")
    try {
      const getData = await getCollectionFirebase(`work_hours/${item.id}/employees`)
      if (getData) {
        setUserAssign(getData)
      }
      console.log(getData, "getData")
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchUserAssign()
  }, [modal.item])

  const fetchUser = async () => {
    try {
      const data = await Api.get(`hris/employee?no_paginate=true`)
      if (data) {
        const userData = data.map(x => {
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
  }, [])

  const onAdd = () => {
    setModal({
      title: 'Add Working Hours',
      mode: 'add',
      item: null
    })
    setToggleModal(true)
  }

  const onEdit = (item) => {
    setModal({
      title: "Edit Working Hours",
      mode: "edit",
      item: item,
    });
    setToggleModal(true);
  };

  const onDetail = (item) => {
    setModal({
      title: "Detail " + item.name + " Department",
      mode: "detail",
      item: item
    })
    setToggleModal(true)
    console.log(userAssign[0], "userAssign")
  }

  const onEmployee = (item) => {
    setModal({
      title: "Add Employee",
      mode: "employee",
      item: item
    })
    console.log(item, "item employee")
    setToggleModal(true)
  }

  const onSubmit = async (params) => {
    const itemPost = {
      name: params.name,
      type: params.type,
      productive_minutes: params.productive_minutes,
      details: {
        productive_days: params.productive,
        productive_detail: params.productive_detail,
        off_days: params.off,
        off_detail: params.off_detail,
      }
    }
    let response = ""
    try {
      if (modal.item) return postUpdate(params);
      response = await addDocumentFirebase("work_hours", itemPost)
      if (!response)
        return toast.error(`Error : ${params.name}`, {
          position: "top-center",
        });
      fetchWorkhours();
      toast.success("New work hours: " + params.name + "has been added", {
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

  const updateUser = async (item, itemPatch) => {
    let response = ""
    let resArray = ""
    const assign = userAssign[0].id
    const obj1 = itemPatch.employee
    const obj2 = userAssign[0].employee
    // return console.log(item, itemPatch, userAssign,"patch")

    const gabungObjekTanpaDuplikat = (obj1, obj2) => {
      const hasil = [...obj1];
      obj2.forEach((obj2Item) => {
        if (!obj1.some((obj1Item) => obj1Item.id === obj2Item.id)) {
          hasil.push(obj2Item);
        }
      });
      return hasil;
    };

    const hasilGabungan = gabungObjekTanpaDuplikat(obj1, obj2);
    const itemPut = {
      is_all: itemPatch.is_all,
      employee: hasilGabungan
    }
    try {
      const promises = params.map(async (arg) => {
        const setRef = await setDocumentFirebase(`work_hours/${item.id}/employees`, arg);
        const UpdateRef = await updateDocumentFirebase(`work_hours`, `${item.id}`, 'employees', arg);
        return { setRef, UpdateRef };
      });
      response = await setDocumentFirebase(`work_hours/${item.id}/employees`, assign, hasilGabungan)
      resArray = await updateDocumentFirebase(`work_hours`, `${item.id}`, "employees", itemPut)
      if (!response)
        return toast.error(`Error : ${response}`, {
          position: 'top-center'
        })
      fetchWorkhours()
      toast.success(`Employee has been assign to ${item.name} work hours`, {
        position: 'top-center'
      })
      setToggleModal(false)
    } catch (error) {
      return toast.error(`Error : ${error.message}`, {
        position: 'top-center'
      })
    }
  }

  const assignUser = async (item) => {
    const params = userSelect.map(x => {
      return (
        {
          id: x.value,
          name: x.label
        }
      )
    })
    const itemPatch = {
      employee: params.length ? params : ['all'],
      is_all: alluser
    }

    try {
      // const { status, data } = await Api.patch(`/hris/office/${modal.item.id}/assign-user`, itemPatch)
      if (userAssign.length) return updateUser(item, itemPatch)
      const promises = params.map(async (arg) => {
        const addRef = await addDocumentFirebase(`work_hours/${item.id}/employees`, arg);
        const unionRef = await arrayUnionFirebase(`work_hours`, `${item.id}`, 'employees', arg);
        return { addRef, unionRef };
      });
      const response = Promise.all(promises)
      
      if (!response)
        return toast.error(`Error : ${response}`, {
          position: 'top-center'
        })
      fetchWorkhours()
      toast.success(`Employee has been assign to ${item.name} work hours`, {
        position: 'top-center'
      })
      setToggleModal(false)
    } catch (error) {
      return toast.error(`Error : ${error.message}`, {
        position: 'top-center'
      })
    }
  }

  return (
    <>
      <Row className='d-flex justify-content-between'>
        <Col lg='2' sm='12' className='mb-1'>
          <Fragment>
            <Button.Ripple size="sm" color='warning' onClick={onAdd}>
              <Plus size={14} />
              <span className='align-middle ms-25'>Add Working Hours</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle>Working Management</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className='text-xs'>
                  <th className='fs-6'>Name</th>
                  <th className='fs-6'>Type</th>
                  <th className='fs-6'>Working Days</th>
                  <th className='fs-6'>Working Hours Detail</th>
                  <th className='fs-6'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  working?.map((x, index) => {
                    return (
                      <tr key={x.id}>
                        <td className='pointer' onClick={() => { onDetail(x); fetchUserAssign(x) }}>{x.name}</td>
                        <td>{x.type}</td>
                        <td>
                          <Row>
                            {x.details?.productive_days} days productive
                          </Row>
                          <Row>
                            {x.details?.off_days} days off
                          </Row>
                        </td>
                        <td>
                          <Row>
                            <Badge color='success'>
                              {x.details.productive_detail !== "" ? x.details.productive_detail : "-"} productive
                            </Badge>
                          </Row>
                          <Row>
                            <Badge color='light-danger'>
                              {x.details.off_detail !== "" ? x.details.off_detail : "-"} off
                            </Badge>
                          </Row>
                        </td>
                        <td>
                          <div className="pointer">
                            <Trash className='me-50' size={15} onClick={() => onDelete(x, index)} id={`delete-tooltip-${x.id}`} />
                            <span className='align-middle'></span>
                            <UncontrolledTooltip
                              placement="top"
                              target={`delete-tooltip-${x.id}`}>
                              Delete
                            </UncontrolledTooltip>
                            <Edit className='me-50' size={15} onClick={() => onEdit(x, index)} id={`edit-tooltip-${x.id}`} />
                            <span className='align-middle'></span>
                            <UncontrolledTooltip
                              placement="top"
                              target={`edit-tooltip-${x.id}`}>
                              Edit
                            </UncontrolledTooltip>
                            <Search className='me-50' size={15} onClick={() => { onEmployee(x, index); fetchUserAssign(x) }} id={`employee-tooltip-${x.id}`} />
                            <span className='align-middle'></span>
                            <UncontrolledTooltip
                              placement="top"
                              target={`employee-tooltip-${x.id}`}>
                              Add Employee
                            </UncontrolledTooltip>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </CardBody>
        </Card>
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
          {modal.mode == 'add' ? <WorkingForm close={() => setToggleModal(false)} onSubmit={onSubmit} /> : <></>}
          {modal.mode == 'detail' ? <WorkingDetail item={modal.item} close={() => setToggleModal(false)} assignee={userAssign[0]} /> : <></>}
          {modal.mode == 'edit' ? <WorkingForm item={modal.item} close={() => setToggleModal(false)} onSubmit={onSubmit} /> : <></>}
          {modal.mode == 'employee' ?
            <>
              <FormGroup switch>
                <Input
                  type="switch"
                  checked={alluser}
                  onChange={() => {
                    setAllUser(!alluser);
                  }}
                />
                <Label check>Assign all employee to this work hours ?</Label>
              </FormGroup>
              <FormUserAssign
                disabled={alluser}
                options={users}
                multiple={true}
                disable={true}
                onSelect={(arg) => {
                  setUserSelect([...arg])
                }} />
              <Col>
                <Button type="button" size="md" color='danger' onClick={() => setToggleModal(false)}>Cancel</Button>
                <Button type="submit" size="md" color='primary' className="m-1" onClick={() => assignUser(modal.item)}>Submit</Button>
              </Col>
            </>
            : <></>
          }
        </ModalBody>
      </Modal>
    </>
  )
}

export default WorkingIndex