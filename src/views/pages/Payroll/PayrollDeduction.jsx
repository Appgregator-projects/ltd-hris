import { useState, useEffect, Fragment } from 'react'
import { Edit, Edit2, Plus, Trash } from 'react-feather'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Modal, ModalBody, ModalHeader, Row, Table, UncontrolledTooltip } from 'reactstrap'
import HealthForm from '../employee/component/IncomeForm'
import BPJSConfig from './Component/BPJSConfig'
import Api from "../../../sevices/Api"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { toast } from 'react-hot-toast'
import { numberFormat } from '../../../Helper'
const MySwal = withReactContent(Swal)


export default function PayrollDeduction() {
  const [toggleModal, setToggleModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bpjsRule, setBpjsRule] = useState([])
  const [modal, setModal] = useState({
    title: "",
    mode: "",
    item: null
  })

  const fetchAssurance = async () => {
		try {
		  const data = await Api.get(`/hris/bpjs-rule`)
		  setBpjsRule([...data])
		} catch (error) {
		  throw error
		}
	  }
	
	useEffect(() => {
		fetchAssurance()
	}, [])

  const onBpjsConfig = () => {
    setModal({
      title: "BPJS Config",
      mode: "add",
      item: null
    })
    setToggleModal(true)
  }

  const postUpdate = async (params) => {
    const itemUpdate = {
      name : params.name,
      percent_company : params.percent_company,
      percent_employee : params.percent_employee,
      topper : params.topper
    }
    try {
      const status = await Api.put(`/hris/bpjs-rule/${modal.item.id}`, itemUpdate)
      console.log(status, "has updated")
      if (!status) return toast.error(`Error : ${status}`, {
          position: "top-center"
        })
      fetchAssurance()
      toast.success("BPJS config has updated", {
        position: "top-center"
      })
      setToggleModal(false)
    } catch (error) {
      setToggleModal(false)
      toast.error(`Error : ${error.message}`, {
        position: "top-center"
      })
    }
  }

  const onSubmit = async (params) => {
    try {
      if (modal.item) return postUpdate(params)
      const status = await Api.post(`/hris/bpjs-rule`, params)
      if (!status) return toast.error(`Error : ${data}`, {
          position: "top-center"
        })
      fetchAssurance()
      toast.success("BPJS config has updated", {
        position: "top-center"
      })
      setToggleModal(false)
    } catch (error) {
      toast.error(`Error : ${error.message}`, {
        position: "top-center"
      })
    }
  }
  

  const onEdit = (x, i) => {
    console.log(x, "x")
    setModal({
      title : "BPJS Config",
      mode : "edit",
      item : x 
    })
    setToggleModal(true)
  }

  const postDelete = (id) => {
    return new Promise((resolve, reject) => {
      Api.delete(`/hris/bpjs-rule/${id}`)
        .then((res) => resolve(res))
        .catch((err) => reject(err.message))
    })
  }

  const onDelete = (x, i) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1"
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.value) {
        const data = await postDelete(x.id)
        if (data) {
          const oldCom = bpjsRule
          oldCom.splice(i, 1)
          setBpjsRule([...oldCom])
          return MySwal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Division has deleted.",
            customClass: {
              confirmButton: "btn btn-success"
            }
          })
        }
        return toast.error(`Error : ${data}`, {
          position: "top-center"
        })
      }
    })

  }


  return (
    <>
      <Row className="d-flex justify-content-between">
        <Col lg="2" sm="12" className="mb-1">
          <Fragment>
            <Button.Ripple size="sm" color="warning" onClick={() => onBpjsConfig()}>
              <Plus size={14} />
              <span className="align-middle ms-15">Add Deduction</span>
            </Button.Ripple>
          </Fragment>
        </Col>
      </Row>
    		<Col>
					<Card>
						<CardHeader>
							<CardTitle>Deductions</CardTitle>
						</CardHeader>
						<CardBody>
              <Table responsive>
									<thead>
										<tr className='text-xs'>
											<th className='fs-6'>Name</th>
											<th className='fs-6'>Company</th>
											<th className='fs-6'>Employee</th>
											<th className='fs-6'>Topper</th>
											<th className='fs-6'>Action</th>
										</tr>
									</thead>
									<tbody>
										{
												bpjsRule?.map((x, i) => (
													<tr key={x.id}>
														<td>{x ? x.name : '-'}</td>
														<td>{x?.percent_company} %</td>
														<td>{x?.percent_employee} %</td>
														<td>Rp {numberFormat(x?.topper)},-</td>
                            <td>
                            <div className="d-flex">
                              <div className="pointer">
                                <Trash
                                  className="me-50"
                                  size={15}
                                  onClick={() => onDelete(x, i)}
                                  id={`delete-tooltip-${x.id}`}
                                />
                                <span className='align-middle'></span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`delete-tooltip-${x.id}`}
                                >
                                  Delete
                                </UncontrolledTooltip>
                                <span className="align-middle"></span>
                                <Edit
                                  className="me-50"
                                  size={15}
                                  onClick={() => onEdit(x, i)}
                                  id={`edit-tooltip-${x.id}`}
                                />{" "}
                                <span className='align-middle'></span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`edit-tooltip-${x.id}`}
                                >
                                  Edit
                                </UncontrolledTooltip>
                                <span className="align-middle"></span>
                              </div>
                            </div>
                            </td>
													</tr>
                        ))
										}
									</tbody>
								</Table>

						</CardBody>
				</Card>
				</Col>

        <Modal
          isOpen={toggleModal}
          toggle={() => setToggleModal(!toggleModal)}
          className={`modal-dialog-centered modal-lg`}
        >
          <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
            {modal.title}
          </ModalHeader>
          <ModalBody>
            {modal.mode === "add" ? <BPJSConfig
              isLoading={isLoading}
              close={() => setToggleModal(!toggleModal)}
              onSubmit={onSubmit}
              /> : <></>}
            {modal.mode === "edit" ? <BPJSConfig
              isLoading={isLoading}
              close={() => setToggleModal(!toggleModal)}
              item={modal.item}
              onSubmit={onSubmit}
              /> : <></>}
          </ModalBody>
        </Modal>
    </>
  )
}
