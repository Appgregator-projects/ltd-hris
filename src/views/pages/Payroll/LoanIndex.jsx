import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Edit, Grid, Plus, Trash } from "react-feather"
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap"
import Api from "../../../sevices/Api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { dateTimeFormat, numberFormat } from "../../../Helper"
const MySwal = withReactContent(Swal);

export default function LoanIndex() {
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

    const handleReject = async (x) => {
        console.log(x,'apayo')
        const oldData = x
        const newData = {
            status : 'rejected',
            tenor : oldData.tenor
        }
        console.log(newData, 'baroe')
        try {
            const {data, status} = await Api.put(`/hris/loan-status-approve/${x.id}`, newData)
            console.log(status)
        } catch (error) {
            console.log(error.message)
        }
        setOpenModal(false)
        fetchEmployeeLoans()
    }

    const HandleApprove = async (x) => {
        const oldData = x
        const newData = {
            status : 'approve',
            tenor : oldData.tenor
        }
        try {
            const {data, status} = await Api.put(`/hris/loan-status-approve/${x.id}`, newData)
            console.log({status})
        } catch (error) {
            console.log(error.message)
        }
        setOpenModal(false)
        fetchEmployeeLoans()
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
      <Row style={{backgroundColor:'white', margin:'auto'}}>
        <Card Row style={{backgroundColor:'white'}}>
          <CardHeader >
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
            <Table responsive size="sm">
              <thead>
                <tr className="text-xs">
                  <th style={{fontSize : 'sm'}}>Number</th>
                  <th style={{fontSize : 'sm'}}>User</th>
                  <th style={{fontSize : 'sm'}} >Memo</th>
                  <th></th>
                  <th></th>
                  <th style={{fontSize : 'sm'}}>Tenor</th>
                  <th style={{fontSize : 'sm'}}>Status</th>
                  <th style={{fontSize : 'sm'}}>amount</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor:'transparent'}}>
                {loan?.map((x, i) => (
                  <>
                    <tr key={i}>
                      <td style={{fontSize : '9pt', backgroundColor:'white', cursor:'pointer'}} onClick={() => handleDetail(x)} className="user_name text-truncate text-body"><span className="fw-light text-capitalize">{x.number}</span></td>
                      <td style={{fontSize:'9pt', backgroundColor:'white'}}>{x.user_name}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}} colSpan={3}>{x.memo}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.tenor}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}><Badge color={x.status === 'approved' ? "light-success" : x.status === 'rejected' ? "light-danger" : x.status === 'requested' ? "light-warning" : x.status === 'completed' ? "light-primary" : "light-primary"}>{x.status}</Badge></td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>Rp {numberFormat(x.loan_amount)}</td>
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
                <p>User</p>
                <p>{modalAtr.user_name}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Loan Number</p>
                <p>{modalAtr.number}</p>
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
                <p>Status</p>
                <p>{modalAtr.status}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>{modalAtr.status} at</p>
                <p>{dateTimeFormat(modalAtr.updatedAt)}</p>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Amount</p>
                <p>Rp {numberFormat(modalAtr.loan_amount)}</p>
              </div>
            </div>
          </Col>
        </ModalBody>
        {modalAtr.status === 'approved' ? 
        <>
        </> 
        : 
        <>
        <ModalFooter>
            <Button color='warning' onClick={() => handleReject (modalAtr)}>Reject</Button>
            <Button color='success' onClick={() => HandleApprove (modalAtr)}>Approve</Button>
        </ModalFooter>
        </>}
      </Modal>
        </>
    )

}