import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  Table
} from "reactstrap"
import Divider from "../Components/Divider"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import Api from "../../../sevices/Api"
import { useParams } from "react-router-dom"
import { numberFormat } from "../../../Helper"

export default function PayrollView() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [deductions, setDeductions] = useState([])
  const [addjusments, setAddjusments] = useState([])
  const [totalAddjusment, setTotalAddjusment] = useState(0)
  const [totalDeduction, setTotalDeduction] = useState(0)
  const [periode, setPeriode] = useState('')
  const fetchPayroll = async () => {
    try {
      const data = await Api.get(`/hris/payroll/${id}`)
      setUser({...data.user})
      const addj = data.items.filter(x => x.flag === 'addjusment')
      const deductions = data.items.filter(x => x.flag !== 'addjusment')
      setAddjusments([...addj])
      setDeductions([...deductions])
      setTotalDeduction(
        deductions.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
      )
      setTotalAddjusment(
        addj.map(x => parseFloat(x.amount)).reduce((a, b) => a + b, 0)
      )
      setPeriode(data.periode)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchPayroll()
  }, [])

  return (
    <>
      <Row>
        <Col lg="12">
          <Card  color="white" style={{ fontFamily: "Arial" }}>
            <CardHeader>
              <CardTitle
                className="text-center text-xl w-full"
                style={{ color: "#000" }}
              >
                LIFETIME DESIGN
              </CardTitle>
              <CardText className="text-center w-full text-xs">
                Jl. Pangeran Antasari No.70, RW.8,Cilandak Bar., Kec.
                Cilandak,Kota Jakarta Selatan,Daerah Khusus Ibukota Jakarta
                12430
              </CardText>
              <CardText className="text-center w-full text-md">
                Payslip for {periode ? dayjs(periode).format('MMMM YYYY') : '-'}
              </CardText>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="6">
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Employee ID</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.nip : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Department</div>
                    <div className="w-50 pb-1 text-xs text-uppercase">: {user ? user.division.name : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Designation</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.title : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Days Worked</div>
                    <div className="w-50 pb-1 text-xs">: Joko</div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Employee Name</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.name : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Bank Name</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.employee_attribute.bank_Account : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Bank Account Name</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.employee_attribute.bank_Account_Name : '-'}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-xs">Bank Account Number</div>
                    <div className="w-50 pb-1 text-xs">: {user ? user.employee_attribute.bank_Account_Number : '-'}</div>
                  </div>
                </Col>
                <Col lg="6 mt-2">
                  <CardText className="w-full text-sm fw-bold">
                    Addjusment
                  </CardText>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        addjusments.map(x => (
                          <tr key={x.id} className="text-xs">
                            <td>{x.label}</td>
                            <td className="text-right">Rp {numberFormat(x.amount)}</td>
                          </tr>
                        ))
                      }
                      <tr className="fw-bold">
                        <td>TOTAL</td>
                        <td className="text-right">Rp {numberFormat(totalAddjusment)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg="6 mt-2">
                  <CardText className="w-full text-sm fw-bold">
                    Deduction
                  </CardText>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                        deductions.map(x => (
                          <tr key={x.id} className="text-xs">
                            <td>{x.label}</td>
                            <td className="text-right">Rp {numberFormat(x.amount)}</td>
                          </tr>
                        ))
                      }
                      <tr className="fw-bold">
                        <td>TOTAL</td>
                        <td className="text-right">Rp {numberFormat(totalDeduction)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Divider title="-" />
                <Col lg="12">
                  <div className="d-flex justify-content-end">
                    <div
                      className="w-50 d-flex justify-content-between fw-bold"
                      style={{ color: "#000" }}
                    >
                      <span className="text-left px-3">NET SALARY</span>
                      <span className="text-right px-2">RP {numberFormat(totalAddjusment - totalDeduction)}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
