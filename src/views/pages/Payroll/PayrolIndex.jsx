import { Button, Card, CardBody, Col, Row, Table, Badge } from "reactstrap"
import Api from "../../../sevices/Api"
import { useEffect, useState } from "react"
import { numberFormat } from "../../../Helper"
import dayjs from "dayjs"
import { Link } from "react-router-dom"

export default function PayrolIndex() {
  const [payrolls, setPayrolls] = useState([])

  const fetchPayroll = async () => {
    try {
      const data = await Api.get("/hris/payroll")
      setPayrolls([...data])
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
        <Col lg="6" className="mb-2">
          <Button.Ripple
            size="md"
            color="primary"
            tag={Link}
            to="/payroll-form"
          >
            <span className="align-middle text-sm">Create</span>
          </Button.Ripple>
        </Col>
        <Col lg="12">
          <Card>
            <CardBody>
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Periode</th>
                    <th className="text-right">Amount (IDR)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((x, index) => (
                    <tr key={x.id}>
                      <td>{index + 1}</td>
                      <td>{x.user.name}</td>
                      <td>
                        {x.periode ? dayjs(x.periode).format("MMMM-YYYY") : "-"}
                      </td>
                      <td className="text-right">{numberFormat(x.total)}</td>
                      <td>
                        <Badge
                          pill
                          color={x.approved_at ? "light-success" : "light-info"}
                          className="me-1"
                        >
                          {x.approved_at ? "Approved" : "Waiting"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
