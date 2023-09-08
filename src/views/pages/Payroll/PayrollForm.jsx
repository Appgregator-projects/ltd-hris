import { 
  Col, Row, Button, Input,
  Modal, ModalHeader, ModalBody
 } from "reactstrap"
import { ChevronDown } from "react-feather"
import { monthName } from "../../../Helper"
import FormUserAssign from "../Components/FormUserAssign"
import { useState, useEffect, useRef } from "react"
import Api from "../../../sevices/Api"
import dayjs from "dayjs"

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

  const fetchAttendance = async(user = '') => {
   
    const uid = user ? user : userSelect.value 
    console.log(uid, 'sks')
    if (uid && periodeRef.current.value) {
      const periode = `${dayjs().format('YYYY')}-${periodeRef.current.value}`
      try {
        const data = await Api.get(`/hris/payroll/by-user?user_id=${uid}&periode=${periode}`)
        console.log(data, 'data')
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
        <Col lg="5">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, quis! Animi odio pariatur temporibus dolorem nulla rem iure vero natus qui? Alias, sit quidem? Doloribus laudantium alias laboriosam quas dolores.
        </Col>
        <Col lg="7">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae corrupti odit ullam ratione! Omnis, id architecto. Cumque quas ad, consectetur iste cum officiis, reiciendis at eveniet cupiditate repellendus aliquam doloremque!
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
          <FormUserAssign
              options={users}
              close={() => setToggleModal(false)}
              multiple={false}
              disable={true}
              onSelect={onSelectEmployee}
            />
        </ModalBody>
      </Modal>
    </>
  )
}