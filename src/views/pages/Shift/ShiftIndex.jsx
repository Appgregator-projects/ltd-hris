import { Fragment, useEffect, useState } from "react";
import { 
  Card, CardBody, CardTitle, Row, Button, Col,
  Modal, ModalHeader, ModalBody, Input, CardText,
  Label,Badge,FormGroup
} from 'reactstrap'
import { Edit, Trash, User, Plus, UserPlus } from 'react-feather'
// import api from '../../plugins/api'
import { readMore } from "../../../Helper/index";
import Avatar from '@components/avatar'
import ShiftForm from "./ShiftForm";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormUserAssign from "../Components/FormUserAssign";
import ShiftDetail from "./ShiftDetail";
const MySwal = withReactContent(Swal)

export default function ShiftIndex(){

    const [modalToggle, setModalToggle] = useState(false)
	const [modal, setModal] = useState({
		title:'Shift Form',
		mode:'add',
		item:null
	})
    const [shifts, setShifts] = useState([])
	const [users, setUsers] = useState([])
    const [userSelect, setUserSelect] = useState([])

    // const fetchShift = async() => {
    //     try {
    //         const {data} = await api.get('/api/shift')
    //         setShifts([...data])
    //     } catch (error) {
    //         throw error
    //     }
    // }

    useEffect(() => {
        // fetchShift()
    }, [])

    const onAdd = () => {
        setModal({
            title:'Shift Form',
            mode:'add',
            item:null
        })
        setModalToggle(true)
    }

    const submitForm = async(arg) => {
        try {
            if(modal.item) return postUpdate(arg)
            const {status, data} = await api.post(`/api/shift`, arg)
            if(!status) return toast.error(`Error : ${data}`, {
                position: 'top-center'
            })
            fetchShift()
            toast.success('Office has updated', {
                position: 'top-center'
            })
            setModalToggle(false)
        } catch (error) {
            toast.error(`Error : ${error.message}`, {
                position: 'top-center'
            })
        }
    }

    const postUpdate = async(params) => {
        try {
            const {status} = await api.put(`/api/shift/${modal.item.id}`, params)
            if(!status) return toast.error(`Error : ${data}`, {
                position: 'top-center'
            })
            fetchShift()
            toast.success('Shift has updated', {
                position: 'top-center'
            })
            setModalToggle(false)
            setModal({
                title:'Shift Form',
                mode:'add',
                item:null
            })
        } catch (error) {
            toast.error(`Error : ${error.message}`, {
                position: 'top-center'
            })
            setModalToggle(false)
            setModal({
                title:'Shift Form',
                mode:'add',
                item:null
            })
        }
    }

    const onEdit = (item,index) => {
        setModal({
            title:'Edit Shift',
            mode:'edit',
            item:item
        })
        setModalToggle(true)
    }

    const postDelete = (id) => {
        return new Promise((resolve, rejcet) => {
          api.delete(`/api/shift/${id}`)
            .then(res => resolve(res))
            .catch(err => rejcet(err))
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
              const {status, data} = await postDelete(item.id)
              if (status) {
                const oldCom = shifts
                oldCom.splice(index, 1)
                setShifts([...oldCom])
                return  MySwal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'shift has deleted.',
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

    const userByOffice = async(id) => {
        try {
            const {data} = await api.get(`/api/office/${id}/user`)
            const d = data.map(x => {
                return{
                    value:x.id,
                    label:x.email
                }
            })
            setUsers([...d])
        } catch (error) {
            throw error
        }
    }

    const onAddUser = async(item) => {
        await userByOffice(item.office_id)
        setModal({
            title:'Assign employee',
            mode:'assign',
            item:item
        })
        setModalToggle(true)
    }

    const assignUser = async() => {
        try {
            if(!userSelect.length) return
            const {status,data} = await api.post(`api/shift/${modal.item.id}/assigned-user`, {
                employees:userSelect.map(x => x.value)
            })
            if(!status) return toast.error(`Error : ${data}`, {
                position: 'top-center'
            })
            fetchShift()
            toast.success('Shift has updated', {
                position: 'top-center'
            })
            setModalToggle(false)
            setModal({
                title:'Shift Form',
                mode:'add',
                item:null
            })
        } catch (error) {
            toast.error(`Error : ${error.message}`, {
                position: 'top-center'
            })
        }
    }

    const onDetail = async(arg) => {
        try {
            const {status,data} = await api.get(`api/shift/${arg.id}`)
            setModal({
                title:'Shift detail',
                mode:'detail',
                item:data
            })
            setModalToggle(true)
        } catch (error) {
            throw error
        }
    }

    const postDeleteUser = (id, params) => {
        return new Promise((resolve, reject) => {
            api.post(`/api/shift/${id}/removed-user`, params)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
    }

    const onDeleteUser = (item) => {
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
                const {status, data} = await postDeleteUser(item.office_shift_id, {employee:item.user_id})
                if(!status) {
                    toast.error(`Error : ${data}`, {
                        position: 'top-center'
                    })
                }
                fetchShift()
                toast.success('Shift has updated', {
                    position: 'top-center'
                })
                setModalToggle(false)
                setModal({
                    title:'Shift Form',
                    mode:'add',
                    item:null
                })
            }
        })
    }

    return(
        <>
            <Row className='d-flex justify-content-between'>
				<Col lg='2' sm='12' className='mb-1'>
					<Fragment>
						<Button.Ripple size="sm" color='warning' onClick={onAdd}>
							<Plus size={14} />
							<span className='align-middle ms-25'>Add Shift</span>
						</Button.Ripple>
					</Fragment>
				</Col>
			</Row>

            <Row>
                {
                shifts.map((x, index) => (
                    <Col md="4" key={index} className="position-relative">
                    <Card>
                        <CardBody>
                        <div className="pointer" onClick={() => onDetail(x)}>
                            <CardTitle tag='h4' className='my-0'>
                            {readMore(x.name,18)}
                            </CardTitle>
                            <p className='text-body-tertiary pb-1 my-0'>
                                <small>{x.office_name}</small>
                                {
                                    x.main_shift ? <Badge style={{marginLeft:'5px'}} color="success" pill>
                                        Main shift
                                    </Badge> : <></>
                                }
                                
                            </p>
                        </div>
                        <div className='d-flex align-items-center pointer'>
                            <Avatar color="light-info" icon={<User size={24} />} className='me-2' />
                            <div className='my-auto'>
                            <h4 className='fw-bolder mb-0'>{ x.main_shift ? 'All Employees' : x.total_employee}</h4>
                            <CardText className='font-small-3 mb-0 text-secondary'>Employee</CardText>
                            </div>
                        </div>
                        </CardBody>
                    </Card>
                    <div className="d-flex px-2 project-card-action">
                        <div className="pointer">
                            <Edit className='me-50' size={15} onClick={() => onEdit(x,index)}/> <span className='align-middle'></span>
                        </div>
                        <div className="pointer">
                            <Trash className='me-50' size={15} onClick={() => onDelete(x, index)}/> <span className='align-middle'></span>
                        </div>
                        {
                            !x.main_shift ?
                                <div className="pointer">
                                    <UserPlus className='me-50' size={15} onClick={() => onAddUser(x)}/> <span className='align-middle'></span>
                                </div> : <></>
                        }
                    </div>
                    </Col>
                ))
                }
                {!shifts.length ? <div className="text-center">No Office found</div> : <></>}
            </Row>

            <Modal
                isOpen={modalToggle}
                toggle={() => setModalToggle(!modalToggle)}
                className={`modal-dialog-centered modal-lg`}
            >
                <ModalHeader toggle={() => setModalToggle(!modalToggle)}>
                    {modal.title}
                </ModalHeader>
                <ModalBody>
					{modal.mode === 'add' ? <ShiftForm onSubmit={submitForm} close={() => setModalToggle(!modalToggle)}/> : <></>}
					{modal.mode === 'edit' ? <ShiftForm item={modal.item} onSubmit={submitForm} close={() => setModalToggle(!modalToggle)}/> : <></>}
					{modal.mode === 'detail' ? <ShiftDetail item={modal.item} onDeleteUser={onDeleteUser} close={() => setModalToggle(!modalToggle)}/> : <></>}
                    {
						modal.mode == 'assign' ? 
						<>
						<FormUserAssign
							options={users}
							multiple={true}
							disable={true}
							onSelect={(arg) => {
								setUserSelect([...arg])
							}}/>
							<Col>
								<Button type="button" size="md" color='danger' onClick={()=>setModalToggle(false)}>Cancel</Button>
								<Button type="submit" size="md" color='primary' className="m-1" onClick={assignUser}>Submit</Button>
							</Col>
						</>
						: <></>
						}
				</ModalBody>
			</Modal>

        </>
    )
}