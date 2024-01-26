import React, { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from "@components/breadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Input, Label, FormFeedback, Form, CardBody, CardTitle } from "reactstrap"
import Api from '../../../sevices/Api'
import ObjectClass from '../FormBuilder/FieldsType';
import { Save } from 'react-feather';
import TableIndex from './table/TableIndex';
import TableComponent from './table/TableComponent';
import { TableData } from './table/TableData';

const DigitalizationForm = () => {
     const { id } = useParams()

     const [formDetail, setFormDetail] = useState({})

     function GetObject(data) {
          return ObjectClass(data);
     }

     function GetTable(id) {
          console.log(id, 'yip')
          return TableIndex(id)
     }


     const fetchDataDetailForm = async () => {
          const { status, data } = await Api.get(`/hris/form-builder/${id}`)
          setFormDetail(data)
     }

     useEffect(() => {
          fetchDataDetailForm()
          return () => {
               setFormDetail({})
          }
     }, [])


     return (
          <Fragment>
               <Breadcrumbs
                    title="Digitalization"
                    data={[{ title: "Digitalization", link: '/digitalization' }, { title: formDetail && formDetail.title && formDetail.title[0].title }]}
               />

               <Card className='p-1'>
                    <CardBody>
                         <CardTitle>
                              {formDetail && formDetail.title && formDetail.title[0].title}
                         </CardTitle>

                         <Form>
                              <Row>
                                   {formDetail && formDetail.fields && formDetail.fields.map((item, index) => (
                                        <div key={index} className='pt-1'>
                                             <Col >
                                                  <div>
                                                       <GetObject data={item} />
                                                  </div>


                                             </Col>

                                        </div>

                                   ))}
                              </Row>
                              <Row className='mt-1'>
                                   <TableComponent id={id} />
                                   {/* <GetTable type={id} /> */}
                              </Row>
                              <Button.Ripple color="success" type="submit" className='mt-1'>
                                   <Save size={14} />
                                   <span className="align-middle ms-25">Submit</span>
                              </Button.Ripple>
                         </Form>


                    </CardBody>
               </Card>
          </Fragment>
     )
}

export default DigitalizationForm