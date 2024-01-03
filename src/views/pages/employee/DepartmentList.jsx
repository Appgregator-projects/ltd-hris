import React from 'react'
import Avatar from '@components/avatar'

import {
     Card, CardBody, CardHeader, CardTitle, CardFooter, Badge
} from "reactstrap";

import DataTable from 'react-data-table-component'
const status = {
     1: { title: 'Manager', color: 'light-primary' },
     2: { title: 'Supervisor', color: 'light-success' },
     3: { title: 'Staff', color: 'light-info' },
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
                         {/* <small className='mt-1'>{row.phone}</small> */}
                    </div>

               </div>
          )
     },
     {
          name: 'Phone',
          sortable: true,
          minWidth: '150px',
          selector: row => row.phone
     },
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
          minWidth: '150px',
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
     return (
          <Card>
               <CardHeader className="border-bottom">
                    <CardTitle tag="h4">Department</CardTitle>
               </CardHeader>
               <div className="react-dataTable">
                    <DataTable
                         data={data}
                         className="react-dataTable"
                         noHeader
                         columns={columns}
                    />
               </div>
               <CardFooter>
               </CardFooter>
          </Card>
     )
}

export default DepartmentList