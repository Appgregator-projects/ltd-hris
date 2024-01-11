import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const Radio = ({ properties }) => {

     return (
          <Fragment>
               <Row>
                    <Label>{properties?.data?.label}</Label>
                    <Col>
                         {properties?.data?.values?.length > 0 ?
                              properties?.data?.values?.map((item, index) => (

                                   <div className='form-check form-check-inline' key={index}>
                                        <Input type='radio' />
                                        <Label>
                                             {item}
                                        </Label>
                                   </div>

                              )) : <></>
                         }
                    </Col>

               </Row>
          </Fragment>
     )
}

export default Radio