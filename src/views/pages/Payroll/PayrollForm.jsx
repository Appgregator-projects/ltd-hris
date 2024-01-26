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
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { add } from "lodash"
const MySwal = withReactContent(Swal)
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat);

import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "flatpickr/dist/plugins/monthSelect/style.css";
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/flatpickr.min.css";
import "@styles/react/libs/tables/react-dataTable-component.scss"
import moment from "moment";

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
  const [picker, setPicker] = useState(dayjs().format('MMMM YYYY'))
  const [info, setInfo] = useState(null)
  const [loans, setLoans] = useState(null)
  const [type, setType] = useState("")
  const [periode, setPeriode] = useState('')
  const [addjustment, setAddjustment] = useState([{ name: 'Basic salary', amount: 0 }])
  const [finalAddj, setFinalAddj] = useState([])
  const [finalDedu, setFinalDedu] = useState([])
  const [deductions, setDeductions] = useState([
    { name: 'Pajak Penghasilan', amount: 0 },
    { name: 'BPJS (JHT) Employee', amount: 0 },
    { name: 'BPJS (JP) Employee', amount: 0 },
    { name: 'BPJS Kesehatan Employee', amount: 0 },
    { name: 'Potongan Absensi', amount: 0 },
    { name: 'Potongan Keterlambatan', amount: 0 },
    { name: 'Potongan Pinjaman', amount: 0 }
  ])
  const [listDeductions, setListDeductions] = useState([]);
  const [bpjs_employee, setEmployee] = useState([])
  const [bpjs_company, setCompany] = useState([])
  const [totalAddjustment, setTotalAddjustment] = useState(0)
  const [totalDeduction, setTotalDeduction] = useState(0)

  const fetchUser = async () => {
    try {
      const data = await Api.get(`/hris/employee?no_paginate=true`)
      // const allDeductions = await Api.get()
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
    // periodeRef.current.value = currentMonth
    fetchUser()
  }, [])

  const fetchPayroll = async () => {
    try {
      if (!id) return
      const data = await Api.get(`/hris/payroll/${id}`)

      const addj = data.items.filter(x => x.flag === 'addjusment' || x.flag === 'addjustment')
      const dedu = data.items.filter(x => x.flag === 'deduction')
      if (addj.length) {
        setAddjustment([
          ...addj.map(x => {
            x.name = x.name
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
        value: data.user.id,
        label: data.user.email
      })

      if (data.items.length === 0) {
        return MySwal.fire({
          title: "This user income is unset",
          text: "Would you want to set this user income?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes, set this income!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ms-1",
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.value) {
            navigate(`/employee/${data.user.id}`)
          }
        });
      }
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

  const fetchBPJS = async () => {
    try {
      const data = await Api.get(`/hris/bpjs-rule`)
      setListDeductions([...data])
    } catch (error) {
      throw error
    }
  }


  useEffect(() => {
    if (!id) {

      fetchBPJS()
    }
  }, [])

  const calcualteSalary = (addjustmentArr = [], deductionArr = []) => {
    const sumAddjustment = addjustmentArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    const sumDeduction = deductionArr.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
    setTotalAddjustment(sumAddjustment)
    setTotalDeduction(sumDeduction)
  }



  const calculateLoans = (item) => {

    if (item) {
      let sumLoans = 0
      const loans_per_month = item.map(x => (x.loan_amount / x.tenor))
      for (let i = 0; i < loans_per_month.length; i++) {
        sumLoans += loans_per_month[i]
      }
      setLoans({ name: "Potongan Pinjaman", amount: sumLoans })
      const indexLoans = deductions.findIndex(y => y.name === "Potongan Pinjaman")
      deductions[indexLoans].amount = sumLoans
      setDeductions(deductions)

    } else {
      setLoans()
    }
  }


  const deductionsMath = async (item) => {
    try {
      const income = item.income_list

      if (!id) {
        calculateLoans(item.loans)
      }
      if (income.length) {
        const salaryType = info.payroll_type
        setType(salaryType)

        const basicSalary = income?.find(x => x.type === "Basic")

        if (basicSalary) {
          const BPJSEmployee = listDeductions?.map(x => {

            const top = parseInt(x.topper)
            const amount = Math.round(x.percent_employee / 100 * basicSalary.amount)
            return {
              name: x.name + " Employee",
              amount: amount >= top ? top : amount,
              flag: ""
            }
          }).filter(x => x.amount !== 0)
          setEmployee(BPJSEmployee)

          const BPJSCompany = listDeductions?.map(x => {
            return {
              name: x.name + " Company",
              amount: Math.round(x.percent_company / 100 * basicSalary.amount),
              flag: ""
            }
          })
          setCompany(BPJSCompany)
          let newDedu = []
          await deductions.map((x) => {
            const matchingBPJS = BPJSEmployee.find((y) => y.name === x.name);

            if (matchingBPJS) {
              const existingDeduIndex = newDedu.findIndex((item) => item.name === x.name);

              if (existingDeduIndex !== -1) {
                // Jika nama sudah ada di newDedu, update amount
                newDedu[existingDeduIndex].amount += matchingBPJS.amount || 0;
              } else {
                // Jika nama belum ada di newDedu, tambahkan objek baru
                newDedu.push({ name: x.name, amount: matchingBPJS.amount || 0 });
              }
            } else {
              // Jika tidak ada nama yang cocok di BPJSEmployee, tambahkan objek baru dengan amount 0
              const existingDeduIndex = newDedu.findIndex((item) => item.name === x.name);
              if (existingDeduIndex === -1) {
                newDedu.push({ name: x.name, amount: 0 });
              }
            }

            return x;
          });

          // Tambahkan objek baru dari BPJSEmployee yang tidak ada di deductions
          await BPJSEmployee.forEach((y) => {
            const existingDeduIndex = newDedu.findIndex((item) => item.name === y.name);
            if (existingDeduIndex === -1) {
              newDedu.push({ name: y.name, amount: y.amount || 0 });
            }
          })
          if (!id) {


            const indexLoans = await newDedu.findIndex(y => y.name === "Potongan Pinjaman")
            newDedu[indexLoans].amount = loans?.amount
          }
          const feePerDay = basicSalary.amount / info?.total_workday
          const notAbsence = info?.total_workday - info?.total_attendance - info?.total_leave - info?.dayOff
          const sumNotAbsence = feePerDay * notAbsence
          const indexAbsensi = await newDedu.findIndex(y => y.name === "Potongan Absensi")
          newDedu[indexAbsensi].amount = parseFloat(sumNotAbsence).toFixed(0)

          setDeductions([...newDedu])

          let newAddj = info.income_list
          if (info.overtimes) {
            newAddj.push({
              label_allowance: 'Lembur',
              amount: (parseInt(basicSalary.amount) / info.total_workday / 8) * info.overtimes
            })
          }
          const newDeduAddj = newDedu.filter((x) => !x.name.includes('Potongan'));

          newAddj = await info.payroll_type === 'gross' ? newAddj : [...newAddj, ...newDeduAddj]

          setAddjustment([...newAddj])
          calcualteSalary(newAddj, deductions)
          setAllPayroll(newDedu)
        }
      } else {
        // toast.error("This user haven't income type to setting", {
        //   position: "top-center",
        // });
        return MySwal.fire({
          title: "This user income is unset",
          text: "Would you want to set this user income?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes, set this income!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ms-1",
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.value) {
            navigate(`/employee/${userSelect.value}`)
          }
        });
      }

    } catch (error) {
      throw error
    }
  }


  const setAllPayroll = (dedu) => {
    // return console.log(addjustment)
    try {
      const newDedu = [...dedu, ...bpjs_company, ...bpjs_employee]
      const filteredData = newDedu.reduce((result, currentObj) => {
        const existingObjIndex = result.findIndex(obj => obj.name === currentObj.name);

        if (existingObjIndex !== -1) {
          if (currentObj.amount !== 0) {
            result[existingObjIndex] = currentObj;
          }
        } else {
          result.push(currentObj);
        }

        return result;
      }, []);

      if (type == "nett") {
        const addjustmentNett = [...addjustment, ...bpjs_company]
        setFinalAddj(addjustmentNett)
        setFinalDedu(filteredData)
        console.log(addjustmentNett, "nett")
      } else {
        const addjustmentGross = [...addjustment, ...bpjs_company]
        setFinalAddj(addjustmentGross)
        setFinalDedu([...dedu, ...bpjs_company])
        console.log(addjustmentGross, "gross")
      }
      return console.log([...bpjs_employee, loans])
    } catch (error) {
      throw error
    }

  }

  const fetchAttendance = async (user = '') => {
    // return console.log(user, "user")
    const uid = user ? user : userSelect.value
    if (uid && picker) {
      // const periode = `${dayjs().format('YYYY')}-${periodeRef.current.value}`
      const periode = picker

      try {
        const data = await Api.get(`/hris/payroll/by-user?user_id=${uid}&periode=${periode}`)
        console.log(data, 'p')
        setInfo(data, user)
        const p = `${dayjs(data.cut_off_start).format('DD MMM YYYY')} - ${dayjs(data.cut_off_end).format('DD MMM YYYY')}`;
        const basicSalary = data?.income_list?.find(x => x.type === "Basic")

        setPeriode(p)
        if (!id) {


          deductionsMath(data, user)
        }
      } catch (error) {
        throw error
      }
    }
  }


  useEffect(() => {
    if (userSelect?.value) {
      fetchAttendance(userSelect?.value)
    }

  }, [userSelect?.value])

  useEffect(() => {
    if (userSelect?.value) {
      fetchAttendance(userSelect?.value)
    }
  }, [picker])

  useEffect(() => {
    if (info && !id) {
      deductionsMath(info)
    }
  }, [info])

  useEffect(() => {
    if (info) {
      calcualteSalary(addjustment, deductions)
    }
  }, [deductions])


  const onSelectEmployee = (arg) => {
    setUserSelect({ ...arg })
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

  const onSubmitForm = async (approved = false, arg) => {
    const addjust = finalAddj
    const newDataAddjustment = addjust.map(item => {
      // Jika properti 'label_allowance' ada, ganti namanya menjadi 'flag'
      if (item.hasOwnProperty('label_allowance')) {
        item.name = item.label_allowance;
        delete item.label_allowance;
      }

      return item;
    });
    const newDate = moment(picker[0]).format("LL").split(' ')
    const realPeriode = `${newDate[0]} ${newDate[2]}`

    const params = {
      user: userSelect ? userSelect.value : null,
      periode: realPeriode,
      type: type,
      addjustment: id ? addjustment : newDataAddjustment,
      deductions: id ? deductions : finalDedu,
      approved
    }
    // return console.log(params, 'pp', addjustment, 'addj', deductions, 'sess')
    if (!params.user || !params.periode || !params.deductions.length || !params.addjustment.length)
      return toast.error(`Error : Invalid form`, {
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
      console.log(data, 'par')

      if (typeof data.status !== 'undefined' && !data.status) {
        return toast.error(`Error : ${data.data}`, {
          position: "top-center"
        })
      } else {
        toast.success(data.data, {
          position: "top-center"
        })
      }
      const lastId = data.data.id
      const idLast = lastId ? lastId : id
      // return lastId
      window.location.href = `/payroll/${idLast}`

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
    if (value) {
      const BPJSCompany = listDeductions.map(x => {
        x.percentage / 100 * value
        return {
          name: x.name,
          amount: Math.round(x.percent_company / 100 * value)
        }
      })
      setCompany(BPJSCompany);
      const BPJSEmployee = listDeductions.map(x => {
        let employee_percent = x.percent_employee === 0 ? undefined : x.percent_employee
        if (employee_percent !== undefined) {
          return {
            name: x.name,
            amount: Math.round(employee_percent / 100 * value)
          }
        }
      }).filter(item => item !== undefined);
      setEmployee(BPJSEmployee);
    }
    calcualteSalary(old, deductions)
  }

  const handleInputDeduction = (e, index) => {
    const value = e.target.value

    const old = deductions
    old[index].amount = value
    setDeductions([...old])
    calcualteSalary(addjustment, old)
  }

  const handleNewIncome = (params, type) => {
    let newArr = []
    if (type.toLowerCase().includes('addjustment')) {
      newArr = addjustment
      newArr.push(params)
      setAddjustment(newArr)
      calcualteSalary(newArr, deductions)

    } else {
      newArr = deductions
      newArr.push(params)
      setDeductions(newArr)
      calcualteSalary(addjustment, newArr)
    }
    setAllPayroll(deductions)
    setToggleModal(!toggleModal)
    setModal({
      title: "",
      mode: "",
      item: null
    })
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
        const oldD = deductions
        oldD.splice(index, 1)
        setDeductions([...oldD])
      } else {
        const oldA = addjustment
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
          <div className="mr-5" style={{ marginRight: '1rem' }}>
            <Button
              outline
              onClick={onPickEmployee}
            >
              {userSelect ? userSelect.label : "Pick employee"}
              <ChevronDown size={15} />
            </Button>
          </div>
          <div className="col-2">
            <Flatpickr
              id='range-picker'
              className='form-control'
              value={picker}
              onChange={date => setPicker(date)}
              options={{
                plugins: [
                  new monthSelectPlugin({
                    shorthand: true,
                    dateFormat: "F Y",
                    altInput: true,
                    altFormat: "m/y",
                    theme: "light"
                  })
                ]
              }}
            />
            {/* <Input
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
            </Input> */}
          </div>
        </Col>
        <Col lg="8">
          <Card>
            <CardHeader>
              <CardTitle>Addjustments</CardTitle>
            </CardHeader>
            <CardBody>
              {
                addjustment?.map((x, index) => (
                  <div key={index} className='invoice-total-item d-flex flex-row justify-content-between align-items-center mb-2'>
                    <div className="" style={{ width: '30%' }}>
                      {id ? (x.label ? x.label : 'Salary') : (x.type === 'Basic' ? 'Salary' : x.label_allowance || x.name)}
                    </div>
                    <div className="w-50">
                      <Input value={parseInt(x?.amount)}
                        className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputAddjustment(e, index)} />
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
                deductions?.map((x, index) => (
                  <div key={index} className='invoice-total-item d-flex flex-row justify-content-between align-items-center mb-2'>
                    <div className="" style={{ width: '30%' }}>
                      {x.name}
                    </div>
                    <div className="w-50">
                      <Input value={x.amount}
                        className="text-right" onKeyPress={mustNumber} onChange={(e) => handleInputDeduction(e, index)} />
                    </div>
                    <div className="">
                      {deductions.length > 1 ? <Button outline color="danger" size="sm" onClick={() => onDeleteItem('d', index)}>X</Button> : <></>}
                    </div>
                  </div>
                ))
                // loans && x.name == "Potongan Pinjaman"? loans : x.value
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
                    <p className='invoice-total-title'>Days Off</p>
                    <p className='invoice-total-title'>{info ? info.dayOff : 0} Days</p>
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

          {modal.mode === 'income' ?
            <FormIncome onSubmit={handleNewIncome} type={modal.title} /> : <></>
          }

        </ModalBody>
      </Modal>
    </>
  )
}