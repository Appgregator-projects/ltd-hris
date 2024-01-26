import React from 'react'
import TableSPPD from './TableSPPD'
import TableUplevel from './TableUplevel';

function TableIndex(props) {
     const id = props.type
     const number = id ? parseInt(id) : 0

     switch (number) {
          case 5:
               return <TableSPPD />;
          case 19:
               return <TableUplevel />;
          default:
               return ''
     }


}

export default TableIndex