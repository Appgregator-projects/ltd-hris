import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const InputDate = ({ properties }) => {
     return (
          <Fragment>
               <Row>
                    <Col className='col-2'>
                         <Label>{properties?.data?.label}</Label>
                         <Input type='date' />
                    </Col>
               </Row>
          </Fragment>
     )
}

export default InputDate