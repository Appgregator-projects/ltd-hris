import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const UploadFile = ({ properties }) => {
     return (
          <Fragment>
               <Row>
                    <Col className='col-3'>
                         <Label>{properties?.data?.label}</Label>
                         <Input type='file' />
                    </Col>
               </Row>
          </Fragment>
     )
}

export default UploadFile