import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, CardHeader, Col, Input, InputGroup, Label, Row } from 'reactstrap'
import { columnsAttendance } from '../LMS/store/data'
import { formatDate } from '../../../utility/Utils'
import { Search } from 'react-feather'

const AttendanceReport = ({ allAttendance, periode, onSearch, setSearch, search, onKeyPress }) => {

     return (
          <Row>
               <Col>
                    <Card>
                         <p className="h3 ms-2 mt-2">Report All User</p>
                         <p className="ms-2 mt-1 "> {formatDate(periode[0])}  {periode.length == 2 && `to ${formatDate(periode[1])}`}</p>
                         <Row className='justify-content-end mx-0' onKeyPress={onKeyPress}>
                              <Col md={"3"} lg={"6"} >
                                   <Label className="form-label">Search</Label>
                                   <InputGroup className="mb-2">
                                        <Input
                                             placeholder={`search`}
                                             onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <Button color="primary"
                                             onClick={() => onSearch(search)}
                                        >
                                             <Search size={15}
                                             />
                                        </Button>
                                   </InputGroup>
                              </Col>
                         </Row>
                         <CardBody>
                              <DataTable
                                   data={allAttendance}
                                   columns={columnsAttendance}
                              />
                         </CardBody>
                    </Card>
               </Col>
          </Row>
     )
}

export default AttendanceReport