import { 
  Col, Row, Button, Input,
  Modal, ModalHeader, ModalBody, Card, CardBody, CardHeader, CardTitle
 } from "reactstrap"
import { ChevronDown } from "react-feather"
import { monthName, mustNumber, numberFormat } from "../../../Helper"
import FormUserAssign from "../Components/FormUserAssign"
import { useState, useEffect, useRef } from "react"
import Api from "../../../sevices/Api"
import dayjs from "dayjs"
import FormIncome from "./Component/FormIncome"

export default function PayrollForm() {
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
  const [periode, setPeriode] = useState('')
  const [addjusment, setAddjusment] = useState([{name:'Basic salary', amount:0}])
  const [deductions, setDeductions] =  useState([
    {name:'Pajak Penghasilan', amount:0},
    {name:'BPJS (JHT)', amount:0},
    {name:'BPJS (JP)', amount:0},
    {name:'BPJS Kesehatan', amount:0},
    {name:'Potongan Absensi', amount:0},
    {name:'Potongan Keterlambatan', amount:0},
    {name:'Potongan Pinjaman', amount:0}
  ])
  const [totalAddjusment, setTotalAddjusment] = useState(0)
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

  const onPickEmployee = () => {
    setModal({
      title: "Pick Employee",
      mode: "pick_employee",
      item: null
    })
    setToggleModal(true)

  }

  const calcualteSalary = (addjusmentArr = [], deductionArr = []) => {
    const sumAddjusment = addjusmentArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    const sumDeduction = deductionArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    setTotalAddjusment(sumAddjusment)
    setTotalDeduction(sumDeduction)
  }

  const fetchAttendance = async(user = '') => {
   
    const uid = user ? user : userSelect.value 
    if (uid && periodeRef.current.value) {
      const periode = `${dayjs().format('YYYY')}-${periodeRef.current.value}`
      try {
        const data = await Api.get(`/hris/payroll/by-user?user_id=${uid}&periode=${periode}`)
        setInfo(data)
        const p = `${dayjs(data.cut_off_start).format('DD-MMM')  } - ${  dayjs(data.cut_off_end).format('DD-MMM')  } ${  dayjs(data.cut_off_end).format('YYYY')}`
        setPeriode(p)
        setAddjusment([...data.income_list])
        calcualteSalary(data.income_list, deductions)
      } catch (error) {
        throw error
      }
    }
  }

  const onSelectEmployee = (arg) => {
    setUserSelect({...arg})
    setToggleModal(false)
    fetchAttendance(arg.value)
  }

  const onNewAddjusment = (income = true) => {
    const params = {
      title: "Add Addjusment",
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
    if (modal.title === 'Add Addjusment') {
      const oldIncome = addjusment
      oldIncome.push(arg)
      setAddjusment([...oldIncome])
      calcualteSalary(oldIncome, deductions)
    } else {
      const oldDeduction = deductions
      oldDeduction.push(arg)
      setDeductions([...oldDeduction])
      calcualteSalary(addjusment, oldDeduction)

    }
    setToggleModal(false)
  }

  const onSubmitForm = (approved = false) => {
    if (!userSelect) return
    const params = {
      user:userSelect.value,
      periode:periodeRef.current.value,
      deductions,
      addjusment,
      approved
    }
    console.log(params)
  }

  const handleInputAddjusment = (e, index) => {
    const value = e.target.value
    const old = addjusment
    old[index].amount = value
    setAddjusment([...old])
    calcualteSalary(old, deductions)
  }

  const handleInputDeduction = (e, index) => {
    const value = e.target.value
    const old = deductions
    old[index].amount = value
    setDeductions([...old])
    calcualteSalary(addjusment, old)
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
              <CardTitle>Addjusments</CardTitle>
            </CardHeader>
            <CardBody>
              {
                addjusment.map((x, index) => (
                  <div key={index} className='invoice-total-item d-flex flex-row justify-content-between align-items-center mb-2'>
                    <div className="">
                      {x.name}
                    </div>
                    <div className="w-50">
                      <Input value={x.amount} className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputAddjusment(e, index)}/>
                    </div>
                  </div>
                ))
              }
              <div className='invoice-total-item d-flex flex-row justify-content-end'>
                <Button size="sm" onClick={onNewAddjusment}>Add</Button>
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
                    <div className="">
                      {x.name}
                    </div>
                    <div className="w-50">
                      <Input defaultValue={x.amount} className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputDeduction(e, index)}/>
                    </div>
                  </div>
                ))
              }
              <div className='invoice-total-item d-flex flex-row justify-content-end'>
                <Button size="sm" onClick={() => onNewAddjusment(false)}>Add</Button>
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
                    <p className='invoice-total-title'>Total Addjusment</p>
                    <p className='invoice-total-title'>Rp {numberFormat(totalAddjusment)}</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title'>Total Deductions</p>
                    <p className='invoice-total-title'>Rp {numberFormat(totalDeduction)}</p>
                  </div>
                  <div className='invoice-total-item d-flex flex-row justify-content-between'>
                    <p className='invoice-total-title fw-bold'>TOTAL SALARY</p>
                    <p className='invoice-total-title fw-bold'>Rp {numberFormat(totalAddjusment - totalDeduction)}</p>
                  </div>
                </div>
              </Col>
            </CardBody>
          </Card>
        </Col>
       
        <Col lg="8">
          <div className="d-flex justify-content-end gap-2">
            <Button color="success" onClick={() => onSubmitForm(false)}>Submit</Button>
            <Button color="primary" onClick={() => onSubmitForm(true)}>Submit & Approved</Button>
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