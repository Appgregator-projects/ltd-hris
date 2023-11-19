import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Dropdown } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";
import PropTypes from 'prop-types';
import { getSingleDocumentFirebase } from "../../../sevices/FirebaseApi";
// import { Dropdown } from "react-nested-dropdown";

export default function DepartmentForm({
  close,
  onSubmit,
  item,
  department,
  nested
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
    arg.nested = arg.parent ? `${arg.parent}/children` : " "
    arg.parent = arg.parent ? arg.parent : null
    arg.layer = arg.parent === null ? 1 : (arg.layer + 1)
    return console.log(item, "jajajaj")
    onSubmit(arg);
    // return result
  };

  const onParentId = async(arg) => {
    try {
      const getData = await getSingleDocumentFirebase(
        "department"
      )
    } catch (error) {
      throw error
    }
    // arg.parent = arg.parent
    // const searchParentId = department.find((x) => x.id === arg.parent)
    // console.log(arg.parent,searchParentId, "searchParentId")
  }

  function findData(array, targetName) {
    const findRecursive = (data, target) => {
      console.log(data, "sampe sini")
      if (!data) return null;
      console.log("kesini berapa")
      if (data.name === target) {
        return data;
      } else if (data.parent) {
        return findRecursive(array.find(item => item.id === data.parent), target);
      } else {
        return null;
      }
    };

    const searchData = array.find(item => item.name === targetName);

    if (searchData) {
      const parentData = findRecursive(array.find(item => item.id === searchData.parent), null);
      return parentData && !parentData.parent ? searchData : null;
    } else {
      return null;
    }
  }

  const result = findData(department, "subsubdivision 1");

  // console.log(result,"result");

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
    }
  }, [item]);

  // console.log(department, "x")

  const onCategorySelect = (selected) => {

  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="name">
              Name
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
            <Label className="form-label" for="Division Parent">
              Parent
            </Label>
            <Controller
              name="parent"
              defaultValue={null}
              control={control}
              render={({ field }) => (
                <Input
                  type="select"
                  {...field}
                  name="parent"
                  invalid={errors.parent && true}
                >
                  <option>Select parent</option>
                  {nested.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </Input>
              )}
            />
            {errors.parent && <FormFeedback>{errors.parent.message}</FormFeedback>}
          </Col>
          {/* <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="Layer">
              Layer
            </Label>
            <Controller
              name="layer"
              defaultValue={null}
              control={control}
              render={({ field }) => (
                <Input
                  type="select"
                  {...field}
                  name="layer"
                  invalid={errors.layer && true}
                >
                  <option>Select layer</option>
                  {department.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </Input>
              )}
            />
            {errors.layer && <FormFeedback>{errors.layer.message}</FormFeedback>}
          </Col> */}
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
