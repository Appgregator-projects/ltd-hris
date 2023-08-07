import { Fragment, useEffect, useState } from "react";
import { 
    Row,Col,Button,Table, Card, CardBody, CardHeader,CardTitle,
    Modal,ModalBody, ModalHeader
} from "reactstrap";
import { Edit, Trash, User, Plus, Lock, UserPlus } from 'react-feather'
import Avatar from '@components/avatar'
import { Link } from 'react-router-dom'
import DivisionForm from "./DivisionForm";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Api from '../../../sevices/Api'
import withReactContent from 'sweetalert2-react-content'
import FormUserAssign from "../Components/FormUserAssign";
import { error } from "jquery";
const MySwal = withReactContent(Swal)

const renderClient = row => {
    if (row.avatar) {
      return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
    } else {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <Avatar
            initials
            className='me-1 text-uppercase'
            color={row.avatarColor || 'light-primary'}
            content={row.manager.name || 'John Doe'}
            />
          <div className='d-flex flex-column'>
            <Link
              to={`/apps/user/view/${row.id}`}
              className='user_name text-truncate text-body'
              onClick={() => console.log}
            >
              <span className='fw-light text-capitalize'>{row.manager.name}</span>
            </Link>
            <small className='text-truncate text-muted mb-0'>{row.manager.email}</small>
          </div>
        </div>

       
      )
    }
  }

export default function DivisionIndex(){

    const [divisions, setDivisions] = useState([])
    const [toggleModal, setToggleModal] = useState(false)
	const [users, setUsers] = useState([])
  	const [userSelect, setUserSelect] = useState(null)
    const [modal, setModal] = useState({
        title:'Division form',
        mode:'add',
        item:null
    })

    const fetchDivision = async() => {
        try {
            const data = await Api.get('/hris/division')
            setDivisions(data.filter((x) => x.deletedAt === null))
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchDivision()
    },[])

    const fetchUser = async() => {
		try {
		const data = await Api.get(`/hris/employee`)
			setUsers([...data])
		} catch (error) {
			throw error
		}
	}
    
    useEffect(() => {
        fetchUser()
    },[])

    const onAdd = () => {
        setModal({
            title:'Division form',
            mode:'add',
            item:null
        })
        setToggleModal(true)
    }

    const onEdit = (item) => {
        // return console.log(item, "item edit")
        setModal({
            title:'Division form',
            mode:'edit',
            item:item
        })
        setToggleModal(true)
    }


    const postUpdate = async(params) => {
        try {
            const status = await Api.put(`/hris/division/${modal.item.id}`, params)
            if(!status) return toast.error(`Error : ${status}`, {
				position: 'top-center'
			})
			fetchDivision()
			toast.success('Division has updated', {
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

    const onSubmit = async(params) => {
        // return console.log(modal.item, "isi params")
        try {
            if(modal.item) return postUpdate(params)
            const status = await Api.post('/hris/division', params)
            if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchDivision()
			toast.success('Division has updated', {
				position: 'top-center'
			})
            setToggleModal(false)
        } catch (error) {
            toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
        }
    }

    const submitLeader = async() => {
        try {
            const {status} = await Api.patch(`hris/division/${modal.item.id}/set-leader`, {leader:userSelect.value})
            if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchDivision()
			toast.success('Division has updated', {
				position: 'top-center'
			})
            setToggleModal(false)
        } catch (error) {
            toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			})
        }
    }

    const postDelete = (id) => {
        // return console.log(id, "ini id delete")
		return new Promise((resolve, reject) => {
		Api.delete(`/hris/division/${id}`)
			.then(res => resolve(res))
			.catch(err => reject(err.message))
		})
	}

    const onDelete = (item, index) => {
        // return console.log(item, "item delete")
		MySwal.fire({
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
            const data = await postDelete(item.id)
            // return console.log(data, "jkbdfkb")
			if (data) {
                console.log(data, "ni isinya apa y")
                const oldCom = divisions
                oldCom.splice(index, 1)
                setDivisions([...oldCom])
                return  MySwal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Division has deleted.',
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
           <Row className='d-flex justify-content-between'>
				<Col lg='2' sm='12' className='mb-1'>
					<Fragment>
						<Button.Ripple size="sm" color='warning' onClick={onAdd}>
							<Plus size={14} />
							<span className='align-middle ms-25'>Add Division</span>
						</Button.Ripple>
					</Fragment>
				</Col>
			</Row>
            <Row>
                <Card>
                    <CardHeader>
                    <CardTitle>Divisions</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table responsive>
                            <thead>
                                <tr className='text-xs'>
                                <th className='fs-6'>Name</th>
                                <th className='fs-6'>Leader</th>
                                <th className='fs-6'>Total Employee</th>
                                {/* <th className='fs-6'>Description</th> */}
                                <th className='fs-6'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    divisions.map((x,index)=> 
                                    (
                                        <tr key={x.id}>
                                            <td>{x.name}</td>
                                            <td>
                                                {x.manager ? renderClient(x) : '-' }
                                            </td>
                                            <td>{x.total_employee}</td>
                                            {/* <td>{x.description}</td> */}
                                            <td>
                                                <div className="d-flex">
                                                    <div className="pointer">
                                                        <Trash className='me-50' size={15} onClick={() => onDelete(x, index)}/> <span className='align-middle'></span>
                                                        <Edit className='me-50' size={15} onClick={() => onEdit(x, index)}/> <span className='align-middle'></span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    )
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
                    { modal.mode == 'add' ? <DivisionForm onSubmit={onSubmit} users={users} close={()=> setToggleModal(false)}/> : <></> }
                    { modal.mode == 'edit' ? <DivisionForm item={modal.item} onSubmit={onSubmit} users={users} close={()=> setToggleModal(false)}/> : <></> }
                </ModalBody>
            </Modal>
        </>
    )
}