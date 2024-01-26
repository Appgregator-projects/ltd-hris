import React, { Fragment } from 'react'
import {
     Table,
     Input,
} from "reactstrap";
import { TableData } from './TableData'
const TableComponent = ({ id }) => {
     const idForm = TableData.findIndex(x => parseInt(x.idForm) === parseInt(id))

     console.log(idForm, id, TableData)
     return (
          <Fragment>
               <Table responsive>
                    <thead>
                         <tr>
                              {idForm !== -1 && TableData?.[idForm]?.thead?.map((item, index) => (
                                   <th key={index}>{item}</th>
                              ))}
                         </tr>
                    </thead>
                    <tbody>
                         {idForm !== -1 && TableData?.[idForm]?.tbody ? TableData?.[idForm]?.tbody?.map((item, index) => (
                              <tr>
                                   <td key={index}>{item}</td>
                                   <td><Input /></td>
                                   <td><Input /></td>
                                   {/* {TableData?.[idForm]?.thead?.map((item, index) => (
                                        <>
                                             <td><Input /></td>
                                        </>
                                   ))} */}
                              </tr>
                         )) :
                              (<tr>
                                   {TableData?.[idForm]?.thead?.map((item, index) => (
                                        <td><Input /></td>
                                   ))}
                              </tr>)
                         }
                    </tbody>
               </Table>
          </Fragment>
     )
}

export default TableComponent