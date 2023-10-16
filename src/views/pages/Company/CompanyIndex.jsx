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
import { handlePreloader } from '../../../redux/layout'
import { useDispatch } from 'react-redux'
import EditCompany from "./CompanyForm"
import CompanyDetail from "./CompanyDetail";
// import FormUserAssign from "../components/FormUserAssign"

export default function CompanyIndex(){
  const dispatch = useDispatch()

	const [companies, setCompanies] = useState([])
	const [modalToggle, setModalToggle] = useState(false)
	const [modal, setModal] = useState({
		title:'Company Form',
		mode:'add',
		item:null
	})
	
	const fetchCompanies = async() => {
		try {
			const {status,data} = await Api.get('/hris/company')
      if(status){
        setCompanies([...data])
      }
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		fetchCompanies()
	},[])

	const postDelete = (id) => {
		return new Promise((resolve, rejcet) => {
		Api.delete(`/hris/company/${id}`)
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
				const oldCom = companies
				oldCom.splice(index, 1)
				setCompanies([...oldCom])
				return  MySwal.fire({
					icon: 'success',
					title: 'Deleted!',
					text: 'Company has been deleted.',
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
			title: "Add Company",
			mode: "add",
			item: null
		})
		setModalToggle(true)
	}
	
	const postForm = async(params) => {
		try {
			if(modal.item) return postUpdate(params)
			dispatch(handlePreloader(true))
			const {status,data} = await Api.post('/hris/company', params)
			dispatch(handlePreloader(false))
			if(!status) 
      return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchCompanies()
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
			const {status,data} = await Api.put(`/hris/company/${modal.item.id}`, params)
			dispatch(handlePreloader(false))
			if(!status) return toast.error(`Error : ${data}`, {
				position: 'top-center'
			})
			fetchCompanies()
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
		console.log(item, "item edit")
		setModal({
			title:'Edit Office',
			mode:'edit',
			item:item
		})
		setModalToggle(true)
	}

	const onDetail = async(item) => {
		try {
			const data = await Api.get(`/hris/company/${item.id}`)
      if(data){
        setModal({
          title:'Company detail',
          mode:'detail',
          item:data
        })
      }
      setModalToggle(true)
		} catch (error) {
			console.log(error.message)
		}
	}

	return(
		<>
			<Row className='d-flex justify-content-between'>
				<Col lg='2' sm='12' className='mb-1'>
					<Fragment>
						<Button.Ripple size="sm" color='warning' onClick={onAdd}>
							<Plus size={14} />
							<span className='align-middle ms-23'>Add Company</span>
						</Button.Ripple>
					</Fragment>
				</Col>
			</Row>
			<Row>
        {
          companies.map((x, index) => (
            <Col md="4" key={index} className="position-relative">
              <Card>
                <CardBody>
                  <div className="pointer" onClick={() => onDetail(x)}>
                    <CardTitle tag='h4' className='my-0'>
                      {readMore(x.name,18)}
                    </CardTitle>
                    <p className='text-body-tertiary pb-1 my-0'><small>Company</small></p>
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
              </div>
            </Col>
          ))
        }
        {!companies.length ? <div className="text-center">No Office found</div> : <></>}
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
					{modal.mode === 'add' ? <EditCompany onSubmit={postForm} close={() => setModalToggle(false)}/> : <></>}
					{modal.mode === 'edit' ? <EditCompany onSubmit={postForm} close={() => setModalToggle(false)} item={modal.item}/> : <></>}
					{modal.mode === 'detail' ? <CompanyDetail item={modal.item}/> : <></>}
				</ModalBody>
			</Modal>
		</>
	)
}