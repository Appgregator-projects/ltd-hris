import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Trash } from "react-feather";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Api from "../../../sevices/Api";
import dayjs from "dayjs";
import { handlePreloader } from "../../../redux/layout";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import _ from "lodash";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const MySwal = withReactContent(Swal);


// dayjs.extend(utc)

export default function DaysOffIndex() {
  const dispatch = useDispatch()
  const [initalDate, setInitialDate] = useState(dayjs().format("YYYY-MM"));
  const dic = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [calendar, setCalendar] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [nestedToggle, setNestedToggle] = useState(false);
  const [selectDate, setSelectDate] = useState([]);
  const [daysOff, setDaysOff] = useState([]);
  const [deals, setDeals] = useState([]);
  const [type, setType] = useState(null);

  const ItemSchema = yup.object().shape({
    // type: yup.string().required("Type days off is required"),
    descriptions: yup.string().required("Description is required")
  })

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors, "error");

  useEffect(() => {
    setValue("descriptions", selectDate && selectDate.descriptions)
    setValue("type", selectDate && selectDate.type)
  })

  const generateCalendarData = (month = "") => {
    const params = [];
    const totalDay = dayjs(month).daysInMonth();
    const now = dayjs(month).format("YYYY-MM");
    for (let index = 0; index < totalDay; index++) {
      const d = dayjs(`${now}-${index + 1}`).format("YYYY-MM-DD");
      const dayname = dayjs(d).format("ddd");
      params.push({
        date: dayjs(d).format("DD"),
        periode: d,
        dayname,
      });
    }
    return params;
  };

  const generateCalendarView = async (initDate) => {
    const previousMonth = dayjs(initDate).subtract(1, "month");
    const currentParams = generateCalendarData(initDate);
    const previousParams = generateCalendarData(previousMonth).reverse();

    const firstDayFromCurentMOnth = currentParams[0];
    const findIndexDay = dic.findIndex(
      (x) => x === firstDayFromCurentMOnth.dayname
    );
    let getDateFromPrevious = previousParams.slice(0, findIndexDay).reverse();
    getDateFromPrevious = getDateFromPrevious.map((x) => {
      x.is_previous = "is_previous";
      return x;
    });
    const calendar = [...getDateFromPrevious, ...currentParams];
    const subDate = initDate.split('-')
    const [year, month] = subDate
    const dayOff = await fetchDaysOff(year, month)
    // set logic free day
    setDaysOff([...dayOff])

    const resultCalendar = calendar.map(x => {
      x.isOff = false
      const check = dayOff.find(y => y.date == x.periode)
      if (check) {
        x.isOff = true
        x.descriptions = check.descriptions
        x.id = check.id
        x.type = check.type
      }
      return x
    })
    setCalendar([...resultCalendar]);
  };

  useEffect(() => {
    generateCalendarView(initalDate);
  }, []);

  const onChangeDate = (mode) => {
    let periode = dayjs(initalDate);
    if (mode === "-") {
      periode = periode.subtract(1, "month");
    } else {
      periode = periode.add(1, "month");
    }
    periode = dayjs(periode).format("YYYY-MM");

    setInitialDate(dayjs(periode).format("YYYY-MM"));
    generateCalendarView(periode);
  };

  const fetchDaysOff = async (year, month) => {
    try {
      const { status, data } = await Api.get(`/hris/day-off?month=${month}&year=${year}`);
      if (status) {
        return data.map(x => {
          x.date = dayjs(x.date).format('YYYY-MM-DD')
          return x
        })
      }
    } catch (error) {
      return []
    }
  };

  const fetchDeals = async () => {
    try {
      const data = await Api.get(`/api/v1/crm/project-number/all`)
      if (data) {
        const listDeals = data.map((x) => {
          return {
            value: x.id,
            label: x.number
          }
        })
        setDeals(listDeals)
        return listDeals
      }
    } catch (error) {
      throw error
      ;
    }
  }

  useEffect(() => {
    fetchDeals();
  }, [type]);

  const handleSelectType = (e) => {
    console.log(e, "type")
    setType(e)
  }

  const setDetail = (arg) => {
    setSelectDate(arg);
    setNestedToggle(true);
  };

  const setNote = (arg) => {
    return submitPost(arg, selectDate);
  };

  const submitPost = async (arg, selectDate) => {
    try {
      if (selectDate.isOff === true) return submitEdit(arg, selectDate)
      const itemPost = {
        date: selectDate.periode,
        descriptions: arg.descriptions,
        type: arg.type
      };
      return console.log(arg, selectDate, itemPost, "hothothot")
      const { status, data } = await Api.post(`hris/day-off`, itemPost);
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      setNestedToggle(!nestedToggle)
      setToggleModal(!toggleModal)
      generateCalendarView(initalDate)
      toast.success("Days Off has loaded", {
        position: "top-center",
      });
    } catch (error) {
      setToggleModal(false);
      toast.error(`Error : ${error.message}`, { position: "top-center" });
      throw error;
    }
  };

  const submitEdit = async (arg, params) => {
    try {
      dispatch(handlePreloader(true));
      const { status, data } = await Api.put(`/hris/day-off/${params.id}`, arg);
      dispatch(handlePreloader(false));
      if (!status)
        return toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      fetchDaysOff()
      toast.success("Successfully updated employee!", {
        position: "top-center",
      });
    } catch (error) {
      dispatch(handlePreloader(false));
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const onDelete = async (x) => {
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
          const status = await Api.delete(`/hris/day-off/${x.id}`);
          if (!status)
            return toast.error(`Error : ${data}`, {
              position: "top-center",
            });
          setToggleModal(!toggleModal)
          generateCalendarView(initalDate)
          toast.success("Successfully updated calender!", {
            position: "top-center",
          });
        } catch (error) {
          toast.error(`Error : ${error.message}`, {
            position: "top-center",
          });
        }
      }
    });
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col lg="12" sm="12">
                  <div className="d-flex align-items-center">
                    <span
                      className="pointer mr-1"
                      onClick={() => onChangeDate("-")}
                    >
                      <ChevronLeft size={30} />
                    </span>
                    <span className="pointer" onClick={() => onChangeDate("+")}>
                      <ChevronRight size={30} />
                    </span>
                    <span className="text-primary fs-4">
                      {dayjs(initalDate).format("YYYY MMMM")}
                    </span>
                  </div>
                  <ul className="d-flex flex-row list-none calendar flex-wrap">
                    {dic.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>

                  <ul className="d-flex flex-row list-none calendar-date flex-wrap">
                    {calendar.map((x, index) => (
                      <li
                        key={index}
                        className={x.isOff && x.type === "non_management" ? "bg-warning text-light" : x.isOff && x.type === "management" ? "bg-danger text-light" : "" || x.is_previous ? x.is_previous : ''}
                        color=""
                        onClick={() => {
                          setToggleModal(true);
                          setDetail(x);
                        }}
                      >
                        <span>{x.date}</span>
                        <span>{x.descriptions}</span>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
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
          Day Detail
        </ModalHeader>
        <ModalBody>
          {selectDate ? (
            <ul className="list-none padding-none">
              <li className="d-flex justify-content-between pb-1">
                <span className="fw-bold">Day</span>
                <span className="capitalize">
                  {selectDate ? selectDate.dayname : "lalal"}
                </span>
              </li>
              <li className="d-flex justify-content-between pb-1">
                <span className="fw-bold">Date</span>
                <span className="capitalize">
                  {selectDate ? selectDate.periode : "-"}
                </span>
              </li>
              {selectDate.isOff ?
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Type</span>
                  <span className="capitalize">
                    {selectDate.type === "non_management" ? "Non Management" : "Management"}
                  </span>
                </li> : <></>
              }
              {selectDate.isOff ?
                <li className="d-flex justify-content-between pb-1">
                  <span className="fw-bold">Descriptions</span>
                  <span className="capitalize">
                    {selectDate ? selectDate.descriptions : "-"}
                  </span>
                </li> : <></>
              }
            </ul>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter>
          {selectDate?.isOff === true ?
            <Button.Ripple
              size="md"
              color='warning'
              onClick={() => onDelete(selectDate)}>
              <Trash size={15} />
            </Button.Ripple> : <></>
          }
          <Button
            type="button"
            size="md"
            color="danger"
            onClick={() => setToggleModal(!toggleModal)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            color="primary"
            onClick={() => setNestedToggle(!nestedToggle)}
          >
            <Modal
              isOpen={!nestedToggle}
              className={`modal-dialog-centered modal-lg`}
              backdrop={"static"}
            >
              <Form onSubmit={handleSubmit(setNote)}>
                <ModalHeader>Note</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" for="type">
                        Type
                      </Label>
                      <Controller
                        name="type"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="select"
                            {...field}
                            name="type"
                            invalid={errors.type && true}
                            value={type}
                            onChange={(e) => handleSelectType(e.target.value)}
                          >
                            <option value="">Select type</option>
                            <option value="management">Management</option>
                            <option value="non_management">Non Management</option>
                          </Input>
                        )}
                      />
                      {errors.type && (
                        <FormFeedback>{errors.type.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" for="deals">
                        Deals
                      </Label>
                      <Controller
                        name="deals"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="select"
                            {...field}
                            name="deals"
                            invalid={errors.type && true}
                            disabled={type? type === "management": ""}
                          >
                            <option value="">Select deals</option>
                            {deals.map((x) => (
                              <option key={x.value} value={x.value}>
                                {x.label}
                              </option>
                            ))}
                          </Input>
                        )}
                      />
                      {errors.deals && (
                        <FormFeedback>{errors.deals.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md='12' sm='12' className="mb-1">
                      <Label for="descriptions">Descriptions</Label>
                      <Controller
                        name="descriptions"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="descriptions"
                            {...field}
                            name="descriptionse"
                            type="textarea"
                            invalid={errors.descriptions && true}
                          />
                        )}
                      />
                      {errors.descriptions && (
                        <FormFeedback>{errors.descriptions.message}</FormFeedback>
                      )}
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => setNestedToggle(!nestedToggle)}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" size="md">
                    Send
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
            {selectDate.isOff === true ? "Edit" : "Days Off"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
