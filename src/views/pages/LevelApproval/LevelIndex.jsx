import React, { Fragment, useEffect, useState } from 'react'
import { Edit, Plus, Trash } from 'react-feather'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import LeaveCategoryForm from '../LeaveCategory/LeaveCategoryForm'
import LevelForm from './LevelForm'
import { addDocumentFirebase, arrayUnionFirebase, getCollectionFirebase } from '../../../sevices/FirebaseApi'
import toast from 'react-hot-toast'
import Api from '../../../sevices/Api'

const LevelIndex = () => {
  const [approval, setApproval] = useState([])
  const [levelList, setLevelList] = useState([])
  const [department, setDepartment] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [nestedModal, setNestedModal] = useState(false)
  const [modal, setModal] = useState({
    title: 'Leave Form',
    mode: 'add',
    item: null
  })

  const fetchApproval = async () => {
    try {
      const getData = await getCollectionFirebase("approved_by")
      if (getData) {
        setApproval(getData)
      }
    } catch (error) {
      throw error
    }
  }

  const fetchLevel = async () => {
    try {
      const { status, data } = await Api.get(`/hris/level-approval-list`)
      if (status) {
        setLevelList(data)
      }
    } catch (error) {
      throw error
    }
  }

  const fetchDepartment = async () => {
    try {
      const getData = await getCollectionFirebase("departments")
      if (getData) {
        setDepartment(getData)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchApproval(), fetchDepartment(), fetchLevel()
  }, [])

  useEffect(() => {
    fetchLevel()
  }, [levelList])

  const onAdd = () => {
    setModal({
      title: 'Add Approval Form',
      mode: 'add',
      item: null
    })
    setToggleModal(true)
  }

  const onEdit = (item) => {
    setModal({
      title: "Edit Approval Form",
      mode: "edit department",
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
  }

  const onAddLevel = (item) => {
    setModal({
      title: "Add new level",
      mode: "level",
      item: item
    })
    setNestedModal(true)
  }

  const onSubmit = async (params) => {
    const itemPost = {
      name: params.name,
      division_id: params.division_id,
      approved_by: {
        manager: params.manager ? true : false,
        supervisor: params.supervisor ? true : false,
        head_of_division: params.head_of_division ? true : false,
        hr: params.hr ? true : false,
        finance: params.finance ? true : false
      }
    }
    // return console.log(itemPost,"arams")
    let response = ""
    // let resChildren = ""
    try {
      if (modal.item) return postUpdate(params);
      response = await addDocumentFirebase("approved_by", itemPost)
      if (!response)
        return toast.error(`Error : ${params.name}`, {
          position: "top-center",
        });
      fetchApproval();
      toast.success("New approval: " + params.name + "has been added", {
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

  return (
    <>
      <Row className='d-flex justify-content-between'>
        <Col lg='2' sm='12' className='mb-1'>
          <Fragment>
            <Button.Ripple size="sm" color='warning' onClick={onAdd}>
              <Plus size={14} />
              <span className='align-middle ms-25'>Add Approval</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle>Approval Level</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className='text-xs'>
                  <th className='fs-6'>Name</th>
                  <th className='fs-6'>Division</th>
                  <th className='fs-6'>Approved by</th>
                  <th className='fs-6'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  approval?.map((x, index) => {
                    const trueEntries = Object.entries(x.approved_by).filter(([key, value]) => value === true);
                    const trueArray = trueEntries.map(([key]) => key);
                    // console.log(trueArray.join(", ").replace(/_/g," "),'tty');
                    return (
                      <tr key={x.id}>
                        <td>{x.name}</td>
                        <td>{x.division_id}</td>
                        <td>{trueArray.join(", ").replace(/_/g, " ")}</td>
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
          {modal.mode == 'add' ? <LevelForm close={() => setToggleModal(false)} onSubmit={onSubmit} department={department} level={levelList} /> : <></>}
          {modal.mode == 'edit' ? <LevelForm item={modal.item} close={() => setToggleModal(false)} onSubmit={onSubmit} department={department} level={levelList} /> : <></>}
        </ModalBody>
      </Modal>
    </>
  )
}

export default LevelIndex