import React, { useEffect, useState } from 'react'
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Button, Card, CardBody, CardText, Col, DropdownItem, DropdownMenu, DropdownToggle, PopoverBody, PopoverHeader, Table, UncontrolledDropdown, UncontrolledPopover } from 'reactstrap';
import { FileText, Info, MoreVertical, Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { getCollectionFirebase } from '../../../sevices/FirebaseApi';
import { rupiah } from '../../../Helper';
import moment from 'moment';
import { BiPencil } from "react-icons/bi";

const userData = JSON.parse(localStorage.getItem('userData'))


const SppdIndex = () => {
     const navigate = useNavigate()

     const [sppd, setSppd] = useState()

     const fetchSppd = async () => {
          const result = await getCollectionFirebase('sppd')
          setSppd(result)
     }

     useEffect(() => {
          fetchSppd()
     }, [])


     return (
          <>
               <Breadcrumbs
                    title="SPPD"
                    data={[{ title: "SPPD" }]}
                    rightMenu={
                         <Button.Ripple
                              color="primary"
                              onClick={() =>
                                   navigate(
                                        `/sppd/create
                                        `,
                                        {
                                             state: Object.assign({}, { status: "normal" }),
                                        }
                                   )
                              }
                         >
                              <Plus size={14} />
                              <span className="align-middle ms-25">Add SPPD</span>
                         </Button.Ripple>
                    }
               />

               <Card>
                    <CardBody>
                         <CardText>
                              <Table responsive>
                                   <thead>
                                        <tr>
                                             <th>SPPD Number</th>
                                             <th>Description</th>
                                             <th>Location</th>
                                             <th>Total</th>
                                             <th>Status</th>
                                             <th>Created By</th>
                                             <th>Head</th>
                                             <th>HRGA</th>
                                             <th>Finance</th>
                                             <th>Created At</th>
                                             <th>Action</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sppd?.map((item, id) => {
                                             console.log(item, 'tem')
                                             return (
                                                  <tr key={id}>
                                                       <td>{item?.nomorSurat}</td>
                                                       <td>{item?.reason?.length > 0 ? item?.reason?.join(', ') : item?.reason}</td>
                                                       <td>{item?.address1} {item?.address2 ? `dan ${item?.address2}` : null}</td>
                                                       <td>{rupiah(item?.amount)}</td>
                                                       <td>
                                                            <div className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                 <Col>
                                                                      <Badge pill color={item?.status === "Approved" ? "success" : item?.isRejected === true ? "danger" : item?.status?.includes("Realization") ? "warning" : "primary"}>
                                                                           {item?.isRejected ? "REJECTED" : item?.status}
                                                                      </Badge>
                                                                 </Col>
                                                                 {item?.isRejected ?
                                                                      <Col>
                                                                           <Button color='flat-success' size="sm" outline id={`popClick${id}`}>
                                                                                <Info size={15} />
                                                                           </Button>
                                                                           <UncontrolledPopover trigger='click' placement='top' target={`popClick${id}`}>
                                                                                <PopoverHeader>Reject Message</PopoverHeader>
                                                                                <PopoverBody>
                                                                                     <p>{item?.notes}</p>
                                                                                     <p>
                                                                                          Rejected by: {item?.rejected_by}
                                                                                     </p>
                                                                                </PopoverBody>
                                                                           </UncontrolledPopover>
                                                                      </Col> : null}
                                                            </div>
                                                       </td>
                                                       <td>{item?.employee?.name}</td>
                                                       <td>{item?.manager_id}</td>
                                                       <td>{item?.hrga_id}</td>
                                                       <td>{item?.finance_id}</td>
                                                       <td>{moment(item?.createdAtInt).format('DD MMMM YYYY HH:mm')}</td>
                                                       <td className="col-md-3">
                                                            <UncontrolledDropdown>
                                                                 <DropdownToggle
                                                                      className="icon-btn hide-arrow"
                                                                      color="transparent"
                                                                      size="sm"
                                                                      caret
                                                                 >
                                                                      <MoreVertical size={15} />
                                                                 </DropdownToggle>
                                                                 <DropdownMenu>
                                                                      <DropdownItem
                                                                           onClick={() =>
                                                                                navigate(
                                                                                     `/sppd/invoice/${item.id}`
                                                                                )
                                                                           }
                                                                      >
                                                                           <FileText className="me-50" size={15} />{" "}
                                                                           <span className="align-middle">
                                                                                View Invoice
                                                                           </span>
                                                                      </DropdownItem>

                                                                      <DropdownItem
                                                                           onClick={() =>
                                                                                navigate(
                                                                                     item?.status === 'Waiting in HRGA' ? `/sppd/edit/${item?.id}` : `/sppd/draft/${item?.id}`
                                                                                )
                                                                           }
                                                                      >
                                                                           <FileText className="me-50" size={15} />{" "}
                                                                           <span className="align-middle">
                                                                                View Draft
                                                                           </span>
                                                                      </DropdownItem>
                                                                      {
                                                                           item.isRejected && !item.isRealization && item?.employee?.id === userData?.id ?
                                                                                <DropdownItem onClick={() => navigate(`/sppd/edit/${item?.id}`)}>
                                                                                     <BiPencil className="me-50" size={15} />{" "}
                                                                                     <span className="align-middle">
                                                                                          Edit
                                                                                     </span>
                                                                                </DropdownItem>
                                                                                : item?.isRealization && item?.status === "Waiting for Realization" && item?.employee?.id === userData?.id ?
                                                                                     <DropdownItem onClick={() => navigate(`/sppd/edit/${item?.id}`)}>
                                                                                          <BiPencil className="me-50" size={15} />{" "}
                                                                                          <span className="align-middle">
                                                                                               Add Realization
                                                                                          </span>
                                                                                     </DropdownItem>
                                                                                     : null
                                                                      }
                                                                 </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                       </td>
                                                  </tr>
                                             )
                                        })}
                                   </tbody>
                              </Table>
                         </CardText >

                    </CardBody>
               </Card>
          </>
     )
}

export default SppdIndex