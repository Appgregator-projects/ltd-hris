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

export default function PayrollView() {
  const { id } = useParams()
  const [payslip, setPaySlip] = useState(null)

  const fetchPayroll = async () => {
    try {
      const data = await Api.get(`/hris/payroll/${id}`)
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
          <Card outline color="dark" style={{ fontFamily: "Arial" }}>
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
                Payslip for September 2023
              </CardText>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="6">
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Employee ID</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Department</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Days Worked</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Employee Name</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Designation</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 pb-1 text-sm">Bank Acc</div>
                    <div className="w-50 pb-1 text-sm">: Joko</div>
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
                      <tr>
                        <td>Basic Salary</td>
                        <td className="text-right">Rp 5,000,0000</td>
                      </tr>
                      <tr className="fw-bold">
                        <td>TOTAL</td>
                        <td className="text-right">Rp 5,000,0000</td>
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
                      <tr>
                        <td>Basic Salary</td>
                        <td className="text-right">Rp 5,000,0000</td>
                      </tr>
                      <tr className="fw-bold">
                        <td>TOTAL</td>
                        <td className="text-right">Rp 5,000,0000</td>
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
                      <span className="text-right px-2">RP 5,500,000</span>
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
