import dayjs from "dayjs"
import { useEffect, useState } from "react"
import {
  Alert,
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  NavLink
} from "reactstrap"
import { ChevronLeft, ChevronRight, ChevronDown, Link } from "react-feather"
import FormUserAssign from "../Components/FormUserAssign"
import Api from "../../../sevices/Api"
import toast from "react-hot-toast"
import AttandanceDetail from "./AttendanceDetail"

export default function AttendanceIndex() {
  const [initalDate, setInitialDate] = useState(dayjs().format("YYYY-MM"))
  const dic = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const [calendar, setCalendar] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [users, setUsers] = useState([])
  const [userSelect, setUserSelect] = useState(null)
  const [attendanceLog, setAttendanceLog] = useState([])
  const [late, setLate] = useState([])
  const [attendance, setAttendance] = useState([])
  const [modal, setModal] = useState({
    title: "User assign",
    mode: "get",
    item: null
  })

  const fetchUser = async () => {
    try {
      const data = await Api.get(`/hris/employee?no_paginate=true`)
      const fil = data.filter((x) => (x.title) === ("Manager"))
      console.log(fil,'ulalaa')
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
    fetchUser()
  }, [])

  const onPick = () => {
    setModal({
      title: "User assign",
      mode: "get",
      item: users
    })
    setToggleModal(true)
  }

  const onDetail = (x) => {
    setModal({
      title: "User Detail",
      mode: "detail",
      item: x
    })
    setToggleModal(true)
  }

  const generateCalendarData = (month = "") => {
    const params = []
    const totalDay = dayjs(month).daysInMonth()
    const now = dayjs(month).format("YYYY-MM")
    for (let index = 0; index < totalDay; index++) {
      const d = dayjs(`${now}-${index + 1}`).format("YYYY-MM-DD")
      const dayname = dayjs(d).format("ddd")
      params.push({
        date: dayjs(d).format("DD"),
        periode: d,
        dayname
      })
    }

    return params
  }

  const generateCalendarView = (initDate) => {
    const previousMonth = dayjs(initDate).subtract(1, "month")
    const currentParams = generateCalendarData(initDate)
    const previousParams = generateCalendarData(previousMonth).reverse()

    const firstDayFromCurentMOnth = currentParams[0]
    const findIndexDay = dic.findIndex(
      (x) => x === firstDayFromCurentMOnth.dayname
    )
    let getDateFromPrevious = previousParams.slice(0, findIndexDay).reverse()
    getDateFromPrevious = getDateFromPrevious.map((x) => {
      x.is_previous = "is_previous"
      return x
    })
    const calendar = [...getDateFromPrevious, ...currentParams]
    setCalendar([...calendar])
  }

  useEffect(() => {
    generateCalendarView(initalDate)
  }, [])

  const onChangeDate = (mode) => {
    let periode = dayjs(initalDate)
    if (mode === "-") {
      periode = periode.subtract(1, "month")
    } else {
      periode = periode.add(1, "month")
    }
    periode = dayjs(periode).format("YYYY-MM")

    setInitialDate(dayjs(periode).format("YYYY-MM"))
    generateCalendarView(periode)
    setUserSelect(null)
  }

  const generateCalendarEvent = (arg) => {
    console.log(arg, "generateCalendarEvent arg")
    const attendances = arg
    const late = arg.filter((x) => parseFloat(x.late_count) > 0)
    // console.log(late, "generateCalendarEvent late")
    setLate([...late])
    setAttendanceLog([...attendances])

    let calendarArr = JSON.stringify(calendar)
    calendarArr = JSON.parse(calendarArr)
    // console.log(calendarArr, "generateCalendarEvent calendarArr")
    const result = []
    calendarArr.forEach((x) => {
      const find = attendances.find(
        (y) => dayjs(y.periode).format("YYYY-MM-DD") === x.periode
      )
      // console.log(find, "generateCalendarEvent find")
      if (find) {
        x.is_filled = true
        x.clock_in = dayjs(find.clock_in).format("HH:mm")
        x.clock_out = dayjs(find.clock_out).format("HH:mm")
      }
      result.push(x)
    })
    setCalendar([])
    setCalendar([...result])
  }

  const fetchAttendance = async (arg, date) => {
    const month = date.slice(6, 7)
    const year = date.slice(0, 4)
    // return console.log(year, "attendance")
    try {
      const data = await Api.get(
        `/hris/attendance/employee?month=${month}&year=${year}&day=&uid=${arg.value}`
      )
      console.log(data, "data attendance")
      setAttendance([...data])
      setToggleModal(false)
      generateCalendarEvent(data)
      toast.success("Attendance has loaded", {
        position: "top-center"
      })
    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center"
      })
      throw error
    }
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col lg="3" sm="12">
                  <div className="mt-3">
                    <Button
                      color="warning"
                      outline
                      className="w-full"
                      onClick={onPick}
                    >
                      {userSelect ? userSelect.label : "Pick employee"}
                      <ChevronDown size={15} />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <h4 className="fw-bold border-bottom pb-50 mb-1">
                      Reports
                    </h4>
                    <ul className="list-none padding-none margin-none">
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Total Day</span>
                        <span>{attendanceLog.length}</span>
                      </li>
                      <li className="d-flex justify-content-between pb-1">
                        <span className="fw-bold">Late</span>
                        <span>{late.length}</span>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col lg="9" sm="12">
                  <div className="d-flex align-items-center">
                    <span
                      className="pointer mr-1"
                      onClick={() => onChangeDate("-")}
                    >
                      <ChevronLeft size={30} />
                    </span>
                    <span className="pointer" onClick={() => onChangeDate("+")}>
                      <ChevronRight size={30} />
                    </span>
                    <span className="text-primary fs-4">
                      {dayjs(initalDate).format("YYYY MMMM")}
                    </span>
                  </div>
                  <ul className="d-flex flex-row list-none calendar flex-wrap">
                    {dic.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>

                  <ul className="d-flex flex-row list-none calendar-date flex-wrap">
                    {calendar.map((x, index) => (
                      <li
                        key={index}
                        className={x.is_previous ? x.is_previous : ""}
                        onClick={() => onDetail(x)}
                      >
                        <span>{x.date}</span>
                        {x.is_filled ? (
                          <div className="fs-6 mt-2">
                            <Alert outline="false" color="success">
                              <span className="text-xs">
                                Clock in: {x.clock_in}
                              </span>
                            </Alert>
                            <Alert color="primary">
                              <span className="text-xs">
                                Clock out: {x.clock_out}
                              </span>
                            </Alert>
                          </div>
                        ) : (
                          <></>
                        )}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </CardBody>
          </Card>
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
          {modal.mode === "get" ? (
            <FormUserAssign
              options={users}
              close={() => setToggleModal(false)}
              multiple={false}
              disable={true}
              onSelect={(arg) => {
                setUserSelect(arg)
                fetchAttendance(arg, initalDate)
              }}
            />
          ) : (
            <></>
          )}
          {modal.mode === "detail" ? (
            <AttandanceDetail
              attendance={modal.item}
              close={() => setToggleModal(false)}
            />
          ) : (
            <></>
          )}
          <Col>
            <Button
              type="button"
              size="md"
              color="danger"
              onClick={() => setToggleModal(!toggleModal)}
            >
              Cancel
            </Button>
          </Col>
        </ModalBody>
      </Modal>
    </>
  )
}
