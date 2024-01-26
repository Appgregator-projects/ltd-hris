import React, { Fragment } from 'react'
import { Save } from 'react-feather';
import {
     Table,
     Input,
     Row,
     Col,
     Button
} from "reactstrap";


const TableComponent = ({ data, setTableInput, id, tableInput }) => {
     const handleInputTable = (index, value, type, columnIndex) => {
          setTableInput((prevTableData) => {
               const newTableData = { ...prevTableData };

               if (type === 'column') {
                    newTableData.thead[index] = value;
               } else if (type === 'row') {
                    newTableData.tbody[index].td[columnIndex] = value
               }

               return newTableData;
          });
     };

     const renderThead = () => {
          const columns = id && tableInput ? tableInput.thead : Array.from({ length: data.column })
          return columns?.map((item, index) => (
               <th key={index}>
                    <Input defaultValue={item} onChange={(e) => handleInputTable(index, e.target.value, 'column')} />
               </th>
          ));
     };

     const renderTbody = () => {
          const row = id && tableInput ? tableInput.tbody : Array.from({ length: data.row })
          return row.map((rowData, rowIndex) => (
               <tr key={rowIndex}>
                    {(id && tableInput ? rowData.td : Array.from({ length: data.column })).map((cellData, columnIndex) => (
                         <td key={columnIndex}>
                              <Input defaultValue={cellData} onChange={(e) => handleInputTable(rowIndex, e.target.value, 'row', columnIndex)} />
                         </td>
                    ))}
               </tr>
          ))
     }

     return (
          <Fragment>
               {data?.column || tableInput?.thead ?
                    <>
                         <h2 className='text-center'>Preview Table</h2>
                         <p className='text-center  mb-2'>Input your data table in every column and/or row you need</p>


                         <Table responsive>
                              <thead>
                                   <tr>{renderThead()}</tr>
                              </thead>
                              <tbody>
                                   {renderTbody()}
                              </tbody>
                         </Table>

                         <Row className='mt-2'>
                              <Col>
                                   <Button.Ripple className='btn-icon mt-1' color='success' type='submit' name='update' value='update'>
                                        <Save size={16} /> {id ? 'Update' : 'Save'} Table
                                   </Button.Ripple>
                              </Col>
                         </Row>
                    </> : null}
          </Fragment>
     )
}

export default TableComponent