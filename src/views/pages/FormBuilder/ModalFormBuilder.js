import React, { Fragment, useEffect, useState } from 'react'
import {
     Button,
     Modal,
     ModalHeader,
     ModalBody,
     ModalFooter,
     Form,
     Label,
     Input,
     Row,
     Col,
     InputGroup,
     InputGroupText
} from "reactstrap";
import { Plus, Save, Trash, Trash2 } from "react-feather";
import Select from "react-select";
import Api from "../../../sevices/Api";

const ModalFormBuilder = ({ fields, setFields, forms, setForms, modal, toggle, values, setValues, edits, id }) => {
     console.log(values, 'id')
     const [element, setElement] = useState([])
     const [totalValues, setTotalValues] = useState(0)

     const fetchDataCustomFields = async () => {
          const data = await Api.get('/api/v1/crm/custom-fields')
          const options = data.map((s) => ({ value: s.id, label: s.form }));
          setElement(options)
     }

     const fetchValues = () => {
          setValues(edits?.data?.values ? edits.data.values : [])
     }

     const addValue = () => {
          const inputValue = document.getElementById('messageInput').value;

          if (inputValue.trim() !== '') {
               setValues([...values, inputValue]);

               setTotalValues(totalValues + 1);

               document.getElementById('messageInput').value = '';
          }
     };

     const handleDeleteValues = (index) => {
          let newValues = [...values]

          newValues.splice(index, 1)
          setValues(newValues)
     }

     const handleSaveModal = () => {

          // return console.log(mode, 'mod', edits, newForms, 'newForms')
          if (id) {
               const newForms = forms
               if (newForms.length > 0) {
                    console.log(newForms, 'xx', edits)
                    newForms[edits.index].values = values ? values : []
                    newForms[edits.index].label = fields?.label ? fields.label : edits?.data?.label
                    newForms[edits.index].element = fields?.element ? fields.element : edits?.data?.element
                    setForms([...newForms])
               } else {
                    const arr = [{ ...fields, values: values, title: id }]
                    const newAr = [...forms, ...arr]
                    setForms(newAr)
               }

          } else {
               const arr = [{ ...fields, values: values }]
               const newAr = [...forms, ...arr]
               setForms(newAr)
          }
          toggle()
     }

     useEffect(() => {
          fetchDataCustomFields()
          return () => {
               setElement([])
               setTotalValues(0)
          }
     }, [])

     useEffect(() => {
          fetchValues()
     }, [edits])


     return (
          <Fragment>

               <Col className='d-flex justify-content-between'>
                    <Col className='mt-1'>
                         <Button.Ripple color="primary" onClick={() => toggle()}>
                              <Plus size={14} />
                              <span className="align-middle ms-25">Add Fields</span>
                         </Button.Ripple>
                    </Col>
                    <Col className='mt-1 d-flex justify-content-end'>
                         <Button.Ripple color="success" type="submit" >
                              <Save size={14} />
                              <span className="align-middle ms-25">Save Form</span>
                         </Button.Ripple>
                    </Col>
               </Col>

               <Modal
                    returnFocusAfterClose={true}
                    isOpen={modal}
                    size='lg'
               >
                    <ModalHeader toggle={() => toggle()}>Custom Fields</ModalHeader>
                    <ModalBody>
                         <Form>
                              <Row>
                                   <Col className="col12 col-md-12">
                                        <Label for="endpoint-url">Element</Label>
                                        <Select
                                             className="basic-single"
                                             classNamePrefix="select"
                                             defaultInputValue={edits && edits.data && edits.data.element.label ? edits.data.element.label : ''}
                                             options={element}
                                             onChange={(e) => setFields({ ...fields, element: e })}
                                        />
                                   </Col>
                              </Row>

                              <Row className='mt-1'>
                                   <Col className="col12 col-md-12">
                                        <Label for="Label">Label</Label>
                                        <Input
                                             defaultValue={edits && edits.data && edits.data.label ? edits.data.label : ''}
                                             placeholder="Example: Email"
                                             type="text"
                                             value={fields?.element?.value === 10 ? 'Department' : fields?.label}
                                             onChange={(e) => setFields({ ...fields, label: e.target.value })}
                                             disabled={fields?.element?.value === 10}
                                        />
                                   </Col>
                              </Row>

                              {fields && fields?.element?.value === 3 || fields?.element?.value === 9 || edits?.data?.element?.value === 3 || edits?.data?.element?.value === 9 ?
                                   <Fragment>
                                        <Row className='mt-1'>
                                             <Col>
                                                  <Label>Values</Label>
                                                  <InputGroup>
                                                       <InputGroupText>
                                                            <input type={fields?.element?.value === 3 || edits?.data?.element?.value === 3 ? 'checkbox' : 'radio'} />
                                                       </InputGroupText>
                                                       <Input type='text' id='messageInput' placeholder='Message' />
                                                  </InputGroup>
                                                  <Button.Ripple onClick={addValue} color='flat-primary' size='sm' className='mt-1' ><Plus size={20} />Add Value</Button.Ripple>
                                             </Col>
                                        </Row>
                                        {values?.map((item, index) => (
                                             <Row className='mt-1 ' key={index}>
                                                  <Col className='d-flex'>
                                                       <InputGroup>
                                                            <InputGroupText >
                                                                 <input disabled type={fields?.element?.value === 3 || edits?.data?.element?.value === 3 ? 'checkbox' : 'radio'} />
                                                            </InputGroupText>
                                                            <Input disabled type='text' id='messageInput' placeholder='Message' value={item} />
                                                       </InputGroup>
                                                       <Button.Ripple className='btn-icon ms-1' outline color='danger' onClick={() => handleDeleteValues(index)}>
                                                            <Trash size={16} />
                                                       </Button.Ripple>
                                                  </Col>
                                             </Row>
                                        ))}
                                   </Fragment>
                                   : <></>}
                         </Form>
                    </ModalBody>
                    <ModalBody></ModalBody>
                    <ModalFooter>
                         <Button
                              color="primary"
                              //   disabled={loading}
                              onClick={() => handleSaveModal()}
                         >
                              Save
                         </Button>
                         <Button color="secondary" onClick={() => toggle()} >
                              Cancel
                         </Button>
                    </ModalFooter>
               </Modal>
          </Fragment>
     )
}

export default ModalFormBuilder