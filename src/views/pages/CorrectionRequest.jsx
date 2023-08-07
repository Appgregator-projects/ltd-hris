import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { 
  Badge, Card, CardBody, CardHeader, CardTitle, Col,Row, Table,UncontrolledTooltip,
  Modal,ModalBody,ModalHeader,Button, ModalFooter
} from "reactstrap";
// import api from '../../plugins/api'
import {dateFormat,dateTimeFormat} from '../../Helper/index'
import {
  Eye
} from 'react-feather'

import { Link } from "react-router-dom";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function CorrectionIndex(){
  
  const [corrections, setCorrection] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [selectItem, setSelectItem] = useState(null)

//   const fetchCorrection = async() => {
//     try {
//       const {data} = await api.get('/api/correction')
//       setCorrection([...data])
//     } catch (error) {
//       throw error
//     }
//   }

  useEffect(() => {
    // fetchCorrection()
  },[])

  const onDetail = (arg) => {
    setSelectItem(arg)
    setToggleModal(true)
  }

  const onApproval = async(arg) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${arg} it!`,
      customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.value) {
        try {
          const params = {
            status:arg
          }
          const {status,data} = await api.post(`/api/correction/${selectItem.id}/approval`, params)
          if(!status) return toast.error(`Error : ${data}`, {
            position: 'top-center'
          }) 
          fetchCorrection()
          toast.success(data, {
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
                    <th className='fs-6'>#</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    corrections.map((x,index) => (
                      <tr key={index}>
                        <td>{x.user.email}</td>
                        <td>{dateFormat(x.clock_in)}</td>
                        <td>{dayjs(x.clock_in).format('HH:mm')} | { dayjs(x.clock_out).format('HH:mm')}</td>
                        <td>
                          {renderStatus(x)}
                        </td>
                        <td>{dateTimeFormat(x.createdAt)}</td>
                        <td>
                        <div className='column-action d-flex align-items-center'>
                            <div className='text-body pointer' onClick={() => onDetail(x)} id={`pw-tooltip-${x.id}`}>
                              <Eye size={17} className='mx-1' />
                            </div>
                            <UncontrolledTooltip placement='top' target={`pw-tooltip-${x.id}`}>
                              Preview Correction
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
                      <span className="capitalize">{selectItem.user.name}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Employee Email</span>
                      <span>{selectItem.user.email}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Created At</span>
                      <span>{dateFormat(selectItem.createdAt)}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Current Status</span>
                      <span>{selectItem.current_status}</span>
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
                      <span>{dayjs(selectItem.clock_ou).format('HH:mm')}</span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Attachment</span>
                      <span>
                        <Link to={selectItem.image} target="_blank">attachment</Link>
                      </span>
                    </li>
                    <li className="d-flex justify-content-between pb-1">
                      <span className="fw-bold">Reason</span>
                      <span>{selectItem.reason}</span>
                    </li>
                </ul>
                </>
              : <></>
            }
          </ModalBody>
          <ModalFooter>
            {
              selectItem ? 
              <div className="">
                <Button type="button" size="md" color='danger' disabled={!!selectItem.current_status} onClick={() => onApproval('rejected')}>Reject</Button>
                <Button type="submit" size="md" color='primary' disabled={!!selectItem.current_status} className="m-1" onClick={() => onApproval('approved')}>Approv</Button>
              </div> : <></>
            }
          </ModalFooter>
      </Modal>
    </>
  )
}