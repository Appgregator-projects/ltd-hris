import React, { Fragment, useEffect, useState } from 'react'
import { Plus } from 'react-feather';
import { useNavigate, } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"
import DataTable from "react-data-table-component";
import Api from "../../../sevices/Api";
import toast from 'react-hot-toast'
import { columnsFormBuilder } from '../LMS/store/data';

const FormBuilder = () => {
     const navigate = useNavigate()

     const [formTitle, setFormTitle] = useState('')

     const fetchDataFormBuilder = async () => {
          const { status, data } = await Api.get('/hris/form-builder')
          if (status) {
               setFormTitle(data)
          } else {
               return toast.error(`Error : ${data}`, {
                    position: "top-center",
               });
          }
     }

     console.log({ formTitle })

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
                    <DataTable
                         noHeader
                         columns={columnsFormBuilder}
                         data={formTitle}

                    />
               </Card>

          </>
     )
}

export default FormBuilder