import { 
  Col, Row, Button, Input,
  Modal, ModalHeader, ModalBody, Card, CardBody, CardHeader, CardTitle
 } from "reactstrap"
import { ChevronDown, Trash } from "react-feather"
import { monthName, mustNumber, numberFormat } from "../../../Helper"
import FormUserAssign from "../Components/FormUserAssign"
import { useState, useEffect, useRef } from "react"
import Api from "../../../sevices/Api"
import dayjs from "dayjs"
import FormIncome from "./Component/FormIncome"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function PayrollForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [toggleModal, setToggleModal] = useState(false)
  const [modal, setModal] = useState({
    title: "User assign",
    mode: "get",
    item: null
  })
  const [users, setUsers] = useState([])
  const [userSelect, setUserSelect] = useState(null)
  const periodeRef = useRef()
  const currentMonth = dayjs().format('M')
  const [info, setInfo] = useState(null)
  const [loans, setLoans] = useState(null)
  const [periode, setPeriode] = useState('')
  const [addjustment, setAddjustment] = useState([{name:'Basic salary', amount:0}])
  const [deductions, setDeductions] =  useState([
    {name:'Pajak Penghasilan', amount:0},
    {name:'BPJS (JHT)', amount:0},
    {name:'BPJS (JP)', amount:0},
    {name:'BPJS Kesehatan', amount:0},
    {name:'Potongan Absensi', amount:0},
    {name:'Potongan Keterlambatan', amount:0},
    {name:'Potongan Pinjaman', amount:0}
  ])
  const [totalAddjustment, setTotalAddjustment] = useState(0)
  const [totalDeduction, setTotalDeduction] = useState(0)

  const fetchUser = async () => {
    try {
      const data = await Api.get(`/hris/employee?no_paginate=true`)
      if (data) {
        const userData = data.map((x) => {
          return {
            value: x.id,
            label: x.email
          }
        })
        setUsers([...userData])
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    periodeRef.current.value = currentMonth
    fetchUser()
  }, [])

  
  const fetchPayroll = async () => {
    try {
      if (!id) return
      const data = await Api.get(`/hris/payroll/${id}`)
      const addj = data.items.filter(x => x.flag === 'addjusment')
      const dedu = data.items.filter(x => x.flag !== 'addjusment')
      if (addj.length) {
        setAddjustment([
          ...addj.map(x => {
            x.name = x.label
            return x
          })
        ])
      }

      if (dedu.length) {
        setDeductions([
        ...dedu.map(x => {
                x.name = x.label
                return x
              })
        ])
      }
      setTotalDeduction(
        dedu.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
        )
        setTotalAddjustment(
          addj.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
          )
          
          periodeRef.current.value = dayjs(data.periode).format('M')
          setUserSelect({
            value:data.user.id,
            label:data.user.email
          })
        } catch (error) {
          throw error
        }
      }
      
  useEffect(() => {
    fetchPayroll()
  }, [])

  const onPickEmployee = () => {
    setModal({
      title: "Pick Employee",
      mode: "pick_employee",
      item: null
    })
    setToggleModal(true)

  }

  const calcualteSalary = (addjustmentArr = [], deductionArr = []) => {
    const sumAddjustment = addjustmentArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    const sumDeduction = deductionArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    setTotalAddjustment(sumAddjustment)
    setTotalDeduction(sumDeduction)
  }

  const fetchAttendance = async(user = '') => {
   
    const uid = user ? user : userSelect.value 
    if (uid && periodeRef.current.value) {
      const periode = `${dayjs().format('YYYY')}-${periodeRef.current.value}`
      try {
        const data = await Api.get(`/hris/payroll/by-user?user_id=${uid}&periode=${periode}`)
        setInfo(data)

        const loans_per_month = data.loans.map(x => (
          x.loan_amount / x.tenor
        ))
        sumLoans(loans_per_month)
        const p = `${dayjs(data.cut_off_start).format('DD-MMM')  } - ${  dayjs(data.cut_off_end).format('DD-MMM')  } ${  dayjs(data.cut_off_end).format('YYYY')}`
        setPeriode(p)
        setAddjustment([...data.income_list])
        calcualteSalary(data.income_list, deductions)
      } catch (error) {
        throw error
      }
    }
  }
  
  const sumLoans = (loans) => {
    console.log(loans, "loans params")
    let sum =0 
    for (let i=0; i<loans.length; i++){
      sum += loans[i]
    }
    setLoans(parseInt(sum))
    console.log(sum,"sum ")
    return sum
  }

  const onSelectEmployee = (arg) => {
    setUserSelect({...arg})
    setToggleModal(false)
    fetchAttendance(arg.value)
  }

  const onNewAddjustment = (income = true) => {
    const params = {
      title: "Add Addjustment",
      mode: "income",
      item: null
    }
    if (!income) {
      params.title = "Add Deduction"
    }
    setModal(params)
    setToggleModal(true)
  }

  const onSubmitIncome = (arg) => {
    if (modal.title === 'Add Addjustment') {
      const oldIncome = addjustment
      oldIncome.push(arg)
      setAddjustment([...oldIncome])
      calcualteSalary(oldIncome, deductions)
    } else {
      const oldDeduction = deductions
      oldDeduction.push(arg)
      setDeductions([...oldDeduction])
      calcualteSalary(addjustment, oldDeduction)

    }
    setToggleModal(false)
  }

  const onSubmitForm = async(approved = false) => {
    const params = {
      user:userSelect ? userSelect.value : null,
      periode:periodeRef.current.value,
      deductions,
      addjustment,
      approved
    }

    if (!params.user || !params.periode || !params.deductions.length || !params.addjustment.length) return toast.error(`Error : Invalid form`, {
      position: "top-center"
    })
    const url = id ? `/hris/payroll/${id}` : '/hris/payroll'

    try {
      
      let data = null
      if (id) {
        data = await Api.put(url, params)
      } else {
        data = await Api.post(url, params)
      }
      console.log(data, 'data');
      if (typeof data.status !== 'undefined' && !data.status) return toast.error(`Error : ${data.data}`, {
        position: "top-center"
      })
      toast.success(data.data, {
        position: "top-center"
      })

      const lastId = data.data.id

      window.location.href = `/payroll/${lastId}`

    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center"
      })
    }
  }

  const handleInputAddjustment = (e, index) => {
    const value = e.target.value
    const old = addjustment
    old[index].amount = value
    setAddjustment([...old])
    calcualteSalary(old, deductions)
  }

  const handleInputDeduction = (e, index) => {
    const value = e.target.value
    const old = deductions
    old[index].amount = value
    setDeductions([...old])
    calcualteSalary(addjustment, old)
  }

  const onDeleteItem = (d, index) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (!result) return
      if (d === 'd') {
        const oldD  = deductions
        oldD.splice(index, 1)
        setDeductions([...oldD])
      } else {
        const oldA  = addjustment
        oldA.splice(index, 1)
        setAddjustment([...oldA])
      }
      calcualteSalary(addjustment, deductions)
    })
  }

  return (
    <>
      <Row>
        <Col lg="12" className="mb-2 d-flex">
          <div className="mr-5" style={{marginRight:'1rem'}}>
            <Button
              outline
              onClick={onPickEmployee}
            >
              {userSelect ? userSelect.label : "Pick employee"}
              <ChevronDown size={15} />
            </Button>
          </div>
          <div className="col-3">
          <Input
            id="exampleSelect"
            name="select"
            type="select"
            placeholder="Periode"
            onChange={() => fetchAttendance()}
            innerRef={periodeRef}
          >
              <option value="">Select periode</option>
              {
                monthName().map((x, index) => (
                  <option value={index + 1} key={x}>
                    {x}
                  </option>
                ))
              }
            </Input>
          </div>
        </Col>
        <Col lg="8">
          <Card>
            <CardHeader>
              <CardTitle>Addjustments</CardTitle>
            </CardHeader>
            <CardBody>
              {
                addjustment.map((x, index) => (
                  <div key={index} className='invoice-total-item d-flex flex-row justify-content-between align-items-center mb-2'>
                    <div className="" style={{width:'30%'}}>
                      {x.name}
                    </div>
                    <div className="w-50">
                      <Input value={x.amount} className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputAddjustment(e, index)}/>
                    </div>
                    <div className="">
                      {addjustment.length > 1 ? <Button outline color="danger" size="sm" onClick={() => onDeleteItem('a', index)}>X</Button> : <></>}
                    </div>
                  </div>
                ))
              }
              <div className='invoice-total-item d-flex flex-row justify-content-end'>
                <Button size="sm" onClick={onNewAddjustment}>Add</Button>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
            </CardHeader>
            <CardBody>
              {
                deductions.map((x, index) => (
                  <div key={index} className='invoice-total-item d-flex flex-row justify-content-between align-items-center mb-2'>
                    <div className="" style={{width:'30%'}}>
                      {x.name}
                    </div>
                    <div className="w-50">
                      <Input value={loans && x.name == "Potongan Pinjaman"? loans : x.value} className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputDeduction(e, index)}/>
                    </div>
                    <div className="">
                      {deductions.length > 1 ? <Button outline color="danger" size="sm" onClick={() => onDeleteItem('d', index)}>X</Button> : <></>}
                    </div>
                  </div>
                ))
              }
              <div className='invoice-total-item d-flex flex-row justify-content-end'>
                <Button size="sm" onClick={() => onNewAddjustment(false)}>Add</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4">
          <Card>
            <CardBody>
              <Col className='d-flex justify-content-end' md='12'>
                <div className='invoice-total-wrapper w-100'>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Periode</p>
                    <p className='invoice-total-title'>{periode}</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Total Workday</p>
                    <p className='invoice-total-title'>{info ? info.total_workday : 0} Days</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Total Attendance</p>
                    <p className='invoice-total-title'>{info ? info.total_attendance : 0} Days</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Absence</p>
                    <p className='invoice-total-title'>{info ? info.total_absence : 0} Days</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Leave</p>
                    <p className='invoice-total-title'>{info ? info.total_leave : 0} Days</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Lateness</p>
                    <p className='invoice-total-title'>{info ? info.total_late.length : 0} Days</p>
                  </div>
                </div>
              </Col>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Col className='d-flex justify-content-end' md='12'>
                <div className='invoice-total-wrapper w-100'>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Total Addjustment</p>
                    <p className='invoice-total-title'>Rp {numberFormat(totalAddjustment)}</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Total Deductions</p>
                    <p className='invoice-total-title'>Rp {numberFormat(totalDeduction)}</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title fw-bold'>TOTAL SALARY</p>
                    <p className='invoice-total-title fw-bold'>Rp {numberFormat(totalAddjustment - totalDeduction)}</p>
                  </div>
                </div>
              </Col>
            </CardBody>
          </Card>
        </Col>
       
        <Col lg="8">
          <div className="d-flex justify-content-end gap-2">
            <Button color="dark" onClick={() => onSubmitForm(true)}>Submit & Approved</Button>
            <Button color="success" onClick={() => onSubmitForm(false)}>Submit</Button>
          </div>
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
          {
            modal.mode === 'pick_employee' ? <FormUserAssign
              options={users}
              close={() => setToggleModal(false)}
              multiple={false}
              disable={true}
              onSelect={onSelectEmployee}
            /> : <></>
          }
          {
            modal.mode === 'income' ? <FormIncome onSubmit={onSubmitIncome}/> : <></>
          }
          
        </ModalBody>
      </Modal>
    </>
  )
}