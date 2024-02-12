// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { read, utils } from 'xlsx'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Download, DownloadCloud, Upload } from 'react-feather'
import FileSaver from 'file-saver'

// ** Custom Components
import ExtensionsHeader from '@components/extensions-header'

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";


// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Table, CardHeader, CardTitle, Input, Label, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'
import { EXCEL_FILE_BASE64 } from './constants'
import Api from "../../../sevices/Api";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ImportComponent = () => {
     // ** States
     const [name, setName] = useState('')
     const [value, setValue] = useState('')
     const [tableData, setTableData] = useState([])
     const [filteredData, setFilteredData] = useState([])

     console.log(tableData, 'xx')

     const getTableData = (arr, name) => {
          setTableData(arr)
          setName(name)
     }

     const { getRootProps, getInputProps } = useDropzone({
          multiple: false,
          onDrop: result => {
               const reader = new FileReader()
               reader.onload = function () {
                    const fileData = reader.result
                    const wb = read(fileData, { type: 'binary' })

                    wb.SheetNames.forEach(function (sheetName) {
                         const rowObj = utils.sheet_to_row_object_array(wb.Sheets[sheetName])
                         getTableData(rowObj, result[0].name)
                    })
               }
               if (result.length && result[0].name.endsWith('xlsx')) {
                    reader.readAsBinaryString(result[0])
               } else {
                    toast.error(
                         () => (
                              <p className='mb-0'>
                                   You can only upload <span className='fw-bolder'>.xlsx</span>, <span className='fw-bolder'>.xls</span> &{' '}
                                   <span className='fw-bolder'>.csv</span> Files!.
                              </p>
                         ),
                         {
                              style: {
                                   minWidth: '380px'
                              }
                         }
                    )
               }
          }
     })

     const handleFilter = e => {
          const data = tableData
          let filteredData = []
          const value = e.target.value
          setValue(value)

          if (value.length) {
               filteredData = data.filter(col => {
                    const keys = Object.keys(col)

                    const startsWithCondition = keys.filter(key => {
                         return col[key].toString().toLowerCase().startsWith(value.toLowerCase())
                    })

                    const includesCondition = keys.filter(key => col[key].toString().toLowerCase().includes(value.toLowerCase()))

                    if (startsWithCondition.length) return col[startsWithCondition]
                    else if (!startsWithCondition && includesCondition.length) return col[includesCondition]
                    else return null
               })
               setFilteredData(filteredData)
               setValue(value)
          } else {
               return null
          }
     }
     /*eslint-disable */
     const headArr = tableData.length
          ? tableData.map((col, index) => {
               if (index === 0) return [...Object.keys(col)]
               else return null
          })
          : []
     /*eslint-enable */
     const dataArr = value.length ? filteredData : tableData.length && !value.length ? tableData : null

     const renderTableBody = () => {
          if (dataArr !== null && dataArr.length) {
               return dataArr.map((col, index) => {
                    const keys = Object.keys(col)
                    const renderTd = keys.map((key, index) => <td key={index}>{col[key]}</td>)
                    return <tr key={index}>{renderTd}</tr>
               })
          } else {
               return null
          }
     }

     const renderTableHead = () => {
          if (headArr.length) {
               return headArr[0].map((head, index) => {
                    return <th key={index}>{head}</th>
               })
          } else {
               return null
          }
     }

     const handleDownload = () => {
          let sliceSize = 1024;
          let byteCharacters = atob(EXCEL_FILE_BASE64);
          let bytesLength = byteCharacters.length;
          let slicesCount = Math.ceil(bytesLength / sliceSize);
          let byteArrays = new Array(slicesCount);
          for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
               let begin = sliceIndex * sliceSize;
               let end = Math.min(begin + sliceSize, bytesLength);
               let bytes = new Array(end - begin);
               for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
               }
               byteArrays[sliceIndex] = new Uint8Array(bytes);
          }
          FileSaver.saveAs(
               new Blob(byteArrays, { type: "application/vnd.ms-excel" }),
               "format-employee_income.xlsx"
          );
     }

     const handleImport = async () => {
          // const { status, data } = await Api.post('/hris/employee-income/batch')
          MySwal.fire({
               title: "Are you sure?",
               text: `Set Income for these Employee?`,
               icon: "warning",
               showCancelButton: true,
               confirmButtonText: "Create!",
               customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-outline-danger ms-1",
               },
               buttonsStyling: false,
          }).then(async (result) => {
               if (result.isConfirmed) {
                    const { status, data } = await Api.post("/hris/employee-income/batch", { data: tableData })
                    if (status) {
                         return MySwal.fire({
                              icon: "success",
                              title: "Success!",
                              text: `Employee Income has been set!`,
                              customClass: {
                                   confirmButton: "btn btn-success",
                              },
                         });
                    } else {
                         return toast.error(`Error : ${data}`, {
                              position: "top-center",
                         });
                    }
               }
          })

     }

     return (
          <Fragment>
               <Breadcrumbs
                    title="Import Employee Income"
                    data={[{ title: "Payroll", link: '/payroll' }, { title: 'Import Employee Income' }]}
                    rightMenu={
                         <Fragment>
                              <Button.Ripple size='sm' outline color='primary' onClick={() => handleDownload()}>
                                   <Download size={15} className='me-1' />
                                   Format Import
                              </Button.Ripple>
                         </Fragment>
                    }
               />
               <Row className='import-component'>
                    <Col sm='12'>
                         <Card>
                              <CardBody>
                                   <Row>
                                        <Col sm='12'>
                                             <div {...getRootProps({ className: 'dropzone' })}>
                                                  <input {...getInputProps()} />
                                                  <div className='d-flex align-items-center justify-content-center flex-column'>
                                                       <DownloadCloud size={64} />
                                                       <h5>Drop Files here or click to upload</h5>
                                                       <p className='text-secondary'>
                                                            Drop files here or click{' '}
                                                            <a href='/' onClick={e => e.preventDefault()}>
                                                                 browse
                                                            </a>{' '}
                                                            thorough your machine
                                                       </p>
                                                  </div>
                                             </div>
                                        </Col>
                                   </Row>
                              </CardBody>
                         </Card>
                    </Col>
                    {tableData.length ? (
                         <Col sm='12'>
                              <Card>
                                   <CardHeader className='justify-content-between flex-wrap'>
                                        <CardTitle tag='h4'>{name}</CardTitle>
                                        <div className='d-flex align-items-center justify-content-end'>
                                             <Label for='search-input' className='me-1'>
                                                  Search
                                             </Label>
                                             <Input id='search-input' type='text' bsSize='sm' value={value} onChange={e => handleFilter(e)} />
                                        </div>
                                   </CardHeader>
                                   <Table className='table-hover-animation' responsive>
                                        <thead>
                                             <tr>{renderTableHead()}</tr>
                                        </thead>
                                        <tbody>{renderTableBody()}</tbody>
                                   </Table>
                              </Card>
                              <Button.Ripple color='success' size='sm' onClick={handleImport}>
                                   <Upload size={15} className='me-1' />
                                   Import All Data
                              </Button.Ripple>
                         </Col>
                    ) : null}
               </Row>
          </Fragment>
     )
}

export default ImportComponent