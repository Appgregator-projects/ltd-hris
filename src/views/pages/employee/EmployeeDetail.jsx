import { Fragment, useEffect, useState } from "react";
import {
	Card, CardBody, Col, Row, Badge, CardHeader, Table, CardTitle, CardFooter, Button,
	Modal, ModalHeader, ModalBody
} from "reactstrap";
import Avatar from '@components/avatar'
import Api from '../../../sevices/Api'
import { Link, useParams } from 'react-router-dom'
import { capitalize, dateFormat } from "../../../Helper/index";
import { Copy, Edit, Trash } from "react-feather";
import LeaveForm from "./component/LeaveForm";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AvatarGroup from "./component/AvatarGroup";
import UserTimeline from "./view/UserTimeline";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/index";
import HealthForm from "./component/IncomeForm";
import IncomeForm from "./component/IncomeForm";
const MySwal = withReactContent(Swal);


export default function EmployeeDetail() {
	const id = useParams()

	const [toggleModal, setToggleModal] = useState(false)
	const [user, setUser] = useState([])
	const [balance, setBalance] = useState([])
	const [userBalance, setUserBalance] = useState([])
	const [usersDivision, setUsersDivision] = useState([])
  	const [logUser, setLogUser] = useState([])
	const [leaveCategories, setLaeveCategories] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [income, setIncome] = useState([])
	const [modal, setModal] =useState({
		title: "Leave Balances",
		mode: "get leave",
		item: null
	})

	const fetchUser = async () => {
		try {
			const data = await Api.get(`/hris/employee/${id.uid}`)
			setUser(data)
			setBalance([...data.leave_balances])
		} catch (error) {
			throw error

		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	const fetchUsersDivision = async () => {
		try {
			const dataUsers = await Api.get(`/hris/employee/${id.uid}`)
			setUsersDivision([...dataUsers.leave_balances])
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		fetchUsersDivision()
	}, [])

	const fetchLeaveCategories = async () => {
		try {
			const data = await Api.get(`/hris/leave-category`)
			// console.log(data, "data leave category")
			setLaeveCategories([...data])

		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		fetchLeaveCategories()
	}, [])

	const fetchIncome = async () => {
		try {
		  const data = await Api.get(`/hris/employee-income/${id.uid}`)
		  setIncome([...data])
		} catch (error) {
		  throw error
		}
	  }

	  useEffect(() =>{
		fetchIncome()
	},[])

 	const fecthLogUser= async () => {
		try {
			const data = await Api.get(`/auth/log/${id.uid}`)
			setLogUser([...data])
			console.log(data, "fetch userlog")
		} catch (error) {
			throw error
		}
  	}

  	useEffect(() => {
  	  fecthLogUser()
  }	, [])

	const renderUserImg = () => {
		if (!user) return <Avatar
			initials
			color="light-primary"
			className='rounded mt-3 mb-2'
			content="John Doe"
			contentStyles={{
				borderRadius: 0,
				fontSize: 'calc(48px)',
				width: '100%',
				height: '100%'
			}}
			style={{
				height: '110px',
				width: '110px'
			}}
		/>
		if (user.avatar) return (
			<img
				height='110'
				width='110'
				alt='user-avatar'
				src={user.avatar}
				className='img-fluid rounded mt-3 mb-2'
			/>
		)

		return (
			<Avatar
				initials
				color="light-primary"
				className='rounded mt-3 mb-2'
				content={capitalize(user.name)}
				contentStyles={{
					borderRadius: 0,
					fontSize: 'calc(48px)',
					width: '100%',
					height: '100%'
				}}
				style={{
					height: '110px',
					width: '110px'
				}}
			/>
		)
	}

	const onEditLeave = () => {
		setModal({
			title: "Leave Form",
			mode: "leave",
			item: null
		})
		setToggleModal(true)
	}

	const onEditIncome = (x) => {
		setModal({
			title: "Employee Income",
			mode: "income",
			item: x
		})
		setToggleModal(true)

	}

	const postLeave = async (arg) => {
		try {
			arg.users = user.id
			setIsLoading(true)
			const status = await Api.post(`/hris/employee/${id.uid}/assign-leave`, arg)
			setUserBalance(status)
			console.log(status, "status")
			setIsLoading(false)
			if (!status) return toast.error(data, {
				position: 'top-center'
			})
			toast.success('Successfully added employee!', {
				position: 'top-center'
			})
			fetchUser()
			setToggleModal(false)
		} catch (error) {
			setIsLoading(false)
			toast.error(error.message, {
				position: 'top-center'
			})
			throw error
		}
	}

	const postIncome = async(params) => {
		try {
			const status = await Api.post(`/hris/employee-income/${id.uid}`, params)
			if (!status)
			return toast.error(`Error : ${data}`, {
			  position: "top-center",
			});
			fetchIncome();
			toast.success("Income has updated", {
				position: "top-center",
			});
			setToggleModal(false);
		} catch (error) {
			toast.error(`Error : ${error.message}`, {
				position: "top-center",
			});
		}
	}

	const onDelete = (x) => {
		console.log(x,"test delete")
		return MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",      
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			customClass: {
			  confirmButton: "btn btn-primary",
			  cancelButton: "btn btn-outline-danger ms-1",
			},
			buttonsStyling: false,
		  }).then(async (result) => {
			if (result.value) {
			  try {
				const status = await Api.delete(`/hris/employee-income/${x.id}`);
				return console.log(status, "ini params")
				if (!status)
				  return toast.error(`Error : ${data}`, {
					position: "top-center",
				  });
				setIsRefresh(true);
				toast.success("Successfully updated employee!", {
				  position: "top-center",
				});
			  } catch (error) {
				toast.error(`Error : ${error.message}`, {
				  position: "top-center",
				});
			  }
			}
		  });


	}

	const UserView = () => {
		// ** Store Vars
		const store = useSelector(state => state.users)
		const dispatch = useDispatch()
		console.log(store, "store useSelector")
	  
		// ** Get suer on mount
		useEffect(() => {
		  dispatch(getUser(parseInt(id)))
		}, [dispatch])
	  
		const [active, setActive] = useState('1')
	  
		const toggleTab = tab => {
		  if (active !== tab) {
			setActive(tab)
		  }
		}

	}


	return (
		<>
			<Row>
				<Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
					<Card>
						<CardBody>
							<div className='user-avatar-section'>
								<div className='d-flex align-items-center flex-column'>
									{renderUserImg()}
									<div className='d-flex flex-column align-items-center text-center'>
										<div className='user-info'>
											<h4 className="uppercase">{user !== null ? capitalize(user.name) : 'Guest'}</h4>
											<Badge color="light-warning" className='text-capitalize'>
												{user && user.employee_attribute ? user.employee_attribute.status : "Staff"}
											</Badge>
										</div>
									</div>
								</div>
							</div>
							<h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
							<div className='info-container'>
								{user !== null ? (
									<ul className='list-unstyled'>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Email</span>
											<span>{user.email}</span>
										</li>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Company</span>
											<span>{user.company ? user.company.name : '-'}</span>
										</li>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Division</span>
											<span>{user.division ? user.division.name : '-'}</span>
										</li>
										<li className='mb-75 d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Status</span>
											<span className="text-right">
												<Badge className='text-capitalize' color="light-info">
													{user && user.employee_attribute ? user.employee_attribute.status : '-'}
												</Badge>
											</span>
										</li>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>DOB</span>
											<span className='text-capitalize'> {user.employee_attribute ? dateFormat(user.employee_attribute.dob) : '-'}</span>
										</li>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>ID Number</span>
											<span> {user.employee_attribute ? user.employee_attribute.id_number : '-'}</span>
										</li>
										<li className='mb-75  d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Tax Number</span>
											<span> {user.employee_attribute ? user.employee_attribute.id_tax_number : '-'}</span>
										</li>
										<li className='mb-75 d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Gender</span>
											<span>{user.employee_attribute ? user.employee_attribute.gender : '-'}</span>
										</li>
										<li className='mb-75 d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Religion</span>
											<span>{user.employee_attribute ? user.employee_attribute.religion : '-'}</span>
										</li>
										<li className='mb-75 d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Join Date</span>
											<span>{user.employee_attribute ? dateFormat(user.employee_attribute.join_date) : '-'}</span>
										</li>
										<li className='mb-75 d-flex justify-content-between'>
											<span className='fw-bolder me-25'>Out Date</span>
											<span>{user && user.employee_attribute ? dateFormat(user.employee_attribute.out_date) : '-'}</span>

										</li>
										<li className='mb-75 d-flex flex-column'>
											<span className='fw-bolder me-25'>Address</span>
											<span>{user.info ? user.info.address : '-'}</span>
										</li>
									</ul>
								) : null}
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>Employee Income</CardTitle>
						</CardHeader>
						<CardBody>
							<Table responsive>
								<thead>
									<tr className="text-xs">
										<th className="fs-6">Name</th>
										<th className="fs-6">Amount</th>
										<th className="fs-6">Flag</th>
										<th className="fs-6">Action</th>
									</tr>
								</thead>
								<tbody>
									{income.map((x) => (
										<tr key={x.id}>
											<td>{x.name}</td>
											<td>{x.amount}</td>
											<td>{x.flag}</td>
											<td>
												<Trash className="me-50 pointer" size={15} onClick={() => onDelete(x)}></Trash>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</CardBody>
						<CardFooter>
							<Button size="sm" type="button" color='warning'>
								<Edit size={13} />
								<span className='align-middle ms-25' onClick={() => onEditIncome(income)}>Edit</span>
							</Button>
						</CardFooter>
					</Card>
					</Col>
					<Col>
						<Card>
							<CardHeader>
								<CardTitle>Leave Balances</CardTitle>
							</CardHeader>
							<CardBody>
								<Table responsive>
									<thead>
										<tr className='text-xs'>
											<th className='fs-6'>Leave Name</th>
											<th className='fs-6'>Balance</th>
										</tr>
									</thead>
									<tbody>
										{
											usersDivision.length ?
												usersDivision.map(x => (
													<tr key={x.id}>
														<td>{x.category? x.category.name : '-'}</td>
														<td>{x.balance ? x.balance : "0"} days</td>
													</tr>
												)) : <>
													<tr>
														<td colSpan={2} className="text-center">Empty leave</td>
													</tr>
												</>
										}
									</tbody>
								</Table>
							</CardBody>
							<CardFooter>
								<Button size="sm" type="button" color='warning'>
									<Edit size={13} />
									<span className='align-middle ms-25' onClick={() => onEditLeave()}>Edit</span>
								</Button>
							</CardFooter>
						</Card>
					</Col>
					<Col>
						<Card>
							<CardHeader>
								<CardTitle>Division</CardTitle>
							</CardHeader>
							<CardBody>
								<div>
									<span></span>
									{/* <AvatarGroup data={usersDivision}/> */}
								</div>
								<div className='d-flex justify-content-between align-items-end mt-1 pt-25'>
									<div className='role-heading'>
										<h4 className='fw-bolder'>{usersDivision.category?.name}</h4>
										<Link
											to='/'
											className='role-edit-modal'
											onClick={e => {
												e.preventDefault()
												// setModalType('Edit')
												// setShow(true)
											}}
										>
										</Link>
									</div>
									<Link to='' className='text-body' onClick={e => e.preventDefault()}>
										<Copy className='font-medium-5' />
									</Link>
								</div>
							</CardBody>
							<CardFooter>
							</CardFooter>
						</Card>
					</Col>
					<Col>
					<Card>
						<UserTimeline userLog={logUser}/>
					</Card>
					</Col>
					
				</Col>
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
					{modal.mode === "leave"?
					<LeaveForm
						leave={leaveCategories}
						balance={balance}
						userBalance={userBalance}
						onSubmit={postLeave}
						isLoading={isLoading}
						close={() => setToggleModal(!toggleModal)}
					/>: <></>}
					{modal.mode === "income"? 
					<IncomeForm
						isLoading={isLoading}
						close={() => setToggleModal(!toggleModal)}
						income={modal.item}
						onSubmit={postIncome}
						/> :<></>}
				</ModalBody>
			</Modal>
		</>
	) 
	// : 
	// (
	// 	<Alert color='danger'>
	// 	  <h4 className='alert-heading'>User not found</h4>
	// 	  <div className='alert-body'>
	// 		User with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/user/list'>Users List</Link>
	// 	  </div>
	// 	</Alert>
	// )
}   