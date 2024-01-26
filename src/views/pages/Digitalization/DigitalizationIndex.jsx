import React, { Fragment, useEffect, useState } from 'react'
import Api from "../../../sevices/Api";
import {
     Card,
     CardBody,
     CardTitle,
     Button,
     Col,
     Row
} from "reactstrap";
import { useNavigate, } from "react-router-dom";
import Breadcrumbs from "@components/breadcrumbs";

const DigitalizationIndex = () => {
     const navigate = useNavigate()

     const [digital, setDigital] = useState([])

     const fetchDataDigital = async () => {
          const { status, data } = await Api.get('/hris/form-builder')
          setDigital(data)
     }

     console.log(digital, 'xx')
     useEffect(() => {
          fetchDataDigital()
          return () => {
               setDigital([])
          }
     }, [])

     return (
          <Fragment>
               <Breadcrumbs
                    title="Digitalization"
                    data={[{ title: "Digitalization" }]}
               />
               <Row>
                    {digital && digital.map((item, index) => {
                         let typeForm = item.title.split(' ')
                         typeForm = `${typeForm[0]} ${typeForm[1]}`
                         console.log(typeForm, 'type')
                         return (
                              <Col xl={4} md={6} key={index}>
                                   <Card role='button' onClick={() => navigate(`/digitalization/${item.id}`)}>
                                        <div >
                                             <CardBody>
                                                  <div className="d-flex justify-content-between">
                                                       <span className='text-capitalize'>
                                                            {typeForm}
                                                       </span>
                                                       {/* <AvatarGroup data={ item.users} /> */}
                                                  </div>
                                                  <div className="d-flex justify-content-between align-items-end mt-1 pt-25">
                                                       <div className="role-heading">
                                                            <h4 className="fw-bolder">{item.title}</h4>
                                                            {/* <Link
                                                       to="/"
                                                       className="role-edit-modal"
                                                       onClick={(e) => {
                                                            e.preventDefault();
                                                            setModalType("Edit");
                                                            setShow(true);
                                                            setRole(item.name);
                                                            getCurrentRolePermissions(item);
                                                       }}
                                                  >
                                                       <small className="fw-bolder">Edit Role</small>
                                                  </Link> */}
                                                       </div>
                                                       {/* <Link
                                                  to=""
                                                  className="text-body"
                                                  onClick={(e) => e.preventDefault()}
                                             >
                                                  <Copy className="font-medium-5" />
                                             </Link> */}
                                                  </div>
                                             </CardBody>
                                        </div>
                                   </Card>
                              </Col>
                         )
                    })}

               </Row>
          </Fragment>
     )
}

export default DigitalizationIndex