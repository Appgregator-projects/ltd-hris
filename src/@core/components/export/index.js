import React, { Fragment, useState } from 'react'
import { File, FileText, Grid, Printer, Share } from 'react-feather'
import {
     DropdownToggle,
     UncontrolledDropdown, DropdownItem, DropdownMenu
} from "reactstrap"
const ExportComponent = ({ handlePrint, handleExport }) => {

     const handleExportType = async (type) => {
          if (type === 'print') {
               handlePrint()
          } else {
               handleExport(type)
          }
     }

     return (
          <Fragment>
               <div className='d-flex align-items-center table-header-actions'>
                    <UncontrolledDropdown className='me-1' size='sm'>
                         <DropdownToggle color='secondary' caret outline>
                              <Share className='font-small-4 me-50' />
                              <span className='align-middle'>Export</span>
                         </DropdownToggle>
                         <DropdownMenu>
                              <DropdownItem className='w-100' onClick={() => handleExportType('print')}>
                                   <Printer className='font-small-4 me-50' />
                                   <span className='align-middle'>Print</span>
                              </DropdownItem>
                              <DropdownItem className='w-100' onClick={() => handleExportType('csv')} >
                                   <FileText className='font-small-4 me-50' />
                                   <span className='align-middle'>CSV</span>
                              </DropdownItem>
                              <DropdownItem className='w-100' onClick={() => handleExportType('xlsx')}>
                                   <Grid className='font-small-4 me-50' />
                                   <span className='align-middle'>Excel</span>
                              </DropdownItem>
                              {/* <DropdownItem className='w-100' onClick={() => handleExportType('pdf')}>
                                   <File className='font-small-4 me-50' />
                                   <span className='align-middle'>PDF</span>
                              </DropdownItem> */}
                         </DropdownMenu>
                    </UncontrolledDropdown>
               </div>
          </Fragment>
     )
}

export default ExportComponent