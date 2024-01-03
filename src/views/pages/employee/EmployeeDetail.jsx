import { Fragment, useEffect, useState } from "react";
import {
  Card, CardBody, Col, Row, Badge, CardHeader, Table, CardTitle, CardFooter, Button,
  Modal, ModalHeader, ModalBody, Label, Form, Input
} from "reactstrap";
import Avatar from '@components/avatar'
import Api from '../../../sevices/Api'
import { Link, useParams } from 'react-router-dom'
import { capitalize, dateFormat, numberFormat } from "../../../Helper/index";
import { Copy, Edit, Trash } from "react-feather";
import LeaveForm from "./component/LeaveForm";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AvatarGroup from "@components/avatar-group";
import UserTimeline from "./view/UserTimeline";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/index";
import HealthForm from "./component/IncomeForm";
import IncomeForm from "./component/IncomeForm";
import PenaltyForm from "./component/Penalty/PenaltyForm";
import DepartmentList from "./DepartmentList";
import IncomeList from "./IncomeList";
const MySwal = withReactContent(Swal);


export default function EmployeeDetail() {
  const id = useParams()
  // console.log(id, 'nid')

  const [toggleModal, setToggleModal] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [user, setUser] = useState([])
  const [balance, setBalance] = useState([])
  const [userBalance, setUserBalance] = useState([])
  const [userDepartment, setUserDepartment] = useState([])
  const [logUser, setLogUser] = useState([])
  const [leaveCategories, setLeaveCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [income, setIncome] = useState([])
  const [modal, setModal] = useState({
    title: "Leave Balances",
    mode: "get leave",
    item: null
  })

  const fetchUser = async () => {
    try {
      const { status, data } = await Api.get(`/hris/employee/${id.uid}`)
      if (status) {
        setUser(data)
        setBalance([...data.leave_balances])
      }
    } catch (error) {
      throw error
    }
  }
  console.log(income, "income")
  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUserTeam = async () => {
    try {
      const { status, data } = await Api.get(`/hris/employee/department/${id.uid}`)
      console.log(data, 'ni data')
      if (status) {
        const dataTeam = data.map((x) => {
          return {
            title: x.name,
            img: x.avatar,
            imgHeight: 26,
            imgWidth: 26
          }
        })
        setUserDepartment(data)
      }
    } catch (error) {
      throw error

    }
  }

  useEffect(() => {
    fetchUserTeam()
  }, [])

  const fetchLeaveCategories = async () => {
    try {
      const { status, data } = await Api.get(`/hris/leave-category`)
      if (status) {
        setLeaveCategories([...data])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchLeaveCategories()
  }, [])

  const fetchIncome = async () => {
    try {
      const { status, data } = await Api.get(`/hris/employee-income/${id.uid}`)
      if (status) {
        setIncome([...data])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [])

  const fecthLogUser = async () => {
    try {
      const data = await Api.get(`/auth/log/${id.uid}`)
      setLogUser([...data])
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fecthLogUser()
  }, [])

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
    console.log(x, "add config")
    setModal({
      title: "Employee Income Form",
      mode: "income",
      item: x
    })
    setToggleModal(true)
  }

  const postLeave = async (arg) => {
    try {
      setIsLoading(true)
      const { status, data } = await Api.post(`/hris/employee/${id.uid}/assign-leave`, arg)
      setToggleModal(false)
      if (status)
        return toast.error(data, {
          position: 'top-center'
        })
      toast.success('Successfully added employee!', {
        position: 'top-center'
      })
      fetchUser()
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message, {
        position: 'top-center'
      })
      throw error
    }
  }

  const postIncome = async (params) => {
    console.log(params, 'OOOO')
    // return
    try {
      const { status, data } = await Api.post(`/hris/employee-income/${id.uid}`, params)
      console.log(status, 'PPPP')
      if (!status) {
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      } else {
        fetchIncome();
        fetchUser()
        toast.success("Income has updated", {
          position: "top-center",
        });
      }
      setToggleModal(false);
    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  const onDelete = (x) => {
    console.log(x, "test delete")
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
          if (!status)
            return toast.error(`Error : ${data}`, {
              position: "top-center",
            });
          setIsRefresh(true);
          fetchIncome()
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

  return (
    <>
      <Row>
        <Col xl='4' lg='4' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
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
                    <li className='mb-75 d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Join Date</span>
                      <span>{user.employee_attribute ? dateFormat(user.employee_attribute.join_date) : '-'}</span>
                    </li>

                    {/* <span>Employee Attribute</span> */}
                    <li className='mb-75  d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>DOB</span>
                      <span className='text-capitalize'> {user.employee_attribute ? dateFormat(user.employee_attribute.dob) : '-'}</span>
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
                      <span className='fw-bolder me-25'>Phone Number</span>
                      <span>{user ? user.phone : '-'}</span>
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
                      <span className='fw-bolder me-25'>Marital status</span>
                      <span>{user && user.employee_attribute ? user.employee_attribute.marital_status === "married" ? "Married" : '-' : "-"}</span>
                    </li>
                    <li className='mb-75 d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Dependents</span>
                      <span>{user && user.employee_attribute ? user.employee_attribute.dependents : "0"} person</span>
                    </li>

                    {/* <span>Position</span> */}
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
                      <span className='fw-bolder me-25'>Position</span>
                      <span>{user ? user.position : user.title}</span>
                    </li>
                    <li className='mb-75  d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Level</span>
                      <span>{user ? user.level : "-"}</span>
                    </li>
                    <li className='mb-75  d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>NIP</span>
                      <span>{user ? user.nip : '-'}</span>
                    </li>

                    {/* <span className="justify-center">Bank</span> */}
                    <li className='mb-75 d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Bank Account</span>
                      <span>{user && user.employee_attribute ? user.employee_attribute.bank_Account : "-"}</span>
                    </li>
                    <li className='mb-75 d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Bank Account Name</span>
                      <span>{user && user.employee_attribute ? user.employee_attribute.bank_Account_Name : "-"}</span>
                    </li>
                    <li className='mb-75 d-flex justify-content-between'>
                      <span className='fw-bolder me-25'>Bank Number</span>
                      <span>{user && user.employee_attribute ? user.employee_attribute.bank_Account_Number : "-"} </span>
                    </li>
                  </ul>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Col>
            <IncomeList onDelete={onDelete} onEditIncome={onEditIncome} income={income} />
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
                      <th className='fs-6'>Current Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      balance.length ?
                        balance.map(x => x.category !== null ?
                          (
                            <tr key={x.id}>
                              <td>{x.category ? x.category.name : '-'}</td>
                              <td>{x.balance ? x.balance : "0"} days</td>
                            </tr>
                          ) : null) : <>
                          <tr>
                            <td colSpan={2} className="text-center">Empty leave</td>
                          </tr>
                        </>
                    }
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Fragment>
                  <Button.Ripple
                    size="sm"
                    color="warning"
                    onClick={(e) => { e.preventDefault(); onEditLeave() }}
                  >
                    <Edit size={13} />
                    <span className="align-middle ms-25">Edit Leave</span>
                  </Button.Ripple>
                </Fragment>
              </CardFooter>
            </Card>
          </Col>
          <Col>
            <DepartmentList data={userDepartment} />
          </Col>
          <Col>
            <Card>
              <UserTimeline userLog={logUser} />
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
          {modal.mode === "leave" ?
            <LeaveForm
              leave={leaveCategories}
              balance={balance}
              userBalance={userBalance}
              onSubmit={postLeave}
              isLoading={isLoading}
              close={() => setToggleModal(!toggleModal)}
            /> : <></>}
          {modal.mode === "income" ?
            <IncomeForm
              isLoading={isLoading}
              close={() => setToggleModal(!toggleModal)}
              income={modal.item}
              onSubmit={postIncome}
            /> : <></>}
          {modal.mode === "penalty" ?
            <PenaltyForm
              isLoading={isLoading}
              close={() => setToggleModal(!toggleModal)}
              onSubmit={postPenalty}
              penalty={modal.item}
            /> : <></>}
        </ModalBody>
      </Modal>
    </>
  )

}   