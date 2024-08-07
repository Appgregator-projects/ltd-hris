// ** User List Component

// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from "react-feather";
import DataTableServerSide from "./Table";
import { Fragment, useEffect, useState } from "react";
import FormEmployee from "./FormEmployee";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/firebase";
import { handlePreloader } from "../../../redux/layout";
import toast from "react-hot-toast";
import Api from "../../../sevices/Api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { MdOutlineImportExport } from "react-icons/md";
const MySwal = withReactContent(Swal);

// console.log(auth, 'ini auth siapa ya')

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [toggleModal, setToggleModal] = useState(false);
  const [itemActive, setItemActive] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [department, setDepartment] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [office, setOffice] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [modal, setModal] = useState({
    title: "",
    mode: "",
    item: null
  })

  const company_id = Cookies.get("company_id")

  const fetchCompany = async () => {
    try {
      const { status, data } = await Api.get("/hris/company");
      if (status) {
        setCompanies([...data]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchDivision = async () => {
    // return console.log(params, "params")
    try {
      const { status, data } = await Api.get(`/hris/division?search=`);
      if (status) {
        setDivisions([...data]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchDivision();
  }, []);

  const fetchRole = async () => {
    try {
      const data = await Api.get(
        "/auth/role-and-permissions/roles-list-selectbox"
      );
      setRoles([...data]);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  console.log(modal, 'modal')

  const fetchOffice = async () => {
    try {
      const { status, data } = await Api.get("/hris/office");
      if (status) {
        setOffice([...data]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchOffice();
  }, []);

  function buildTree(data, parentId = null) {
    const tree = [];

    for (const item of data) {
      if (item.parent == parentId) {
        const children = buildTree(data, item.id);

        if (children.length) {
          item.children = children;
        }

        tree.push({ ...item, label: item.label, value: item.id })
      }
    }

    return tree;
  }


  const fetchDepartment = async () => {
    try {
      const { status, data } = await Api.get("/hris/departement");
      if (status) {
        // setDepartment([...data]);
        const tree = buildTree(data)

        setDepartment(tree)
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const submitForm = async (params, companyId) => {
    console.log(params, 'ooo`')
    console.log(companyId, 'ni companyId')
    try {
      if (itemActive) return postEdit(params);
      dispatch(handlePreloader(true));
      const { user } = await createUserWithEmailAndPassword(
        auth,
        params.email,
        params.password
      );
      const { uid } = user;
      params.uid = uid;
      params.user_id = uid

      console.log(params, 'params masuk')
      const { status, accurate, dataAccurate, data } = await Api.post(`/hris/employee`, params);
      console.log(status, 'aaa')
      dispatch(handlePreloader(false));
      if (!status && !accurate) {
        return toast.error(`Error : ${dataAccurate}`, {
          position: "top-center",
        });
      } else if (!status) {
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      }
      else {
        toast.success("Successfully added employee!", {
          position: "top-center",
        });
      }


    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        params.uid = "exist";
        const { status, data } = await Api.post(`/hris/employee`, params);
        dispatch(handlePreloader(false));
        console.log(status, 'stat error')
        if (!status)
          return toast.error(`Error : ${data}`, {
            position: "top-center",
          });
        toast.success("Successfully added employee!", {
          position: "top-center",
        });
      } else {
        dispatch(handlePreloader(false));
        toast.error(`Error : ${error.message}`, {
          position: "top-center",
        });
      }
    }
  };

  const postEdit = async (params) => {
    try {
      params.id = itemActive.id;
      dispatch(handlePreloader(true));
      const { status, data } = await Api.put(`/hris/employee/${params.id}`, params);
      dispatch(handlePreloader(false));
      if (!status) {
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      } else {
        setIsRefresh(true);
        toast.success("Successfully updated employee!", {
          position: "top-center",
        });
      }
    } catch (error) {
      dispatch(handlePreloader(false));
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const onAdd = () => {
    setModal({
      title: "Add Employee",
      mode: "add",
      item: null
    })
    setToggleModal(true)
  }

  const onEdit = (params) => {
    console.log(params, "on edit")
    setModal({
      title: "Edit Employee",
      mode: "edit",
      item: { ...params }
    })
    setItemActive({ ...params });
    setToggleModal(true);
  };

  const onDelete = (params) => {
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
      if (result.value) {
        try {
          const status = await Api.delete(`/hris/employee/31`);
          // return console.log(status, "ini params")
          if (!status)
            return toast.error(`Error : ${data}`, {
              position: "top-center",
            });
          setIsRefresh(true);
          toast.success("Successfully updated employee!", {
            position: "top-center",
          });
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="app-user-list">
        <Row>
          <Col lg="12" sm="6" className="mb-1">
            <Fragment>
              <Button.Ripple
                size="sm"
                color="warning"
                onClick={onAdd}
              >
                <UserPlus size={14} />
                <span className="align-middle ms-25">Add Employee</span>
              </Button.Ripple>
              <Button.Ripple
                size="sm"
                color="primary"
                onClick={()=>navigate("/import-employee")}
                className="m-1"
              >
                <MdOutlineImportExport size={14} />
                <span className="align-middle ms-25">Import Employee</span>
              </Button.Ripple>
            </Fragment>
          </Col>
        </Row>
        <Row>
          <Col lg="6" sm="6">
            <StatsHorizontal
              color="primary"
              statTitle="Total Employee"
              icon={<User size={20} />}
              renderStats={<h3 className="fw-bolder mb-75">21,459</h3>}
            />
          </Col>
          <Col lg="6" sm="6">
            <StatsHorizontal
              color="danger"
              statTitle="New employee on this month"
              icon={<UserPlus size={20} />}
              renderStats={<h3 className="fw-bolder mb-75">4,567</h3>}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <DataTableServerSide
              onEdit={onEdit}
              onDelete={onDelete}
              isRefresh={isRefresh}
            />
          </Col>
        </Row>
      </div>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}
        backdrop={'static'}
      >
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>
          Employee Form
        </ModalHeader>
        <ModalBody>
          {modal.mode === "add" ?
            <FormEmployee
              close={() => {
                setToggleModal(!toggleModal), setModal({
                  title: "",
                  mode: "",
                  item: null
                })
              }}
              onSubmit={submitForm}
              company={companies}
              department={department}
              division={divisions}
              role={roles}
              office={office}
              companyId={company_id}

            /> : <></>}
          {modal.mode === "edit" ?
            <FormEmployee
              close={() => {
                setToggleModal(!toggleModal), setModal({
                  title: "",
                  mode: "",
                  item: null
                })
              }}
              onSubmit={postEdit}
              item={modal.item}
              company={companies}
              department={department}
              division={divisions}
              role={roles}
              office={office}
              companyId={company_id}
            /> : <></>
          }
        </ModalBody>
      </Modal>
    </>
  );
};

export default UsersList;
