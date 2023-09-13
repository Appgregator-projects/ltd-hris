// ** React Imports
import { Fragment, useState, useEffect, memo } from "react"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col
} from "reactstrap"
import Api from "../../../sevices/Api"
import Avatar from "@components/avatar"
import { Link } from "react-router-dom"
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import { dateTimeFormat } from "../../../Helper/index"
import { ChevronDown, Trash, Edit } from "react-feather"

const renderClient = (row) => {
  if (row.avatar) {
    return <Avatar className="me-1" img={row.avatar} width="32" height="32" />
  } else {
    return (
      <Avatar
        initials
        className="me-1 text-uppercase"
        color={row.avatarColor || "light-primary"}
        content={row.name || "John Doe"}
      />
    )
  }
}

export const serverSideColumns = (onDelete, onEdit) => {
  return [
    {
      sortable: true,
      name: "Full Name",
      minWidth: "300px",
      selector: (row) => row.name,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <Link
              to={`/employee/${row.id}`}
              className="user_name text-truncate text-body"
              onClick={() => console.log}
            >
              <span className="fw-bolder text-capitalize">{row.name}</span>
            </Link>
            <small className="text-truncate text-muted mb-0">{row.email}</small>
          </div>
        </div>
      )
    },
    {
      sortable: true,
      name: "Title",
      minWidth: "225px",
      selector: row => (row ? row.title : "-")
    },
    {
      sortable: true,
      name: "Division",
      minWidth: "250px",
      selector: row => (row.division ? row.division.name : "-")
    },
    {
      sortable: true,
      name: "Register At",
      minWidth: "250px",
      selector: row => dateTimeFormat(row.createdAt)
    },
    {
      sortable: false,
      name: "Action",
      minWidth: "100px",
      selector: (row) => (
        <div className="d-flex">
          <div className="pointer">
            <Trash className="me-50" size={15} onClick={() => onDelete(row)} />{" "}
            <span className="align-middle"></span>
            <Edit
              className="me-50"
              size={15}
              onClick={() => onEdit(row)}
            />{" "}
            <span className="align-middle"></span>
          </div>
        </div>
      )
    }
  ]
}

const DataTableServerSide = ({ onDelete, onEdit, isRefresh }) => {
  // ** Store Vars
  const [employees, setEmployees] = useState([])
	const [usersDivision, setUserDivision] = useState([])
  const [employeeTotal, setEmployeeTotal] = useState(0)

  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [searchValue, setSearchValue] = useState("")

  const fetchEmployee = async (params) => {
    try {
      const data = await Api.get(`/hris/employee?page=${params.page}&limit=${params.perPage}&search=${params.search}`)
      setEmployees([...data.rows])
      setEmployeeTotal(data.pagination.totalItems)
    } catch (error) {
      throw error.message
    }
  }

  useEffect(() => {
    if (isRefresh) {
    fetchEmployee({page:currentPage, perPage:rowsPerPage, search:''})
    }
  }, [isRefresh])

    // ** Get data on mount
    useEffect(() => {
      fetchEmployee({page:currentPage, perPage:rowsPerPage, search:''})
    }, [])

  // ** Function to handle filter
  const handleFilter = (e) => {
    console.log(e.target.value, "search users")
    setSearchValue(e.target.value)
    fetchEmployee({
      page: currentPage,
      perPage: rowsPerPage,
      search: e.target.value
    })
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchEmployee({
      page: page.selected + 1,
      perPage: rowsPerPage,
      search: searchValue
    })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    fetchEmployee({
      page: currentPage,
      perPage: parseInt(e.target.value),
      search: searchValue
    })
    setRowsPerPage(parseInt(e.target.value))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(employeeTotal / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={Math.ceil(count) || 1}
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

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchValue
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (employees.length > 0) {
      return employees
    } else if (employees.length === 0 && isFiltered) {
      return []
        } else {
          return employees.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Employee List</CardTitle>
        </CardHeader>
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
          >
            <Label className="me-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns(onDelete, onEdit)}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default memo(DataTableServerSide)
