import React, { Fragment, useState } from 'react'
import { Edit, Plus, Trash, User } from 'react-feather'
import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Modal, ModalBody, ModalHeader, Row, UncontrolledTooltip } from 'reactstrap'
import { readMore } from '../../../Helper'
import Avatar from '../../../@core/components/avatar'
import PenaltyForm from './PenaltyForm'
import PenaltyDetail from './PenaltyDetail'
import Api from "../../../sevices/Api";
import { useEffect } from 'react'
import FormUserAssign from '../Components/FormUserAssign'
import { useDispatch } from 'react-redux'
import { handlePreloader } from '../../../redux/layout'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


const PenaltyIndex = () => {
  const dispatch = useDispatch();

  const [penalty, setPenalty] = useState([])
  const [history, setHistory] = useState([])
  const [employee, setEmployee] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({
    title : "",
    mode : "",
    item : null
  })

  const fetchEmployee= async() => {
    try {
      const data = await Api.get(`/hris/employee?no_paginate=true`);
      if (data) {
        const userData = data.map((x) => {
          return {
            value: x.id,
            label: x.name
          }
        })
        setEmployee([...userData])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchEmployee()
  },[])

  const fetchPenalty = async() => {
    try {
      const {status,data} = await Api.get(`/hris/warning-letter`)
      if(status){
        setPenalty([...data])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchPenalty()
  },[])

  const onAdd = () => {
    setModal({
      title : "Add Penalty",
      mode : "add",
      item : null
    })
    setToggleModal(true)
  }

  const onDetail = (x) => {
    console.log(x, "x")
    setModal({
      title : " ",
      mode : "detail",
      item : x
    })
    setToggleModal(true)
  }

  const postForm = async (params) => {
    try {
      dispatch(handlePreloader(true));
      const {status,data} = await Api.post(`/hris/warning-letter`, params);
      dispatch(handlePreloader(false));
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      toast.success("Successfully added employee!", {
        position: "top-center",
      });
      fetchPenalty()
    } catch (error) {
      dispatch(handlePreloader(false))
			toast.error(`Error : ${error.message}`, {
				position: 'top-center'
      })
    }
  };

  const postDelete = (id) => {
		return new Promise((resolve, rejcet) => {
		Api.delete(`/hris/warning-letter/${id}`)
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
        console.log(result.value)
				const status= await postDelete(item.id)
        console.log(status, "llll")
				if (status) {
				const oldCom = penalty
				oldCom.splice(index, 1)
				setPenalty([...oldCom])
				return  MySwal.fire({
					icon: 'success',
					title: 'Deleted!',
					text: 'Penalty has deleted.',
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


  return (
    <>
    <Row>
      <Col lg='2' sm='12' className='mb-1'>
				<Fragment>
					<Button.Ripple size="sm" color='warning' onClick={onAdd}>
						<Plus size={14} />
						<span className='align-middle ms-23'>Add Penalty</span>
					</Button.Ripple>
				</Fragment>
			</Col>
    </Row>
    <Row>
        {
          penalty.map((x, index) => (
            <Col md="4" key={index} className="position-relative">
              <Card>
                <CardBody>
                  <div className="pointer" onClick={() => onDetail(x)}>
                    <CardTitle tag='h4' className='my-0'>
                      {readMore(x.users? x.users.name : "-",16)}
                    </CardTitle>
                    <p className='text-body-tertiary pb-1 my-0'><small>{x.email}</small></p>
                  </div>
                  <div className='d-flex align-items-center pointer'>
                    <Avatar color="light-info" icon={<User size={24} />} className='me-2' />
                    <div className='my-auto'>
                      <h6 className='fw-bolder mb-0'>{x.message}</h6>
                      <CardText className='font-small-3 mb-0'>{x.title}</CardText>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="d-flex px-2 project-card-action">
								<div className="pointer">
									{/* <Edit className='me-50' size={15} onClick={onEdit}/> <span className='align-middle'></span> */}
								</div>
								<div className="pointer">
									<Trash className='me-50' size={15} onClick={()=> onDelete(x, index)}
                    id={`pw-tooltip-${x.id}`}
                  /> 
                  <span className='align-middle'></span>
                  <UncontrolledTooltip
                    placement="top"
                    target={`pw-tooltip-${x.id}`}
                  >
                    Delete
                  </UncontrolledTooltip>
								</div>
              </div>
            </Col>
          ))
        }
        {!penalty.length ? <div className="text-center">No Office found</div> : <></>}
    </Row>
    <Modal
      isOpen={toggleModal}
      toggle={() => setToggleModal(!toggleModal)}
      className={`modal-dialog-centered modal-lg`}>
      <ModalHeader toggle={() => setToggleModal(!toggleModal)}> 
        {modal.title}
      </ModalHeader>
      <ModalBody>
        {modal.mode === "add" ?
        <PenaltyForm item={penalty} user={employee} onSubmit={postForm} close={() => setToggleModal(false)}/>
         : <></>}
        {modal.mode === "detail" ? <PenaltyDetail item={modal.item} /> : <></>}
      </ModalBody>
    </Modal>
    </>
  )
}

export default PenaltyIndex

{/* <PenaltyForm item={penaltys} user={employee} close={() => setToggleModal(false)}/> */}