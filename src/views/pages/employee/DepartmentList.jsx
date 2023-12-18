import React from 'react'
import Avatar from '@components/avatar'

import {
     Card, CardBody, CardHeader, CardTitle, CardFooter, Badge
} from "reactstrap";

import DataTable from 'react-data-table-component'
const status = {
     1: { title: 'Manager', color: 'light-primary' },
     2: { title: 'Supervisor', color: 'light-success' },
     3: { title: 'Staff', color: 'light-danger' },
     4: { title: 'Resigned', color: 'light-warning' },
     5: { title: 'Applied', color: 'light-info' }
}
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

export const columns = [
     {
          name: 'Name',
          minWidth: '250px',
          sortable: row => row.name,
          cell: row => (
               <div className='d-flex align-items-center mt-1 mb-1'>
                    {row.avatar === null ? (
                         <Avatar color={`light-${states[row?.status]}`} content={row.name} initials />
                    ) : (
                         <Avatar img={row.avatar} />
                    )}
                    <div className='user-info text-truncate ms-1'>
                         <span className='d-block fw-bold text-truncate'>{row.name}</span>
                         <small className='mt-1'>{row.email}</small> <br />
                         <small className='mt-1'>{row.phone}</small>
                    </div>

               </div>
          )
     },
     // {
     //      name: 'Phone',
     //      sortable: true,
     //      // minWidth: '250px',
     //      selector: row => row.phone
     // },
     {
          name: 'NIP',
          sortable: true,
          minWidth: '150px',
          selector: row => row.nip
     },

     {
          name: 'Position',
          sortable: true,
          minWidth: '150px',
          selector: row => row.position
     },
     // {
     //      name: 'Role',
     //      sortable: true,
     //      // minWidth: '100px',
     //      selector: row => row.role
     // },
     {
          name: 'Level',
          // minWidth: '150px',
          sortable: row => row.level,
          cell: row => {
               return (
                    <Badge color={status[row?.level === 'Manager' ? 1 : row?.level === 'Supervisor' ? 2 : 3]?.color} pill>
                         {row.level}
                    </Badge>
               )
          }
     },

]

const DepartmentList = ({ data }) => {
     console.log(data, 'nidataw')
     return (
          <Card>
               <CardHeader>
                    <CardTitle>Department</CardTitle>
               </CardHeader>
               <CardBody>
                    <div>
                         <span></span>
                         {/* <AvatarGroup data={userDivision}/> */}
                    </div>
                    <div className='d-flex justify-content-between align-items-end mt-1 pt-25'>
                         <div className='role-heading'>
                              <DataTable
                                   data={data}
                                   columns={columns}
                              />
                              {/* <h4 className='fw-bolder'>{balance.category?.name}</h4> */}
                              {/* <Link
                                   to='/'
                                   className='role-edit-modal'
                                   onClick={e => {
                                        e.preventDefault()
                                        // setModalType('Edit')
                                        // setShow(true)
                                   }}
                              >
                              </Link> */}
                         </div>
                         {/* <Link to='' className='text-body' onClick={e => e.preventDefault()}>
                              <Copy className='font-medium-5' />
                         </Link> */}
                    </div>
               </CardBody>
               <CardFooter>
               </CardFooter>
          </Card>
     )
}

export default DepartmentList