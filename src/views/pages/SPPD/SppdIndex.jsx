import React, { useEffect, useState } from 'react'
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Button, Card, CardBody, CardText, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Label, PopoverBody, PopoverHeader, Row, Table, UncontrolledDropdown, UncontrolledPopover } from 'reactstrap';
import { FileText, Info, MoreVertical, Plus, Search } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { getCollectionFirebase } from '../../../sevices/FirebaseApi';
import { rupiah } from '../../../Helper';
import moment from 'moment';
import { BiPencil } from "react-icons/bi";
import { clientTypessense } from '../../../apis/typesense';
import { handleEmployee } from '../../../redux/authentication';



const SppdIndex = () => {
     const userData = JSON.parse(localStorage.getItem('userData'))
     console.log(userData, "userDATASPPD")
     const navigate = useNavigate()

     const [sppd, setSppd] = useState([])
     const [search, setSearch] = useState([])

     const fetchSppd = async () => {
          let result = ''
          const conditions = [
               { field: 'createdBy', operator: '==', value: userData?.id }
          ]

          const sortBy = {
               field: 'status',
               direction: 'desc'
          }

          if (userData?.attributes?.level === 'Manager' || userData?.user?.departement_id === 17 || userData?.user?.departement_id === 26 || userData?.user?.departement_id === 42) {
               result = await getCollectionFirebase("sppd", [], sortBy);
          } else {
               result = await getCollectionFirebase("sppd", conditions, sortBy)
          }
          setSppd(result)
     }

     const handleSearch = async () => {
          let newReimburse = []
          let reimburse = []

          let searchParameters = {
               q: search !== "" ? search : "*",
               query_by: ["reason", "employee.name", "status", "nomorSurat", "address1", "address2"],
               // filter_by: `pipelineId:${selectedPipeline.value}`,
               per_page: 10,
          };

          if (userData?.attributes?.level === 'Manager' || userData?.user?.departement_id === 17 || userData?.user?.departement_id === 26 || userData?.user?.departement_id === 42) {
               reimburse = await clientTypessense
                    .collections(`sppd`)
                    .documents()
                    .search(searchParameters);

               console.log(reimburse, "ni reim manager")
          } else {
               searchParameters = {
                    ...searchParameters,
                    filter_by: `createdBy:${userData?.id}`
               }
               reimburse = await clientTypessense
                    .collections(`sppd`)
                    .documents()
                    .search(searchParameters);
          }

          newReimburse = reimburse?.hits?.map(
               (item) => item.document
          );
          console.log(search, "ini data search", newReimburse)
          setSppd(newReimburse)
     };

     const handleKeyPress = (e) => {
          if (e.key === "Enter") {
               e.preventDefault();
               handleSearch();
          }
     };

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
                         <Row>
                              <Col className="col12 col-md-6" onKeyPress={(e) => handleKeyPress(e)}>
                                   <Label className="form-label">Search</Label>
                                   <InputGroup className="mb-2">
                                        <Input
                                             placeholder={`Search...`}
                                             onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <Button color="primary"
                                             onClick={() => handleSearch()}
                                        >
                                             <Search size={15}
                                             />
                                        </Button>
                                   </InputGroup>
                              </Col>
                         </Row>

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