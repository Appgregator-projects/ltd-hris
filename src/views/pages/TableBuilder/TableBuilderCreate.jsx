import React, { Fragment, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Input, Label, FormFeedback, Form } from "reactstrap"
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "@components/breadcrumbs";
import { RefreshCcw } from 'react-feather';
import Api from '../../../sevices/Api'
import toast from 'react-hot-toast'
import TableComponent from './TableComponent';
import Select from "react-select";
import { addDocumentFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../../sevices/FirebaseApi';
import { selectThemeColors } from "@utils";


const TableBuilderCreate = () => {
     const { id } = useParams()

     const navigate = useNavigate()

     const [forms, setForms] = useState([])
     const [values, setValues] = useState([]);
     const [table, setTable] = useState([])
     const [tableInput, setTableInput] = useState({})

     const ItemSchema = yup.object().shape({
          form: yup.array().min(1, 'Form must have at least 1 item').required('Form is required'),
          title: yup.string().required("Table Name is required"),
          row: yup.number().required("Total Row is required").positive("Total Row can't start with a minus"),
          column: yup.number().required("Total Column is required").positive("Total Column can't start with a minus")
     })

     const {
          setValue,
          control,
          handleSubmit,
          formState: { errors },
     } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });


     const fetchDataForm = async () => {
          const { status, data } = await Api.get(`/hris/form-builder`)
          if (status) {
               const newForms = data.map(item => ({
                    value: item.id,
                    label: item.title
               }));
               await setForms(newForms)
               if (id) {
                    const resTable = await getSingleDocumentFirebase('table_builder', id)

                    if (resTable) {
                         const resForm = await newForms.filter(item => resTable.idForm.includes(item.value));

                         setValue('title', resTable.title)
                         setValue('row', resTable.tbody.length)
                         setValue('column', resTable.thead.length)
                         await setValue('form', resForm)
                         setTable(resTable)
                         await setValues({ title: resTable.title, column: resTable.thead.length, row: resTable.tbody.length, form: resForm })
                         await setTableInput({
                              tbody: resTable.tbody,
                              thead: resTable.thead
                         })
                    }
               }
          } else {
               return toast.error(`Error : ${data}`, {
                    position: "top-center",
               });
          }
     }

     const handleGenerateTable = async (params, e) => {
          setValues(params)

          if (id) {
               setTableInput((prevTableInput) => {
                    const newTbody = Array.from({ length: params.row }, (_, rowIndex) => {
                         if (rowIndex < prevTableInput.tbody.length) {
                              const row = { ...prevTableInput.tbody[rowIndex] };

                              if (row.td.length !== params.column) {
                                   row.td = Array.from({ length: params.column }, (_, colIndex) => {
                                        if (colIndex < row.td.length) {
                                             return row.td[colIndex];
                                        }
                                        return null;
                                   });
                              }

                              return row;
                         }

                         return {
                              td: Array.from({ length: params.column }, () => null),
                         };
                    });

                    const newThead = Array.from({ length: params.column }, (_, colIndex) => {
                         if (colIndex < prevTableInput.thead.length) {
                              return prevTableInput.thead[colIndex];
                         }
                         return null;
                    });

                    return {
                         tbody: newTbody,
                         thead: newThead,
                    };
               });
          } else {
               setTableInput({
                    tbody: Array.from({ length: params.row }, () => ({
                         td: Array.from({ length: params.column }, () => null)
                    })),
                    thead: Array.from({ length: params.column }, () => null)
               })
          }

          if (e.nativeEvent.submitter.value === 'update') {
               try {
                    const idForm = values.form.map(item => item.value);
                    const data = { ...tableInput, title: id ? params.title : values.title, idForm: idForm }
                    const res = id ? await setDocumentFirebase('table_builder', id, data) : await addDocumentFirebase('table_builder', data)
                    if (res) {
                         navigate('/table-builder')
                         return toast.success(`Table has ${id ? 'updated' : 'created'}`, {
                              position: "top-center",
                         });
                    }

               } catch (error) {
                    toast.success(error, {
                         position: "top-center",
                    });
               }
          }
     }


     useEffect(() => {

          fetchDataForm()

          return () => {
               setValues([])
               setForms([])
               setTableInput({})
               setTable([])
          }
     }, [])

     return (
          <Fragment>
               <Breadcrumbs
                    title="Table Builder"
                    data={[{ title: "Table Builder", link: '/table-builder' }, { title: id ? "Update" : "Create" }]}
               />

               <Card className='p-1'>
                    <Form onSubmit={(e) => {
                         e.preventDefault(); // Mencegah perilaku refresh default
                         handleSubmit((data) => handleGenerateTable(data, e))();
                    }}>
                         <Row>
                              <Col md='12' sm='12'>
                                   <Label>
                                        Table Name
                                   </Label>
                                   <Controller
                                        name="title"
                                        defaultValue=""
                                        control={control}
                                        render={({ field }) => (
                                             <Input
                                                  type="text"
                                                  {...field}
                                                  invalid={errors.title && true}
                                             />
                                        )}
                                   />
                                   {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                              </Col>
                              <Col md='12' sm='12' className='mt-1'>
                                   <Label>
                                        Form
                                   </Label>
                                   <Controller
                                        name="form"
                                        defaultValue=""
                                        control={control}
                                        render={({ field }) => (
                                             <Select
                                                  name='form'
                                                  className='react-select'
                                                  classNamePrefix="select"
                                                  id='label'
                                                  placeholder="Select Form"
                                                  theme={selectThemeColors}
                                                  {...field}
                                                  closeMenuOnSelect={true}
                                                  options={forms}
                                                  isMulti
                                                  invalid={errors.form && true} />

                                        )}
                                   />
                                   {errors.form && <span style={{ color: "#ea5455", fontSize: 12 }}>Form is required</span>}
                              </Col>
                              <Col className='mt-1'>
                                   <Label>
                                        Total Row
                                   </Label>
                                   <Controller
                                        name="row"
                                        defaultValue=""
                                        control={control}
                                        render={({ field }) => (
                                             <Input
                                                  type="number"
                                                  {...field}
                                                  invalid={errors.row && true}
                                             />
                                        )}
                                   />
                                   {errors.row && <FormFeedback>{errors.row.message}</FormFeedback>}
                              </Col>
                              <Col className='mt-1'>
                                   <Label>
                                        Total Column
                                   </Label>
                                   <Controller
                                        name="column"
                                        defaultValue=""
                                        control={control}
                                        render={({ field }) => (
                                             <Input
                                                  type="number"
                                                  {...field}
                                                  invalid={errors.column && true}
                                             />
                                        )}
                                   />
                                   {errors.column && <FormFeedback>{errors.column.message}</FormFeedback>}
                              </Col>

                              <hr className='mt-1' />

                              <Col className='d-flex justify-content-between'>
                                   <Col className='mt-1'>
                                        <Button.Ripple color="primary" type='submit' value='generate' name='generate'>
                                             <RefreshCcw size={14} />
                                             <span className="align-middle ms-25">Generate Table</span>
                                        </Button.Ripple>
                                   </Col>
                              </Col>
                         </Row>
                         <Row className='mt-2'>
                              <TableComponent data={values} setTableInput={setTableInput} id={id} tableInput={tableInput} />
                         </Row>
                    </Form>
               </Card>
          </Fragment>
     )
}

export default TableBuilderCreate