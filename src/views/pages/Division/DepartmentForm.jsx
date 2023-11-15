import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Dropdown } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";
import PropTypes from 'prop-types';
// import { Dropdown } from "react-nested-dropdown";

export default function DepartmentForm({
  close,
  onSubmit,
  item,
  department,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [nestedDropdownOpen, setNestedDropdownOpen] = useState(false);

  const toggleMainDropdown = () => setMainDropdownOpen(!mainDropdownOpen);
  const toggleNestedDropdown = () => setNestedDropdownOpen(!nestedDropdownOpen);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

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
    arg.parent = arg.parent
    onSubmit(arg);
  };

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
    }
  }, [item]);

  console.log(department, "x")

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
                  {department.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </Input>

                // <Dropdown isOpen={mainDropdownOpen} toggle={toggleMainDropdown}>
                //   <DropdownToggle caret>
                //     {field.value ? field.value : 'Select parent'}
                //   </DropdownToggle>
                //   <DropdownMenu>
                //     <DropdownItem header>Select Parents</DropdownItem>
                //     {department.map((x) => (
                //       <DropdownItem key={x.id} value={x.id} onClick={() => { field.onChange(x.name); console.log(field.onChange(x.name)) }}>
                //         {/* {x.name} */}
                //         {x.details && x.details.length > 0 && (
                //           <Dropdown isOpen={nestedDropdownOpen} toggle={toggleNestedDropdown}>
                //             <DropdownToggle caret>
                //               Nested Dropdown
                //             </DropdownToggle>
                //             <DropdownMenu>
                //               {x.details.map((y) => (
                //                 <DropdownItem key={y.id} onClick={() => console.log(y.id, YYYY)}>
                //                   {y.name}
                //                 </DropdownItem>
                //               ))}
                //             </DropdownMenu>
                //           </Dropdown>
                //         )}
                //       </DropdownItem>
                //     ))}
                //   </DropdownMenu>
                // </Dropdown>
              )}
            />
            {errors.parent && <FormFeedback>{errors.parent.message}</FormFeedback>}
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
