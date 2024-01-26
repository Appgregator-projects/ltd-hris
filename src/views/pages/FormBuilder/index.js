import React, { Fragment, useEffect, useState } from 'react'
import { Edit, Plus, Trash } from 'react-feather';
import { useNavigate, } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"
import DataTable from "react-data-table-component";
import Api from "../../../sevices/Api";
import toast from 'react-hot-toast'
import { columnsFormBuilder } from '../LMS/store/data';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const FormBuilder = () => {
     const navigate = useNavigate()
     const MySwal = withReactContent(Swal);

     const [formTitle, setFormTitle] = useState([])

     const fetchDataFormBuilder = async () => {
          const { status, data } = await Api.get('/hris/form-builder')
          setFormTitle(data)
     }

     const handleDeleteForm = (item) => {
          console.log(item, 'ss')
          return MySwal.fire({
               title: "Are you sure?",
               text: "You won't be able to revert this!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonText: "Yes, delete it!",
               customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-outline-danger ms-1",
               },
               buttonsStyling: false,
          }).then(function async(result) {
               if (result.value) {
                    Api.delete(`/hris/form-builder/${item.id}`)


                    fetchDataFormBuilder()
               }
          })
     }


     useEffect(() => {
          fetchDataFormBuilder()
          return () => {
               setFormTitle('')
          }
     }, [])


     return (
          <>
               <Row className="d-flex justify-content-between">
                    <Col lg="2" sm="12" className="mb-1">
                         <Fragment>
                              <Button.Ripple size="sm" color="warning" onClick={() => navigate('/form-builder/create')}>
                                   <Plus size={14} />
                                   <span className="align-middle ms-25">Add Form</span>
                              </Button.Ripple>
                         </Fragment>
                    </Col>
               </Row>
               <Card>
                    <CardHeader>
                         <CardTitle>Form Builder</CardTitle>
                    </CardHeader>
                    <CardBody>
                         <Table responsive>
                              <thead>
                                   <tr>
                                        <th>Form Title</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {formTitle.length > 0 && formTitle?.map((item, index) => (
                                        <tr key={index}>
                                             <td>
                                                  {item?.title}
                                             </td>
                                             <td>
                                                  {item?.createdAt}
                                             </td>
                                             <td>

                                                  <Button.Ripple className='btn-icon' color='warning' onClick={() => navigate(`/form-builder/${item?.id}`)} >
                                                       <Edit size={16} />
                                                  </Button.Ripple>
                                                  <Button.Ripple className='btn-icon ms-1' color='danger' onClick={() => handleDeleteForm(item)} >
                                                       <Trash size={16} />
                                                  </Button.Ripple>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </Table>
                    </CardBody>
               </Card>

          </>
     )
}

export default FormBuilder