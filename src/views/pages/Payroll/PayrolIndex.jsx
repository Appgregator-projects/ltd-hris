import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Edit, Grid, Plus, Trash } from "react-feather"
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import Api from "../../../sevices/Api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal);

export default function PayrolIndex() {
    const [openModal, setOpenModal] = useState(false)
    const [modalAtr, setModalAtr] = useState('')
    const [loan, setLoan] = useState(null)

    const fetchEmployeeLoans = async () => {
      try {
        const data = await Api.get('/hris/loan')
        console.log(data)
        setLoan(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    useEffect(() => {
      fetchEmployeeLoans()
    },[])

    const handleDetail = (x) => {
      setModalAtr(x)
      setOpenModal(true)
    }

    return (
        <>
        {/* <Row className="d-flex justify-content-between">
        <Col lg="2" sm="12" className="mb-1">
          <Fragment>
            <Button.Ripple size="sm" color="warning" >
              <Plus size={14} />
              <span className="align-middle ms-25">Add Employee Loans</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row> */}
      <Row>
        <Card>
          <CardHeader>
            <CardTitle>Employee Loans</CardTitle>
            <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="3"
          >
            <Label className="me-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
            //   value={searchValue}
            //   onChange={handleFilter}
            />
          </Col>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className="text-xs">
                  <th className="fs-6">Number</th>
                  <th className="fs-6">User</th>
                  <th className="fs-6" >Memo</th>
                  <th></th>
                  <th></th>
                  <th className="fs-6">Tenor</th>
                  <th className="fs-6">Request Add</th>
                  <th className="fs-6">Approved Add</th>
                  <th className="fs-6">completed</th>
                  <th className="fs-6">expires</th>
                  <th className="fs-6">amount</th>
                </tr>
              </thead>
              <tbody>
                {loan?.map((x, i) => (
                  <>
                    <tr key={i}>
                      <td>{x.number}</td>
                      <td onClick={() => handleDetail(x)} style={{cursor:'pointer'}}>{x.user_name}</td>
                      <td colSpan={3}>{x.memo}</td>
                      <td>{x.tenor}</td>
                      <td>{x.request_add}</td>
                      <td>{x.approved_add}</td>
                      <td>{x.completed}</td>
                      <td>{x.expired}</td>
                      <td>{x.loan_amount}</td>
                      {/* <td>{x.description}</td> */}
                      
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Row>
      <Modal
        isOpen={openModal}
        toggle={() => setOpenModal(false)}
        className={`modal-dialog-centered modal-md`}>
        <ModalHeader toggle={() => setOpenModal(false)}>
          Employee Loan Details
        </ModalHeader>
        <ModalBody>
          <Col>
            <div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h4>Employe Loan Number</h4>
                <p>{modalAtr.number}</p>
              </div>
              <hr/>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>User</p>
                <p>{modalAtr.user_name}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Memo</p>
                <p>{modalAtr.memo}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Tenor</p>
                <p>{modalAtr.tenor}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Request Add</p>
                <p>{modalAtr.request_add}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Approved Add</p>
                <p>{modalAtr.approved_add}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Completed</p>
                <p>{modalAtr.completed}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Expired</p>
                <p>{modalAtr.expired}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Amount</p>
                <p>{modalAtr.loan_amount}</p>
              </div>
            </div>
          </Col>
        </ModalBody>
      </Modal>
        </>
    )

}