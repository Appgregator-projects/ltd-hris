import React, { Fragment } from 'react'
import {
     Table,
     Input,
} from "reactstrap";

const TableComponent = ({ thead, tbody, valueFormTable, tableData,id }) => {
     console.log(tableData,"tabdat")
     // const handleInputChange = (rowIndex, colIndex, value) => {
     //      valueFormTable(rowIndex, colIndex, value);
     // };
     return (
          <Fragment>
               <Table responsive>
                    <thead>
                         <tr>
                              {thead?.map((item, index) => (
                                   <th key={index}>{item}</th>
                              ))}
                         </tr>
                    </thead>
                    <tbody>
                         {tbody?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
                                   {item?.td?.map((x, colIndex)=>(     
                                        <td key={colIndex}>{x ? x : <Input
                                             onChange={(e) => valueFormTable(rowIndex, colIndex, e.target.value, id)}
                                   />}</td>                               
                              ))}
                              </tr>
                         )) 
                         }
                    </tbody>
               </Table>
          </Fragment>
     )
}

export default TableComponent