import React, { Fragment, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const Checkbox = (props) => {
     const { properties, edited, setEdited } = props
     const [selectedValues, setSelectedValues] = useState([]);

     const submit = (e,item) => {

          if (e.target.checked) {
               // Jika checkbox dipilih, tambahkan nilai ke state
               setSelectedValues([...selectedValues, item]);
               const valueProperti = props["properties"]["data"][1];
               return valueProperti({
                    label: props["properties"]["data"][0]["label"],
                    value: [...selectedValues, item],
                    id: props["properties"]["data"][0]["id"],
               });
          } else {
               setSelectedValues(selectedValues.filter(value => value !== item));
               const valueProperti = props["properties"]["data"][1];
               return valueProperti({
                    label: props["properties"]["data"][0]["label"],
                    value: selectedValues.filter(value => value !== item),
                    id: props["properties"]["data"][0]["id"],
               });
               // Jika checkbox tidak dipilih, hapus nilai dari state
          }
         
     };

     const afterEdit = async (data) => {
          const result = props["properties"]["editIsActive"];
          return result({ data, props });
     };

     return (
          <Fragment>
               <Row>
                    <Label>{properties?.data?.[0]?.label}</Label>
                    <Col>
                         {properties?.data?.[0]?.values?.length > 0 ?
                              properties?.data?.[0]?.values?.map((item, index) => (

                                   <div className='form-check form-check-inline' key={index}>
                                        <Input type='checkbox' onChange={(e)=>submit(e,item)}/>
                                        <Label value={item}>
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

export default Checkbox