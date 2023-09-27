import React from 'react'
import { useState } from 'react'
import { Edit, Plus } from 'react-feather'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import AnnouncementForm from './AnnouncementForm'

const AnnouncementIndex = () => {
  const [annoncement, setAnnouncement] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({
    title : "",
    mode : "",
    item: null
  })

  const dummy = [
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
  ]

  const alertDummy = [
    {

    }
  ]

  const onAddAnnouncement = () => {
    setModal({
      title :  "Add Announcement",
      mode : "add",
      item : null
    })
    setToggleModal(true)

  }

  return (
    <>
      <Row>
        <Row>
          <Col xl='6' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle>Announcement</CardTitle>
                <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1">
                  <Button color='warning' size='sm' onClick={onAddAnnouncement}>
                    <Plus size={13}/>
                    Add new</Button>
                </Col>
              </CardHeader>
              <CardBody>
                <div className='info-list my-2'>
                {dummy?.map((x) => {
                  return(
                      <ul className='list-styled'>
                        <li>
                          <span>New announcement just posted </span>
                          <span className='fw-bolder'>{x.title}</span>
                        </li>
                          <span className='color-grey'>{x.createdAd}</span>
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
                <CardTitle>Employee Alert</CardTitle>
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
          {modal.mode === "add"? <AnnouncementForm item={dummy} close={() => setToggleModal(!toggleModal)}/> : <></>}
        </ModalBody>
      </Modal>
    </>
  )
}

export default AnnouncementIndex