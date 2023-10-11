import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap"
import Api from "../../../sevices/Api"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Edit, Eye, Plus, Trash } from "react-feather"
import { dateTimeFormat, numberFormat } from "../../../Helper"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import AssetForm from "./AssetForm"
import toast from "react-hot-toast"
import AssetDetail from "./AssetDetail"
import { handlePreloader } from "../../../redux/layout"
import { useDispatch } from "react-redux"
const MySwal = withReactContent(Swal);

export default function AssetIndex() {
  const dispatch = useDispatch()
  const [assets, setAssets] = useState(null)
  const [userAsset, setUserAssets] = useState(null)
  const [listAsset, setList] = useState([])
  const [employee, setEmployee] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const [modal, setModal] = useState({
    title:"",
    mode: "",
    item: null
  })

  const fetchEmployee = async () => {
    try {
      const data = await Api.get(`/hris/employee?no_paginate=true`)
      if (data) {
        const userData = data.map((x) => {
          return {
            value: x.id,
            label: x.email
          }
        })
        setEmployee([...userData])
      }
    } catch (error) {
      throw error
    }
  }
  
  useEffect(() => {
    fetchEmployee()
  },[])

  const fetchList = async () => {
    try {
      const data = await Api.get(`/api/v1/accurate/master-data/fixed-asset/11?sp.page=0&sp.pageSize=5`)
      if (data.data.s === true){
        const listAsset = data.data.d.map((x) => {
          return {
            value: x.id,
            label: x.description,
            asset_code : x.number,
            asset_cost : x.assetCost
          }
        })
        setList(listAsset)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() =>{
    fetchList()
  },[])

  const fetchAsset = async (params) =>{
    try {
      const {status,data} = await Api.get(`/hris/assets-search?search=${params.search}`)
      if(status){
        setAssets([...data])
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchAsset({search: ""})
  }, [])

  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    fetchAsset({
      search: e.target.value
    })
  }

  const fetchDivision = async (params) =>{
    try {
      const {status,data} = await Api.get(`/hris/division?search=${params.search}`)
      if(status){
        const dataAsset = assets?.map(x => {
          x.division = null
          const check = data?.find(y => y.id === x.division_id)
          if(check){
            x.division = check? check.name : "-"
          }
          return x
        })
        return setUserAssets([...dataAsset])
      }
      setUserAssets([...assets.map(x => {
        x.division = null
        return x
      })])
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchDivision({search: ""})
  }, [assets])

  const onAdd = () => {
    setModal({
      title : "Add Asset",
      mode : "add",
      item : null
    })
    setToggleModal(true)
  }

  const onDetail = (item) => {
    setModal({
      title : "Detail Asset",
      mode : "detail",
      item : item
    })
    setToggleModal(true)
  }

  const onSubmit = async (params) => {
    const itemPost = {
      uid : params.name.value,
      accurate_id : params.asset.value,
      asset_name : params.asset.label,
      asset_code : params.asset.asset_code,
      asset_cost : params.asset.asset_cost
    }
    try {
			dispatch(handlePreloader(true))
      const {status,data} = await Api.post(`/hris/assets/assign`, itemPost);
      console.log(status,data,"post asset")
			dispatch(handlePreloader(true))
      if (!status)
      return toast.error(`Error : ${data}`, {
        position: "top-center",
      });
      fetchAsset();
      fetchDivision({search: " "})
      toast.success("Asset has updated", {
        position: "top-center",
      });
      setToggleModal(false);
    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const postDelete = (id) => {
    return new Promise((resolve, reject) => {
      Api.delete(`/hris/assets/assign/${id}`)
        .then((res) => resolve(res))
        .catch((err) => reject(err.message));
    });
  };

  const handleDelete = async (x, i) => {
    MySwal.fire({
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
      if (result.value) {
        const oldCom = assets;
        oldCom.splice(i, 1);
        setAssets([...oldCom]);
        const data = await postDelete(x)
        if (data) {
          return MySwal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Asset user has deleted.",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      }
    });
  }

  return (
    <>
      <Row className="d-flex justify-content-between">
        <Col lg="2" sm="12" className="mb-1">
          <Fragment>
            <Button.Ripple size="sm" color="warning" onClick={onAdd}>
              <Plus size={14} />
              <span className="align-middle ms-25">Add Asset</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
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
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr className="text-xs">
                  <th style={{fontSize : 'sm'}}>Employee</th>
                  <th style={{fontSize : 'sm'}}>Division</th>
                  <th style={{fontSize : 'sm'}}>Accurate ID</th>
                  <th style={{fontSize : 'sm'}}>Asset</th>
                  <th style={{fontSize : 'sm'}}>Kode Asset</th>
                  <th style={{fontSize : 'sm'}}>Asset Cost</th>
                  <th style={{fontSize : 'sm'}}>created time</th>
                  <th style={{fontSize : 'sm'}}>Actions</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor:'transparent'}}>
                {assets?.map((x,i) => (
                    <tr key={i}>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x?.name}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x?.division}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.accurate_id}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.asset_name}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{x.asset_code}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>Rp{numberFormat(x.asset_cost)}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>{dateTimeFormat(x.createdAt)}</td>
                      <td style={{fontSize : '9pt', backgroundColor:'white'}}>
                        <div className="d-flex">
                          <div className="pointer">
                            <Trash
                              className="me-20"
                              size={15}
                              onClick={() => handleDelete(x.id, i)}
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
      <Modal
        isOpen={toggleModal}
        toggle={() => {setToggleModal(!toggleModal); console.log("asukgas")}}
        className={`modal-dialog-centered modal-lg`}>
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          {modal.title}
        </ModalHeader>
        <ModalBody>
        {modal.mode === "add" ?
        <AssetForm asset={listAsset} onSubmit={onSubmit} user= {employee} close={() => setToggleModal(false)}/> : <></>}
        </ModalBody>
      </Modal>
    </>
  )
}

  /* <td style={{fontSize : '9pt', backgroundColor:'white', cursor:'pointer'}} className="user_name text-truncate text-body"><span className="fw-light text-capitalize">{x.users.name}</span></td> */

