import React, { Fragment, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Input, Label, FormFeedback, Form } from "reactstrap"
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "@components/breadcrumbs";
import { Edit, Plus, Save, Trash } from 'react-feather';
import ModalFormBuilder from './ModalFormBuilder';
import ObjectClass from './FieldsType/index';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from '../../../sevices/Api'
import toast from 'react-hot-toast'

const FormBuilderCreate = () => {
     const { id } = useParams()

     const MySwal = withReactContent(Swal);
     const navigate = useNavigate()


     const [fields, setFields] = useState({})
     const [forms, setForms] = useState([])
     const [modal, setModal] = useState(false);
     const [values, setValues] = useState([]);
     const [edits, setEdits] = useState({})

     console.log(forms, 'ni forms')
     const toggle = () => { setModal(!modal); setFields({}); setValues([]), setEdits({}) };

     function GetObject(data) {
          return ObjectClass(data);
     }

     const ItemSchema = yup.object().shape({
          title: yup.string().required("Form Name is required")
     })

     const {
          setValue,
          control,
          handleSubmit,
          formState: { errors },
     } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });

     const handleEditFields = (data, index) => {
          toggle()
          setEdits({ data: data, index: index })
     }

     const handleDeleteFields = (index) => {
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
          }).then(function (result) {
               if (result.value) {
                    let newForms = [...forms]
                    newForms.splice(index, 1)
                    setForms(newForms)

               }

          })
     }

     const fetchDataForm = async () => {
          const { status, data } = await Api.get(`/hris/form-builder/${id}`)
          if (status) {
               setValue('title', data.title[0].title)
               setForms(data.fields)
          } else {
               return toast.error(`Error : ${data}`, {
                    position: "top-center",
               });
          }
     }


     const handleSaveForms = async (params) => {
          // return console.log(params, 'cc')
          const form = { title: params.title, data: forms }

          const { status, data } = await Api.post('/hris/form-builder', form)

          if (!status) {
               return toast.error(`Error : ${data}`, {
                    position: "top-center",
               });
          }
          toast.success(`Success Add New Form!`, {
               position: 'top-center'
          })

          navigate('/form-builder')
     }

     useEffect(() => {
          if (id) {
               fetchDataForm()
          }
          return () => {
               setModal(false)
               setFields({})
               setEdits({})
               setValues([])
               setEdits({})
          }
     }, [])

     return (
          <Fragment>
               <Breadcrumbs
                    title="Form Builder"
                    data={[{ title: "Form Builder", link: '/form-builder' }, { title: id ? "Update" : "Create" }]}
               />

               <Card className='p-1'>
                    <Form onSubmit={handleSubmit(handleSaveForms)}>
                         <Row>
                              <Col>
                                   <Label>
                                        Form Name
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
                              <hr className='mt-1' />

                              {forms.map((item, index) => (

                                   <div key={index}>
                                        <Col >
                                             <div>
                                                  <GetObject data={item} />
                                             </div>

                                             <Button.Ripple className='btn-icon mt-1' outline color='warning' onClick={() => handleEditFields(item, index)} >
                                                  <Edit size={16} />
                                             </Button.Ripple>
                                             <Button.Ripple className='btn-icon ms-1 mt-1' outline color='danger' onClick={() => handleDeleteFields(index)}>
                                                  <Trash size={16} />
                                             </Button.Ripple>

                                        </Col>
                                        <hr className='mt-1' />
                                   </div>

                              ))}

                              <ModalFormBuilder fields={fields} setFields={setFields} forms={forms} setForms={setForms} toggle={toggle} values={values} setValues={setValues} modal={modal} edits={edits} />
                         </Row>
                    </Form>
               </Card>
          </Fragment>
     )
}

export default FormBuilderCreate