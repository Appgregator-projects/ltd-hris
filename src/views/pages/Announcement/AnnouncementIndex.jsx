import React from 'react'
import { useState } from 'react'
import { Edit, Plus, Trash } from 'react-feather'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import AnnouncementForm from './AnnouncementForm'
import { handlePreloader } from '../../../redux/layout'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import Api from "../../../sevices/Api";
import { dateFormat, dateTimeFormat } from '../../../Helper'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AnnouncementDetail from './AnnouncementDetail'
const MySwal = withReactContent(Swal)


const AnnouncementIndex = () => {
  const dispatch = useDispatch()
  const [annoncement, setAnnouncement] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({
    title : "",
    mode : "",
    item: null
  })

  const fetchAnnouncement = async() => {
    try {
      const {status,data} = await Api.get(`/hris/announcement`)
      if(status){
        setAnnouncement([...data])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchAnnouncement()
  },[])

  console.log(annoncement, "ann")

  const onAdd = () => {
    setModal({
      title :  "Add Announcement",
      mode : "add",
      item : null
    })
    setToggleModal(true)
  }

  const onDetail = (item) => {
    setModal({
      title : "Announcement Detail",
      mode : "detail",
      item : item
    })
    setToggleModal(true)
  }

  const postDelete = (id) => {
		return new Promise((resolve, rejcet) => {
		Api.delete(`/hris/announcement/${id}`)
			.then(res => resolve(res))
			.catch(err => rejcet(err))
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
				const {status,data} = await postDelete(item)
				if (status) {
				const oldCom = annoncement
				oldCom.splice(index, 1)
				setAnnouncement([...oldCom])
				return  MySwal.fire({
					icon: 'success',
					title: 'Deleted!',
					text: 'Announcement has been deleted.',
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

  const postForm = async (params) => {
    try {
      dispatch(handlePreloader(true));
      const {status,data} = await Api.post(`/hris/announcement`, params);
      dispatch(handlePreloader(false));
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      toast.success("Successfully added employee!", {
        position: "top-center",
      });
      fetchAnnouncement()
    } catch (error) {
      dispatch(handlePreloader(false))
			toast.error(`Error : ${error.message}`, {
				position: 'top-center'
      })
    }
  };

  return (
    <>
      <Row>
        <Row>
          <Col xl='6' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle>Announcement</CardTitle>
                <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1">
                  <Button color='warning' size='sm' onClick={onAdd}>
                    <Plus size={13}/>
                    Add new</Button>
                </Col>
              </CardHeader>
              <CardBody>
                <div className='info-list my-2'>
                {annoncement?.map((x) => {
                  return(
                      <ul className='list-styled'>
                        <li>
                          <span>New announcement just posted </span>
                        </li>
                        <div className='d-flex flex-column'>
                          <div className='d-flex justify-content-between'>
                            <span style={{ cursor : 'pointer' }} className='fw-bolder pointer text-primary' onClick={() => onDetail(x)} >{x.title}</span>
                            <div className='pointer'>
                              <Trash className="me-50" size={15} onClick={() => onDelete(x.id)} />
                            </div>
                          </div>
                          <span className='color-grey'>{dateTimeFormat(x.createdAt)}</span>
                        </div>
                      </ul>
                  )
                })}
                </div>

              </CardBody>
            </Card>
          </Col>
          <Col xl='6' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle>Notificaion Employee Alert</CardTitle>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Row>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}>
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          {modal.title}
        </ModalHeader>
        <ModalBody>
          {modal.mode === "add"? <AnnouncementForm onSubmit={postForm} close={() => setToggleModal(!toggleModal)}/> : <></>}
          {modal.mode === "detail"? <AnnouncementDetail item={modal.item}/> : <></>}
        </ModalBody>
      </Modal>
    </>
  )
}

export default AnnouncementIndex