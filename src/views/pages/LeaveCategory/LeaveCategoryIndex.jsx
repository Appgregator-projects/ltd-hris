import { Fragment, useEffect, useState } from "react";
import { Plus, Trash, Edit } from "react-feather";
import {
  Button, Col, Row, Card, CardBody, CardHeader, CardTitle, Table,
  Modal, ModalBody, ModalHeader, UncontrolledTooltip
} from "reactstrap";
import Api from '../../../sevices/Api'
import LeaveCategoryForm from "./LeaveCategoryForm"
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function LeaveCategoryIndex() {

  const [categories, setCategories] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({
    title: 'Leave Form',
    mode: 'add',
    item: null
  })

  const fetchCategories = async () => {
    try {
      const { status, data } = await Api.get(`/hris/leave-category`)
      if (status) {
        setCategories([...data])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const onAdd = () => {
    setModal({
      title: 'Leave Form',
      mode: 'add',
      item: null
    })
    setToggleModal(true)
  }

  const onSubmit = async (arg) => {
    try {
      if (modal.item) return postUpdate(arg)
      const { status, data } = await Api.post('/hris/leave-category', arg)
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: 'top-center'
        })
      fetchCategories()
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
      Api.delete(`/hris/leave-category/${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  const onDelete = (item, index) => {
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
          const oldCom = categories
          oldCom.splice(index, 1)
          setCategories([...oldCom])
          return MySwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Category has deleted.',
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
      title: 'Leave Form',
      mode: 'edit',
      item: item
    })
    setToggleModal(true)
  }

  const postUpdate = async (arg) => {
    try {
      const { status, data } = await Api.put(`/hris/leave-category/${modal.item.id}`, arg)
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: 'top-center'
        })
      fetchCategories()
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
              <span className='align-middle ms-25'>Add Category</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle>Leave categories</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className='text-xs'>
                  <th className='fs-6'>Name</th>
                  <th className='fs-6'>Initial Balance</th>
                  <th className='fs-6'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  categories.map((x, index) => (
                    <tr key={x.id}>
                      <td>{x.name}</td>
                      <td>{x.initial_balance}</td>
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
          {modal.mode == 'add' ? <LeaveCategoryForm close={() => setToggleModal(false)} onSubmit={onSubmit} /> : <></>}
          {modal.mode == 'edit' ? <LeaveCategoryForm item={modal.item} close={() => setToggleModal(false)} onSubmit={onSubmit} /> : <></>}
        </ModalBody>
      </Modal>
    </>
  )
}