import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Edit, Plus, Trash } from 'react-feather'
import Api from '../../../sevices/Api'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import PenaltyCategoryForm from './PenaltyCategoryForm'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)

const PenaltyCategoryIndex = () => {
  const [penalty, setPenalty] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({})

  const fetchPenalty = async() => {
    try {
      const data = await Api.get('/hris/penalty-category')
      setPenalty([...data])
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchPenalty()
  }, [])

  const onAdd = () => {
    setModal({
      title: "Add Type",
      mode : "add",
      item: null
    })
    setToggleModal(true)
  }

  const onSubmit = async(arg) => {
    try {
      if(modal.item) return postUpdate(arg)
      const status = await Api.post('/hris/penalty-category', arg)
      if(!status) return toast.error(`Error : ${data}`, {
        position: 'top-center'
			}) 
      fetchPenalty()
			toast.success('Leave category has saved', {
        position: 'top-center'
			})
      setToggleModal(false)
    } catch (error) {
      setToggleModal(false)
      toast.error(`Error : ${error.message}`, {
        position: 'top-center'
			})
    }
  }

  const postDelete = (id) => {
    return new Promise((resolve, reject) => {
      Api.delete(`/hris/penalty-category/${id}`)
      .then(res => resolve(res))
      .catch(err => reject(err))
    })
  }
  
  const onDelete = (item,index) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.value) {
        const status = await postDelete(item.id)
        if (status) {
          const oldCom = penalty
          oldCom.splice(index, 1)
          setPenalty([...oldCom])
          return  MySwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Category has been deleted.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
        }
        return toast.error(`Error : ${data}`, {
          position: 'top-center'
        })
      }
    })
  }

  const onEdit = (item) => {
    setModal({
      title:'Edit Penalty',
      mode:'edit',
      item:item
    })
    setToggleModal(true)
  }

  const postUpdate = async(arg) => {
      try {
      const status = await Api.put(`/hris/penalty-category/${modal.item.id}`, arg)
      if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			}) 
      fetchPenalty()
			toast.success('Leave category has updated', {
				position: 'top-center'
			})
      setToggleModal(false)
    } catch (error) {
      setToggleModal(false)
      toast.error(`Error : ${error.message}`, {
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
                          <span className='align-middle ms-25'>Add Type</span>
                      </Button.Ripple>
                  </Fragment>
              </Col>
          </Row>
    <Row>
      <Card>
          <CardHeader>
          <CardTitle>Penalties</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                  <tr className='text-xs'>
                  <th className='fs-6'>Title</th>
                  <th className='fs-6'>Duration</th>
                  <th className='fs-6'>Actions</th>
                  </tr>
              </thead>
              <tbody>
                {
                  penalty.map((x,index) => (
                    <tr key={x.id}>
                      <td>{x.title}</td>
                      <td>{x.duration === 1? "1 month" : x.duration === 2? "2 month" : "3 month"} </td>
                      <td>
                        <div className="pointer">
                          <Trash className='me-50' size={15} onClick={() => onDelete(x, index)}/> <span className='align-middle'></span>
                          <Edit className='me-50' size={15} onClick={() => onEdit(x, index)}/> <span className='align-middle'></span>
                        </div>
                      </td>
                    </tr>
                  ))
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
          { modal?.mode === 'add' ? <PenaltyCategoryForm close={() => setToggleModal(false)} onSubmit={onSubmit}/> : <></>}
          { modal?.mode === 'edit' ? <PenaltyCategoryForm item={modal?.item} close={() => setToggleModal(false)} onSubmit={onSubmit}/> : <></>}
        </ModalBody>
    </Modal>
  </>
  )
}

export default PenaltyCategoryIndex