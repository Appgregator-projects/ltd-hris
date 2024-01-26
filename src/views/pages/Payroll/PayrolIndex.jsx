import { useEffect, useRef, useState } from "react";
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
import Api from "../../../sevices/Api";
import { numberFormat } from "../../../Helper";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Trash, Edit, Eye, CheckCircle, Plus, RefreshCcw, ChevronDown, Search } from "react-feather";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DateRange from "../../../@core/components/flatpickr";
// ** Styles
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "flatpickr/dist/plugins/monthSelect/style.css";
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/flatpickr.min.css";
import "@styles/react/libs/tables/react-dataTable-component.scss"
import moment from "moment";


// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
// ** Custom Components
import UILoader from '@components/ui-loader'
import ExportComponent from "../../../@core/components/export";
import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from 'xlsx'

const MySwal = withReactContent(Swal);

export const serverSideColumns = (onDelete, onApprove) => {
  return [{
    sortable: true,
    name: "No",
    maxWidth: '2px',
    selector: (row, index) => (index + 1)
  },
  {
    sortable: true,
    name: "Employee",
    minWidth: "200px",
    selector: row => row.user ? (row?.user?.name ? row.user.name : row?.user?.email) : row.user_id
  },
  {
    sortable: true,
    name: "Periode",
    minWidth: "200px",
    selector: row => (row.periode ? dayjs(row.periode).format("MMMM-YYYY") : "-")
  },
  {
    sortable: true,
    name: "Amount (IDR)",
    minWidth: '200px',
    selector: row => (numberFormat(row.total))
  },
  {
    sortable: true,
    name: "Status",
    // minWidth: "250px",
    selector: row => (
      <Badge
        pill
        color={row.approved_at ? "light-success" : "light-info"}
        className="me-1"
      >
        {row.approved_at ? "Approved" : "Waiting"}
      </Badge>
    )
  },
  {
    sortable: false,
    name: "Action",
    minWidth: "100px",
    selector: (row) => (
      <div className="d-flex">
        <div className="pointer">
          {!row.approved_at ? (
            <>
              <Trash
                className="me-50"
                size={15}
                title="Delete"
                onClick={() => onDelete(row.id)}
                id={`payrol-delete-${row.id}`}
              />
              <UncontrolledTooltip
                placement="top"
                target={`payrol-delete-${row.id}`}
              >
                Delete
              </UncontrolledTooltip>
            </>
          ) : (
            <></>
          )}
          <span className="align-middle"></span>
          <Link
            to={`/payroll/${row.id}`}
          // title="Detail"
          >
            <Eye
              className="me-50"
              size={15}
              id={`paycheck-${row.id}`}
            />
          </Link>
          <UncontrolledTooltip
            placement="top"
            target={`paycheck-${row.id}`}
          >
            Detail
          </UncontrolledTooltip>
          <span className="align-middle"></span>
          {!row.approved_at ? (
            <Link to={`/payroll/${row.id}/edit`}>
              <Edit
                className="me-50"
                size={15}
                id={`payroll-edit-${row.id}`}
              />
              <UncontrolledTooltip
                placement="top"
                target={`payroll-edit-${row.id}`}
              >
                Edit
              </UncontrolledTooltip>
            </Link>
          ) : (
            <></>
          )}
          {!row.approved_at ? (
            <>
              <CheckCircle
                className="me-50"
                title="Approve"
                size={15}
                onClick={() => onApprove(row.id)}
                id={`payrol-approve-${row.id}`}
              />
              <UncontrolledTooltip
                placement="top"
                target={`payrol-approve-${row.id}`}
              >
                Approve
              </UncontrolledTooltip>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
  ]

}


export default function PayrolIndex() {
  const componentPDF = useRef()
  const [payrolls, setPayrolls] = useState([]);
  const [picker, setPicker] = useState(new Date())
  const [searchPicker, setSearchPicker] = useState(new Date())
  const [valuePicker, setValuePicker] = useState(new Date())
  const [info, setInfo] = useState(null)
  const [payrollPaginate, setPayrollPaginate] = useState()
  const [toggleModal, setToggleModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [searchValue, setSearchValue] = useState("")
  const [exportType, setExportType] = useState('')
  const [status, setStatus] = useState('')
  const [dataToExport, setDataToExport] = useState([])

  console.log(picker, 'po')

  const [modal, setModal] = useState({
    title: "User assign",
    mode: "get",
    item: null
  })

  const fetchPayroll = async (params) => {
    try {
      const { page, perPage, search, periodeStart, periodeEnd, approved } = params;
      const queryString = `page=${page}&limit=${perPage}&search=${search}` +
        `${periodeStart ? `&periodeStart=${periodeStart}` : ''}` +
        `${periodeEnd ? `&periodeEnd=${periodeEnd}` : ''}` +
        `${approved !== undefined ? `&approved=${approved}` : ''}`;

      const { status, data } = await Api.get(`/hris/payroll?${queryString}`);
      console.log(data, 'll')
      // if (status) {
      setPayrollPaginate(data.pagination ? data.pagination.totalPages : 0)
      // setPayrolls([...data.rows]);
      setPayrolls([...data.pagination.data.rows])
      // }
    } catch (error) {
      throw error;
    }
  };

  const handlePicker = async (date) => {
    setValuePicker(date)
    const periodeStart = moment(date[0]).format("YYYY-MM")
    let periodeEnd = ''
    if (date.length === 1) {
      periodeEnd = periodeStart
    } else {
      periodeEnd = moment(date[1]).format("YYYY-MM")
    }
    setSearchPicker({
      periodeStart, periodeEnd
    })
    fetchPayroll({ page: 0, perPage: 15, search: '', periodeStart: periodeStart, periodeEnd: periodeEnd, approved: status })
  }

  const handleStatus = (e) => {
    setStatus(e.target.value)
    fetchPayroll({ page: 0, perPage: 15, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: e.target.value })
  }

  const dataToRender = () => {
    const filters = {
      q: searchValue
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (payrolls.length > 0) {
      return payrolls
    } else if (payrolls.length === 0 && isFiltered) {
      return []
    } else {
      return payrolls.slice(0, rowsPerPage)
    }
  }



  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchPayroll({
      page: page.selected + 1,
      perPage: rowsPerPage,
      search: searchValue,
      periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status
    })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    fetchPayroll({
      page: currentPage,
      perPage: parseInt(e.target.value),
      search: searchValue,
      periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status
    })
    setRowsPerPage(parseInt(e.target.value))
  }


  useEffect(() => {
    fetchPayroll({ page: currentPage, perPage: rowsPerPage, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status })
  }, []);

  const onDelete = (id) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await Api.delete(`/hris/payroll/${id}`);
          if (typeof data.status !== "undefined")
            return toast.error(`Error : ${data.data}`, {
              position: "top-center",
            });
          toast.success('Payroll has deleted', {
            position: "top-center",
          });
          return fetchPayroll({ page: currentPage, perPage: rowsPerPage, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status });
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  };
  const onApprove = (id) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await Api.patch(`/hris/payroll/${id}`);
          if (typeof data.status !== "undefined")
            return toast.error(`Error : ${data.data}`, {
              position: "top-center",
            });
          toast.success(data, {
            position: "top-center",
          });
          return fetchPayroll({ page: currentPage, perPage: rowsPerPage, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status })
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  };
  const onPeriode = () => {
    setModal({
      title: "Periode Payroll",
      mode: "periode",
    })
    setToggleModal(true)

    // setAttendanceReport(true)
    // if (allAttendance.length === 0) {
    //   fetchAllAttendance()
    // }
  }
  function getInitials(name) {
    const words = name.split(' ');
    let initials = '';

    for (const word of words) {
      initials += word.charAt(0).toUpperCase();
    }

    return initials;
  }

  const handlePrint = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Payroll',
    onAfterPrint: () => setExportType('')
  })
  console.log(payrolls, 'payu')
  const handleExport = (type) => {
    // return console.log(moment(searchPicker.periodeStart).format('LL'), 'dd')
    setExportType('')
    const exportArr = dataToExport
    payrolls.map((item, index) => {
      const indexWithLeadingZeros = String(index + 1).padStart(3, '0');
      exportArr.push({
        No: index + 1,
        'Transaction ID': `${getInitials(item?.user?.company?.name)}${moment().format('MM')}${indexWithLeadingZeros}`,
        'Transfer Type': item?.user?.employee_attribute?.bank_Account?.toLowerCase() === 'bank central asia' ? 'BCA' : null,
        'Beneficiary ID': null,
        'Credited Account': item?.user?.employee_attribute?.bank_Account_Name,
        'Receiver Name': item?.user?.employee_attribute?.bank_Account_Number,
        Amount: parseFloat(item?.total),
        NIP: item?.user?.nip,
        Remark: null,
        'Beneficiary email address': null,
        'Receiver Swift Code': null,
        'Receiver Cust Type': null,
        'Receiver Cust Residence': null
      })
    })
    setDataToExport([...exportArr])

    const periodeName =
      searchPicker.periodeStart == searchPicker.periodeEnd ? moment(searchPicker.periodeStart).format('LL') :
        searchPicker.periodeStart !== searchPicker.periodeEnd ? `${moment(searchPicker.periodeStart).format('LL')} - ${moment(searchPicker.periodeEnd).format('LL')}` :
          moment(searchPicker.periodeStart).format('LL');

    const name = type.length ? `Payroll ${periodeName}.${type}` : `payroll.${type}`
    const wb = utils.json_to_sheet(dataToExport)
    const wbout = utils.book_new()
    utils.book_append_sheet(wbout, wb, 'payroll')
    writeFile(wbout, name)
    setDataToExport([])

  }

  const CustomPagination = () => {
    // const count = Math.ceil(employeeTotal)
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
  const fetchPayrollAlluser = async () => {
    // const data = await Api.get(`/hris/payroll/by-user?user_id=${uid}&periode=${picker}`)

  }

  const handlePeriode = () => {
    const newDate = moment(picker[0]).format("LL").split(' ')
    const realPeriode = `${newDate[0]} ${newDate[2]}`
    MySwal.fire({
      title: "Are you sure?",
      text: `Generate payroll periode ${realPeriode}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Generate Payroll!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setModal({
          title: "",
          mode: "",
          item: null
        })
        setToggleModal(!toggleModal)
        setIsLoading(true)
        const { status, data } = await Api.post("/hris/payroll/all", { periode: realPeriode })
        if (status) {
          fetchPayroll({ page: currentPage, perPage: rowsPerPage, search: '', periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status })

          setIsLoading(false)
          return MySwal.fire({
            icon: "success",
            title: "Success!",
            text: `Payroll periode ${realPeriode} has generated!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });


        } else {
          setIsLoading(false)
          return toast.error(`Error : ${data}`, {
            position: "top-center",
          });
        }
      }
    });
    console.log(realPeriode)
    // setToggleModal(!toggleModal)
    // fetchAllAttendance(picker)
  }

  // ** Function to handle filter
  const handleFilter = () => {
    fetchPayroll({
      page: 0,
      perPage: rowsPerPage,
      search: searchValue, periodeStart: searchPicker.periodeStart, periodeEnd: searchPicker.periodeEnd, approved: status
    })
    setCurrentPage(0)
  }


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFilter();
    }
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
              to="/payroll-form"
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
          <ExportComponent handlePrint={handlePrint} setExportType={setExportType} handleExport={handleExport} />
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
                  columns={serverSideColumns(onDelete, onApprove, exportType)}
                  sortIcon={<ChevronDown size={10} />}
                  paginationComponent={CustomPagination}
                  data={dataToRender()}
                />
              </div>
              {/* <Table striped>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Employee</th>
                    <th>Periode</th>
                    <th className="text-right">Amount (IDR)</th>
                    <th>Status</th>
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((x, index) => (
                    <tr key={x.id} className="text-xs">
                      <td>{index + 1}</td>
                      <td>{x.user.name}</td>
                      <td>
                        {x.periode ? dayjs(x.periode).format("MMMM-YYYY") : "-"}
                      </td>
                      <td className="text-right">{numberFormat(x.total)}</td>
                      <td>
                        <Badge
                          pill
                          color={x.approved_at ? "light-success" : "light-info"}
                          className="me-1"
                        >
                          {x.approved_at ? "Approved" : "Waiting"}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex">
                          <div className="pointer">
                            {!x.approved_at ? (
                              <>
                                <Trash
                                  className="me-50"
                                  size={15}
                                  title="Delete"
                                  onClick={() => onDelete(x.id)}
                                  id={`payrol-delete-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payrol-delete-${x.id}`}
                                >
                                  Delete
                                </UncontrolledTooltip>
                              </>
                            ) : (
                              <></>
                            )}
                            <span className="align-middle"></span>
                            <Link
                              to={`/payroll/${x.id}`}
                            // title="Detail"
                            >
                              <Eye
                                className="me-50"
                                size={15}
                                id={`paycheck-${x.id}`}
                              />
                            </Link>
                            <UncontrolledTooltip
                              placement="top"
                              target={`paycheck-${x.id}`}
                            >
                              Detail
                            </UncontrolledTooltip>
                            <span className="align-middle"></span>
                            {!x.approved_at ? (
                              <Link to={`/payroll/${x.id}/edit`}>
                                <Edit
                                  className="me-50"
                                  size={15}
                                  id={`payroll-edit-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payroll-edit-${x.id}`}
                                >
                                  Edit
                                </UncontrolledTooltip>
                              </Link>
                            ) : (
                              <></>
                            )}
                            {!x.approved_at ? (
                              <>
                                <CheckCircle
                                  className="me-50"
                                  title="Approve"
                                  size={15}
                                  onClick={() => onApprove(x.id)}
                                  id={`payrol-approve-${x.id}`}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`payrol-approve-${x.id}`}
                                >
                                  Approve
                                </UncontrolledTooltip>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}
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
              {/* <DateRange
                picker={picker}
                setPicker={setPicker}
              /> */}
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
