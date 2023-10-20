import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form } from "reactstrap";
import { useEffect } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";

export default function DivisionForm({
  close,
  onSubmit,
  item,
  users,
  divisions,
  selectDivison,
  type
}) {
  const ItemSchema = yup.object().shape({
    name: yup.string().required(),
    // parent: yup.string().required(),
  });
  
  const Option = users?.map((e) => ({ value: e.id, label: e.email }));
  const DivitionOption = selectDivison?.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const handleModal = () => {
    const filterParent = DivitionOption.filter((e) => e.value === item.parent_id)[0]
    const filterManager =  Option.filter((e) => e.value === item.manager_id)[0]
    setValue("name", item.name);
    setValue("parent", filterParent);
    setValue("manager_id", filterManager);
  }
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  const onSubmitForm = (arg) => {
    // return console.log(arg, "kkk")
    onSubmit(arg);
  };

  useEffect(() => {
    // console.log(item, "item setvalue ")
    if (item) {
      setValue("name", item.name)
      setValue("parent", item == undefined? item.parent_id : DivitionOption.filter((e) => e.value === item.parent_id)[0]) 
      setValue("manager_id", item == undefined? item.manager_id : Option.filter((e) => e.value === item.manager_id)[0])
    }
  }, [item]);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="name">
              Division Name
            </Label>
            <Controller
              name="name"
              defaultValue={null}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  name="name"
                  invalid={errors.name && true}
                />
              )}
            />
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
          </Col>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="parent">
              Division Parent
            </Label>
            <Controller
              name="parent"
              defaultValue=''
              control={control}
              render={({ field }) => (
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  name="parent"
                  {...field}
                  placeholder={"Select Parent Division"}
                  options={DivitionOption}
                  invalid={errors.parent && true}
                  onChange={arg => {console.log(arg)}}

                />
              )}
            />
            {errors.parent && (
              <FormFeedback>{errors.parent.message}</FormFeedback>
            )}
          </Col>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="manager">
              Select Division Leader
            </Label>
            <Controller
              name="manager_id"
              defaultValue=''
              control={control}
              render={({ field }) => (
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  id="label"
                  {...field}
                  placeholder={"Select Manager"}
                  options={Option}
                  invalid={errors.manager_id && true}
                  onChange={arg => {console.log(arg)}}
                />
              )}
            />
            {errors.manager_id && (
              <FormFeedback>{errors.manager_id.message}</FormFeedback>
            )}
          </Col>
          <Col>
            <Button type="button" size="md" color="danger" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" size="md" color="primary" className="m-1">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

DivisionForm.defaultProps = {
  item: null,
};
