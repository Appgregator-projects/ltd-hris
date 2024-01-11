import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const InputNumber = ({ properties }) => {
     return (
          <Fragment>
               <Row>
                    <Col className='col-4'>
                         <Label>{properties?.data?.label}</Label>
                         <Input type='number' />
                    </Col>
               </Row>
          </Fragment>
     )
}

export default InputNumber