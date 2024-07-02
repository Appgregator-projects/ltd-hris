import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const InputDate = (props) => {
     const { properties, edited, setEdited } = props

     const submit = (data) => {
          const valueProperti = props["properties"]["data"][1];
          return valueProperti({
               label: props["properties"]["data"][0]["label"],
               value: data,
               id: props["properties"]["data"][0]["id"],
          });
     };

     const afterEdit = async (data) => {
          const result = props["properties"]["editIsActive"];
          return result({ data, props });
     };
     return (
          <Fragment>
               <Row>
                    <Col className='col-2'>
                         <Label>{properties?.data?.[0]?.label}</Label>
                         <Input type='date' 
                         onChange={(e) =>
                              props["properties"]["editMode"] === true
                                   ? afterEdit(e.target.value)
                                   : submit(e.target.value)
                         } />
                    </Col>
               </Row>
          </Fragment>
     )
}

export default InputDate