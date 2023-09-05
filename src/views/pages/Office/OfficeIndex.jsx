import { Fragment, useEffect, useState } from "react";
import { 
  Card, CardBody, CardTitle, Row, Button, Col,
  Modal, ModalHeader, ModalBody, Input, CardText,
  Label,
	FormGroup
} from 'reactstrap'
import { Edit, Trash, User, Plus, UserPlus } from 'react-feather'
import Api from '../../../sevices/Api'
import Avatar from '@components/avatar'
import { readMore } from "../../../Helper/index"
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import OfficeForm from "./OfficeForm"
import { handlePreloader } from '../../../redux/layout'
import { useDispatch } from 'react-redux'
import OfficeDetail from "./OfficeDetail"
import FormUserAssign from "../Components/FormUserAssign";

export default function OfficeIndex(){
  const dispatch = useDispatch()

	const [offices, setOffices] = useState([])
	const [modalToggle, setModalToggle] = useState(false)
	const [modal, setModal] = useState({
		title:'Add Office',
		mode:'add',
		item:null
	})
	const [users, setUsers] = useState([])
  	const [userSelect, setUserSelect] = useState([])
	const [alluser, setAllUser] = useState(false);


	const fetchUser = async() => {
		try {
		const data = await Api.get(`hris/employee?no_paginate=true`)
		// return console.log(data," ini data office user")
				if(data){
					const userData = data.map(x => {
						return {
							value:x.id,
							label:x.email
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
	
	const fetchOffice = async() => {
		try {
			const data = await Api.get('/hris/office')
			setOffices([...data])
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		fetchOffice()
	},[])

	const postDelete = (id) => {
		return new Promise((resolve, rejcet) => {
		Api.delete(`/hris/office/${id}`)
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
				const status = await postDelete(item.id)
				if (status) {
				const oldCom = offices
				oldCom.splice(index, 1)
				setOffices([...oldCom])
				return  MySwal.fire({
					icon: 'success',
					title: 'Deleted!',
					text: 'Office has deleted.',
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

	const onAdd = () => {
		setModal({
			title:"Add Office",
			mode: "add",
			item: null
		})
		setModalToggle(true)
	}
	
	const postForm = async(params) => {
		try {
			if(modal.item) return postUpdate(params)
			dispatch(handlePreloader(true))
			const status = await Api.post('/hris/office', params)
			// return console.log(status, 'params post office')
			dispatch(handlePreloader(false))
			if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchOffice()
			toast.success('Office has saved', {
        position: 'top-center'
      })
		} catch (error) {
			dispatch(handlePreloader(false))
			toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
		}
	}

	const postUpdate = async(params) => {
		try {
			dispatch(handlePreloader(true))
			const status = await Api.put(`/hris/office/${modal.item.id}`, params)
			dispatch(handlePreloader(false))
			setModal({
				title:'Office Form',
				mode:'add',
				item:null
			})
			if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchOffice()
			toast.success('Office has updated', {
				position: 'top-center'
			})
		} catch (error) {
			dispatch(handlePreloader(false))
			toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
		}
	}

	const onEdit = (item, index) => {
		setModal({
			title:'Edit Office',
			mode:'edit',
			item:item
		})
		setModalToggle(true)
	}

	const onDetail = async(item) => {
		// return console.log(item, "ini item")
		try {
			const data = await Api.get(`/hris/office/${item.id}`)
			console.log(data,' data');
			setModal({
				title:'Office detail',
				mode:'detail',
				item:data
			})
			setModalToggle(true)
		} catch (error) {
			console.log(error.message)
		}
	}

	const onAddUser = (item) => {
		setModal({
			title:'Assign employee',
			mode:'assign',
			item:item
		})
		setModalToggle(true)
	}

	const assignUser = async() => {
		const params = userSelect.map(x => x.value)
		// return console.log(params.length, "modal")
		const itemPatch = {
			employee:params.length ? params : ['all'],
			is_all:alluser
		}
		try {
			const status = await Api.patch(`/hris/office/${modal.item.id}/assign-user`,itemPatch)
			return console.log(status, itemPatch, "params userselect")
			if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			}) 
			fetchOffice()
			toast.success('Office has updated', {
				position: 'top-center'
			})
			setModalToggle(false)
		} catch (error) {
			return toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
		}
	}

	const onDeleteUser = async(arg) => {
		// return console.log(arg, "arg ondeleeuser")
		try {
			const params = {
				employee:arg.user_id
			}
			const {status} = await Api.delete(`/hris/office/${arg.office_id}/remove-user`)
			console.log(status, "status delete user")
			setModalToggle(false)
			fetchOffice()
			toast.success('Office has updated', {
				position: 'top-center'
			})
		} catch (error) {
			return toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
		}		
	}

	return(
		<>
			<Row className='d-flex justify-content-between'>
				<Col lg='2' sm='12' className='mb-1'>
					<Fragment>
						<Button.Ripple size="sm" color='warning' onClick={onAdd}>
							<Plus size={14} />
							<span className='align-middle ms-25'>Add Office</span>
						</Button.Ripple>
					</Fragment>
				</Col>
			</Row>
			<Row>
        {
          offices.map((x, index) => (
            <Col md="4" key={index} className="position-relative">
              <Card>
                <CardBody>
                  <div className="pointer" onClick={() => onDetail(x)}>
                    <CardTitle tag='h4' className='my-0'>
                      {readMore(x.name,18)}
                    </CardTitle>
                    <p className='text-body-tertiary pb-1 my-0'><small>Company office</small></p>
                  </div>
                  <div className='d-flex align-items-center pointer'>
                    <Avatar color="light-info" icon={<User size={24} />} className='me-2' />
                    <div className='my-auto'>
                      <h4 className='fw-bolder mb-0'>{x.total_employee}</h4>
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
								<div className="pointer">
									<UserPlus className='me-50' size={15} onClick={() => onAddUser(x)}/> <span className='align-middle'></span>
								</div>
              </div>
            </Col>
          ))
        }
        {!offices.length ? <div className="text-center">No Office found</div> : <></>}
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
					{modal.mode === 'add' ? <OfficeForm onSubmit={postForm} close={() => setModalToggle(false)}/> : <></>}
					{modal.mode === 'edit' ? <OfficeForm onSubmit={postForm} close={() => setModalToggle(false)} item={modal.item}/> : <></>}
					{modal.mode === 'detail' ? <OfficeDetail item={modal.item} onDeleteUser={onDeleteUser}/> : <></>}
					{
						modal.mode == 'assign' ? 
						<>
						 <FormGroup switch>
							<Input
								type="switch"
								checked={alluser}
								onChange={() => {
									setAllUser(!alluser);
								}}
							/>
							<Label check>Assign all employee to this office ?</Label>
						</FormGroup>
						<FormUserAssign
							disabled={alluser}
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