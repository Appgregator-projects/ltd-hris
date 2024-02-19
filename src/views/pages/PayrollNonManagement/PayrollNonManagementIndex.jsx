import { useState, useRef, useEffect } from "react";
import {
     Badge,
     Button,
     Card,
     CardBody,
     CardHeader,
     CardTitle,
     Col,
     Input,
     Label,
     Modal,
     ModalBody,
     ModalHeader,
     Row,
     Table,
     UncontrolledTooltip,
     InputGroup
} from "reactstrap";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Trash, Edit, Eye, CheckCircle, Plus, RefreshCcw, ChevronDown, Search, Upload } from "react-feather";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Flatpickr from 'react-flatpickr';
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ExportComponent from "../../../@core/components/export";
import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from 'xlsx';
import ImportComponent from "../../../@core/components/import";
import moment from "moment";
import UILoader from '@components/ui-loader';
import Api from "../../../sevices/Api";
import { numberFormat } from "../../../Helper";

const MySwal = withReactContent(Swal);

const CustomPagination = () => {
     return (
          <ReactPaginate
               previousLabel={''}
               nextLabel={''}
               breakLabel='...'
               pageCount={payrollPaginate - 1 !== 0 ? payrollPaginate - 1 : 1}
               marginPagesDisplayed={2}
               pageRangeDisplayed={2}
               activeClassName='active'
               forcePage={currentPage !== 0 ? currentPage - 1 : 0}
               onPageChange={page => handlePagination(page)}
               pageClassName='page-item'
               breakClassName='page-item'
               nextLinkClassName='page-link'
               pageLinkClassName='page-link'
               breakLinkClassName='page-link'
               previousLinkClassName='page-link'
               nextClassName='page-item next-item'
               previousClassName='page-item prev-item'
               containerClassName={
                    'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
               }
          />
     )
}

export default function PayrollNonManagementIndex() {
     const componentPDF = useRef();
     const [payrolls, setPayrolls] = useState([]);
     const [picker, setPicker] = useState(new Date());
     const [searchPicker, setSearchPicker] = useState(new Date());
     const [valuePicker, setValuePicker] = useState(new Date());
     const [info, setInfo] = useState(null);
     const [payrollPaginate, setPayrollPaginate] = useState();
     const [toggleModal, setToggleModal] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [currentPage, setCurrentPage] = useState(0);
     const [rowsPerPage, setRowsPerPage] = useState(15);
     const [searchValue, setSearchValue] = useState("");
     const [exportType, setExportType] = useState('');
     const [status, setStatus] = useState('');
     const [dataToExport, setDataToExport] = useState([]);
     const [modal, setModal] = useState({})
     const fetchPayroll = async (params) => {
          try {
               // Implementation of fetchPayroll function
          } catch (error) {
               throw error;
          }
     };

     const handlePicker = async (date) => {
          // Implementation of handlePicker function
     }

     const handleStatus = (e) => {
          // Implementation of handleStatus function
     }

     const dataToRender = () => {
          // Implementation of dataToRender function
     }

     const handlePagination = page => {
          // Implementation of handlePagination function
     }

     const handlePerPage = e => {
          // Implementation of handlePerPage function
     }
     const handleFilter = () => {

     }
     useEffect(() => {
          // Fetch payroll data on component mount
          fetchPayroll({ page: currentPage, perPage: rowsPerPage, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status })
     }, []);

     const onDelete = (id) => {
          // Implementation of onDelete function
     };

     const onApprove = (id) => {
          // Implementation of onApprove function
     };

     const onPeriode = () => {
          // Implementation of onPeriode function
     }

     const getInitials = (name) => {
          // Implementation of getInitials function
     }

     const handlePrint = useReactToPrint({
          // Implementation of handlePrint function
     })

     const handleExport = (type) => {
          // Implementation of handleExport function
     }

     const handleKeyPress = (e) => {
          // Implementation of handleKeyPress function
     };

     return (
          <UILoader blocking={isLoading} overlayColor='rgba(115, 103, 240, .1)'>
               <Row>
                    <Col lg="12" className="mb-2 d-flex justify-content-between">
                         <div >

                              <Button.Ripple
                                   size="sm"
                                   color="primary"
                                   tag={Link}
                                   to="/payroll-form/non-management"
                                   className="me-1"
                              >
                                   <Plus size={14} />
                                   <span className="align-middle text-sm ms-25">Create Payroll</span>
                              </Button.Ripple>

                              <Button.Ripple
                                   size="sm"
                                   color="success"
                                   onClick={onPeriode}
                              // tag={Link}
                              // to="/payroll-form"
                              >
                                   <RefreshCcw size={14} />
                                   <span className="align-middle text-sm ms-25">Generate All Payroll</span>
                              </Button.Ripple>
                         </div>
                         <div className="d-flex ">

                              <ExportComponent handlePrint={handlePrint} setExportType={setExportType} handleExport={handleExport} />
                              <Link
                                   to={`/payroll/import/employee-income`}
                              // title="Detail"
                              >
                                   <Button.Ripple size={'sm'} outline color='success' onClick={() => navigate}>
                                        <Upload size={15} />
                                        <span className="ms-1">Employee Income</span>
                                   </Button.Ripple>
                              </Link>
                         </div>
                    </Col>
                    <Col lg="12">
                         <Card>
                              <CardBody>
                                   <Row className="mx-0 mt-1 mb-50">
                                        <Col sm="6">
                                             <div className="d-flex align-items-center w-100">
                                                  <label htmlFor="rows-per-page">Show</label>
                                                  <Input
                                                       className="mx-50"
                                                       type="select"
                                                       id="rows-per-page"
                                                       value={rowsPerPage}
                                                       onChange={handlePerPage}
                                                       style={{ width: "5rem" }}
                                                  >
                                                       <option value="15">15</option>
                                                       <option value="25">25</option>
                                                       <option value="50">50</option>
                                                  </Input>
                                                  <label htmlFor="rows-per-page">Entries</label>
                                             </div>
                                        </Col>
                                        <Col
                                             className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
                                             sm="6"
                                             onKeyPress={handleKeyPress}
                                        >

                                             <Row>
                                                  <Col className="col-6">
                                                       <Label>Periode</Label>
                                                       <Flatpickr
                                                            id='range-picker'
                                                            className='form-control'
                                                            value={valuePicker}
                                                            onChange={date => handlePicker(date)}
                                                            options={{
                                                                 mode: 'range',
                                                                 plugins: [
                                                                      new monthSelectPlugin({
                                                                           shorthand: true,
                                                                           dateFormat: "F Y",
                                                                           altInput: true,
                                                                           altFormat: "m/y",
                                                                           theme: "light",

                                                                      })
                                                                 ]
                                                            }}
                                                       />
                                                  </Col>
                                                  <Col>
                                                       <Label>Search</Label>
                                                       <InputGroup className="mb-2">
                                                            <Input
                                                                 onChange={(e) => setSearchValue(e.target.value)}
                                                                 className="dataTable-filter"
                                                                 type="text"
                                                                 bsSize="sm"
                                                                 id="search-input"
                                                                 value={searchValue}
                                                            />
                                                            <Button color="primary"
                                                                 onClick={handleFilter}
                                                            >
                                                                 <Search size={15}
                                                                 />
                                                            </Button>
                                                       </InputGroup>
                                                  </Col>
                                                  <Row>
                                                       <Col className="col-6">
                                                            <Label>Status</Label>
                                                            <Input type="select"
                                                                 value={status}
                                                                 onChange={handleStatus}>
                                                                 <option value={''}>Select Status</option>
                                                                 <option value={false}>Waiting</option>
                                                                 <option value={true}>Approved</option>
                                                            </Input>

                                                       </Col>
                                                  </Row>
                                             </Row>

                                        </Col>
                                   </Row>
                                   <div className="react-dataTable mt-3" ref={componentPDF} style={{ width: '100%' }}>
                                        <DataTable
                                             noHeader
                                             pagination
                                             paginationServer
                                             className="react-dataTable"
                                             // columns={serverSideColumns(onDelete, onApprove, exportType)}
                                             sortIcon={<ChevronDown size={10} />}
                                             paginationComponent={CustomPagination}
                                             data={dataToRender()}
                                        />
                                   </div>

                              </CardBody>
                         </Card>
                    </Col>
               </Row>
               <Modal
                    isOpen={toggleModal}
                    toggle={() => setToggleModal(!toggleModal)}
                    className={`modal-dialog-centered modal-lg`}
               >
                    <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
                         {modal.title}
                    </ModalHeader>
                    <ModalBody>

                         {modal.mode === 'periode' ? (
                              <>
                                   <Label>Date</Label>

                                   <Label>Periode</Label>
                                   <Flatpickr
                                        id='range-picker'
                                        className='form-control'
                                        value={picker}
                                        onChange={date => setPicker(date)}
                                        options={{
                                             plugins: [
                                                  new monthSelectPlugin({
                                                       shorthand: true,
                                                       dateFormat: "F Y",
                                                       altInput: true,
                                                       altFormat: "m/y",
                                                       theme: "light"
                                                  })
                                             ]
                                        }}
                                   />
                              </>
                         ) : <></>}
                         <Col className="mt-1">
                              <Button
                                   type="button"
                                   size="md"
                                   color="danger"
                                   onClick={() => setToggleModal(!toggleModal)}

                              >
                                   Cancel
                              </Button>
                              {modal.mode === 'periode' ? (
                                   <Button
                                        type="button"
                                        size="md"
                                        color="primary"
                                        className="ms-2"
                                        onClick={handlePeriode}
                                   >
                                        Save
                                   </Button>
                              ) : <></>}
                         </Col>
                    </ModalBody>
               </Modal >
          </UILoader>
     );
}
