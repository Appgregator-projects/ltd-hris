import React, { Fragment, useEffect, useState } from 'react'
import { Edit, Plus, Trash } from 'react-feather';
import { useNavigate, } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Form, UncontrolledTooltip, Table } from "reactstrap"
import DataTable from "react-data-table-component";
import Api from "../../../sevices/Api";
import toast from 'react-hot-toast'


import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteDocumentFirebase, getCollectionFirebase } from '../../../sevices/FirebaseApi';

const TableBuilderIndex = () => {
     const navigate = useNavigate()
     const MySwal = withReactContent(Swal);

     const [tableTitle, setTableTitle] = useState([])

     const fetchDataTableBuilder = async () => {
          try {

               const { status, data } = await Api.get('/hris/form-builder')
               const response = await getCollectionFirebase('table_builder')
               if (response && status) {
                    const mappedTitles = await response.map(tabelItem => {
                         const mappedTitle = tabelItem.idForm.map(formId => {
                              const matchedTitle = data.find(titleItem => titleItem.id === formId);
                              return matchedTitle ? matchedTitle.title : null;
                         });

                         return { ...tabelItem, idForm: mappedTitle };
                    });
                    console.log(data, response, 'aw', mappedTitles)
                    setTableTitle(mappedTitles)
               }
          } catch (error) {
               throw error
          }
     }


     const handleDeleteTable = (item) => {
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
                    try {
                         deleteDocumentFirebase('table_builder', item.id).then((res) => {
                              if (res) {
                                   fetchDataTableBuilder()
                                   MySwal.fire({
                                        icon: "success",
                                        title: "Deleted!",
                                        text: "Your table has been deleted.",
                                        customClass: {
                                             confirmButton:
                                                  "btn btn-success",
                                        },
                                   });
                              }
                         })
                    } catch (error) {
                         throw error
                    }
               }
          })
     }


     useEffect(() => {
          fetchDataTableBuilder()
          return () => {
               setTableTitle('')
          }
     }, [])


     return (
          <>
               <Row className="d-flex justify-content-between">
                    <Col lg="2" sm="12" className="mb-1">
                         <Fragment>
                              <Button.Ripple size="sm" color="warning" onClick={() => navigate('/table-builder/create')}>
                                   <Plus size={14} />
                                   <span className="align-middle ms-25">Add Table</span>
                              </Button.Ripple>
                         </Fragment>
                    </Col>
               </Row>
               <Card>
                    <CardHeader>
                         <CardTitle>Table Builder</CardTitle>
                    </CardHeader>
                    <CardBody>
                         <Table responsive>
                              <thead>
                                   <tr>
                                        <th>Table Title</th>
                                        <th>Used Form</th>
                                        {/* <th>Created At</th> */}
                                        <th>Actions</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {tableTitle.length > 0 && tableTitle?.map((item, index) => {
                                        return (
                                             <tr key={index}>
                                                  <td>
                                                       {item?.title}
                                                  </td>
                                                  <td>
                                                       {item.idForm.join(", ")}
                                                  </td>
                                                  < td >

                                                       <Button.Ripple className='btn-icon' color='warning' onClick={() => navigate(`/table-builder/${item?.id}`)} >
                                                            <Edit size={16} />
                                                       </Button.Ripple>
                                                       <Button.Ripple className='btn-icon ms-1' color='danger' onClick={() => handleDeleteTable(item)} >
                                                            <Trash size={16} />
                                                       </Button.Ripple>
                                                  </td>
                                             </tr>
                                        )
                                   })}
                              </tbody>
                         </Table>
                    </CardBody >
               </Card >

          </>
     )
}

export default TableBuilderIndex