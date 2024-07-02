import React, { Fragment, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const Radio = (props) => {
     const { properties, edited, setEdited } = props
     const [selectedValues, setSelectedValues] = useState([]);

     const submit = (e, item) => {

          const valueProperti = props["properties"]["data"][1];
          return valueProperti({
               label: props["properties"]["data"][0]["label"],
               value: item,
               id: props["properties"]["data"][0]["id"],
          });
          // Jika checkbox tidak dipilih, hapus nilai dari state
     }

     const handleRadioChange = (e, item) => {
          setSelectedValues(item);
          submit(e, item); // Memanggil fungsi submit dengan event dan item yang dipilih
     };

     return (
          <Fragment>
               <Row>
                    <Label>{properties?.data?.[0]?.label}</Label>
                    <Col>
                         {properties?.data?.[0]?.values?.length > 0 ?
                              properties?.data?.[0]?.values?.map((item, index) => {
                                   console.log(item, "nitem")
                                   return (

                                        <div className='form-check form-check-inline' key={index}>
                                             <Input
                                                  type='radio'
                                                  name='radioGroup'
                                                  checked={selectedValues === item}
                                                  onChange={(e) => handleRadioChange(e, item)}
                                             />
                                             <Label>
                                                  {item}
                                             </Label>
                                        </div>

                                   )
                              }) : <></>
                         }
                    </Col>

               </Row>
          </Fragment>
     )
}

export default Radio