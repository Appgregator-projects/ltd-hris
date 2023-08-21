import React from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'

export default function HealthForm(isLoading, close) {
    console.log("got u")
  return (
    <>
    <Row>
      <Col lg="12">
        <Label>Employee</Label>
        <Input></Input>
        <Label>Employee</Label>
        <Input></Input>
      </Col>
      <Col>
        <Button type="button" size="md" color='danger' className="mx-1" onClick={close}>Cancel</Button>
        <ButtonSpinner isLoading={isLoading} label="Submit" type="button"/>
      </Col>
    </Row>
</>
  )
}
