import { Fragment,useEffect,useState } from "react";
import { 
	Card, CardBody, Col, Row,Badge, CardHeader, Table, CardTitle, CardFooter,Button,
	Modal, ModalHeader, ModalBody
} from "reactstrap";
import Avatar from '@components/avatar'
import Api from '../../../sevices/Api'
import { Link, useParams } from 'react-router-dom'
import { capitalize, dateFormat } from "../../../Helper/index";
import { Copy, Edit } from "react-feather";
import LeaveForm from "./component/LeaveForm";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AvatarGroup from "@components/avatar-group";

export default function EmployeeDetail(){
		const id = useParams()

		const [toggleModal, setToggleModal] = useState(false)
		const [user, setUser] = useState(null)
		const [balance, setBalance] = useState([])
		const [usersDivision, setUsersDivision] = useState([])
		const [leaveCategories, setLaeveCategories] = useState([])
		const [isLoading, setIsLoading] = useState(false)

		const fetchUser = async() => {
			try {
				const data = await Api.get(`/hris/employee/${id.uid}`)
				setUser(data)
			} catch (error) {
				throw error
				
			}}

				
		useEffect(() => {
			fetchUser()
		},[])

		const fetchUsersDivision = async() => {
			// return console.log(id.uid,"user division")
			try {
				const dataUsers = await Api.get(`/hris/employee/${id.uid}/division`)
				setUsersDivision(dataUsers.division)
			} catch (error) {
				throw error
			}
		}

		useEffect(() => {
			fetchUsersDivision()
		},[])

		// const dataUsers 

		// console.log(usersDivision?.length, "length")

		// const fetchUserBalance = async(userId) => {
		// 	try {
		// 		const {data} = await Api.get(`/api/leave/user-balance/${userId}`)
		// 		setBalance([...data])
		// 	} catch (error) {
		// 		throw error
		// 	}
		// }

		const fetchLeaveCategories = async() => {
			try {
				const data = await Api.get(`/hris/leave-category`)
				setLaeveCategories([...data])
			} catch (error) {
				throw error
			}
		}
	
		useEffect(() => {
			fetchLeaveCategories()
		}, [])

		const renderUserImg = () => {
			if(!user) return <Avatar
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
			if(user.avatar) return (
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
			console.log("ini onleave yey")
			setToggleModal(true)
		}

		const postLeave = async(arg) => {
			console.log(arg, "arg postleave")
			try {
				arg.users = [user.id]
				console.log(arg.users,"users")
				setIsLoading(true)
				const status = await Api.post(`/hris/leave-request`, arg)
				setIsLoading(false)
				if(!status) return toast.error(data, {
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
																	{user && user.employee_attribute? user.employee_attribute.status : "Staff"}
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
															<span>{user.user ? user.user.name : '-'}</span>
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
															<span>{user.employee_attribute  ? dateFormat(user.employee_attribute.join_date) : '-'}</span>
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
												balance.length ? 
													balance.map(x => (
														<tr key={x.id}>
															<td>{x.leave ? x.leave.name : '-'}</td>
															<td>{x.balance} days</td>
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
										<Edit size={13}/> 
										<span className='align-middle ms-25' onClick={onEditLeave}>Edit</span>
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
										<h4 className='fw-bolder'>{usersDivision.title}</h4>
										<Link
											to='/'
											className='role-edit-modal'
											onClick={e => {
											e.preventDefault()
											// setModalType('Edit')
											// setShow(true)
											}}
										>
											<small className='fw-bolder'>Edit Role</small>
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
					</Col>
				</Row>

				<Modal
          isOpen={toggleModal}
          toggle={() => setToggleModal(!toggleModal)}
          className={`modal-dialog-centered modal-lg`}
        >
          <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
            Leave form
          </ModalHeader>
          <ModalBody>
							<LeaveForm 
								leave={leaveCategories} 
								balance={balance} 
								onSubmit={postLeave}
								isLoading={isLoading}
								// close={() => setToggleModal(!toggleModal)}
							/>
          </ModalBody>
      	</Modal>
			</>
		)
}   