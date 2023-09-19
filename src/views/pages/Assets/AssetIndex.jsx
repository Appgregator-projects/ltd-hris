import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row, Table } from "reactstrap"
import Api from "../../../sevices/Api"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Edit, Plus, Trash } from "react-feather"
import { numberFormat } from "../../../Helper"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
const MySwal = withReactContent(Swal);

export default function AssetIndex() {

  const [assets, setAssets] = useState(null)

  const fetchAssets = async () => {
    try {
      const data = await Api.get('/hris/assets')
      setAssets(data)
      console.log({data})
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchAssets()
  },[])

  // const handleDelete = async (x) => {
  //   MySwal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     customClass: {
  //       confirmButton: "btn btn-primary",
  //       cancelButton: "btn btn-outline-danger ms-1",
  //     },
  //     buttonsStyling: false,
  //   }).then(async (result) => {
  //     if (result.value) {
  //       const data = await Api.delete(`/hris/assets/${x.id}`)
  //       if (data) {
  //         return MySwal.fire({
  //           icon: "success",
  //           title: "Deleted!",
  //           text: "Division has deleted.",
  //           customClass: {
  //             confirmButton: "btn btn-success",
  //           },
  //         });
  //       }
  //       return toast.error(`Error : ${data}`, {
  //         position: "top-center",
  //       });
  //     }
  //   });
  //   fetchAssets()
  // }

  return (
    <>
      {/* <Row className="d-flex justify-content-between">
        <Col lg="2" sm="12" className="mb-1">
          <Fragment>
            <Button.Ripple size="sm" color="warning" >
              <Plus size={14} />
              <span className="align-middle ms-25">Add</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row> */}
      <Row style={{backgroundColor:'white', margin:'auto'}}>
        <Card Row style={{backgroundColor:'white'}}>
          <CardHeader >
            <CardTitle>Assets Management</CardTitle>
            <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="3"
          >
            <Label className="me-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
            //   value={searchValue}
            //   onChange={handleFilter}
            />
          </Col>
          </CardHeader>
          <CardBody>
            <Table responsive size="sm">
              <thead>
                <tr className="text-xs">
                  <th style={{fontSize : 'sm'}}>Name</th>
                  <th style={{fontSize : 'sm'}}>Assets</th>
                  <th style={{fontSize : 'sm'}}>Description</th>
                  <th></th>
                  <th></th>
                  <th style={{fontSize : 'sm'}}>Type</th>
                  <th style={{fontSize : 'sm'}}>Model</th>
                  <th style={{fontSize : 'sm'}}>Price</th>
                  <th style={{fontSize : 'sm'}}>Actions</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor:'transparent'}}>
                {assets?.map((x,i) => (
                    <tr key={i}>
                      <td style={{fontSize : '9pt', backgroundColor:'white', cursor:'pointer'}} className="user_name text-truncate text-body"><span className="fw-light text-capitalize">{x.user_id}</span></td>
                      <td style={{fontSize:'9pt', backgroundColor:'white'}}>{x.title}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}} colSpan={3}>{x.description}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.brand}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.model}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>Rp {numberFormat(x.price)}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>
                        <div className="d-flex">
                          <div className="pointer">
                            <Trash
                              className="me-50"
                              size={15}
                              // onClick={() => handleDelete(x)}
                            />{" "}
                            <span className="align-middle"></span>
                            <Edit
                              className="me-50"
                              size={15}
                              // onClick={() => handleEdit()}
                            />{" "}
                            <span className="align-middle"></span>
                          </div>
                        </div>
                      </td>
                    </tr>

                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Row>
    </>
  )
}
