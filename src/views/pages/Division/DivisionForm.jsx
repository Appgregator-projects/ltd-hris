import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";

export default function DivisionForm({
  close,
  onSubmit,
  item,
}) {

  const ItemSchema = yup.object().shape({
    name: yup.string().required(),
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  const onSubmitForm = (arg) => {
    onSubmit(arg);
  };

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
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

// DivisionForm.defaultProps = {
//   item: null,
// };
