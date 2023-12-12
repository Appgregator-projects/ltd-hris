import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Dropdown, ButtonDropdown, InputGroup } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";
import PropTypes from 'prop-types';
import { getSingleDocumentFirebase } from "../../../sevices/FirebaseApi";
import { Cascader } from "antd";
// import { Dropdown } from "react-nested-dropdown";

export default function DepartmentForm({
  close,
  onSubmit,
  item,
  department,
  nested
}) {
  console.log(nested, item, 'nenested')

  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hanzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ]
            },
          ],
        },
      ],
    },
  ];

  const ItemSchema = yup.object().shape({
    label: yup.string().required(),
  });
  const [defaultVal, setDefault] = useState([])

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  const departementOptions = nested.map((x) => {
    return {
      value: x.id,
      label: x.label,
      children: x.children
    }
  })

  console.log(departementOptions, 'departementOptions')

  const onChange = (value) => {
    console.log(value, ',yelahhh');
  };

  const onSubmitForm = (arg) => {
    console.log(arg, 'niarg')
    arg.layer = arg.layer ? arg.layer : []
    arg.parent = arg.layer ? arg.layer[arg.layer.length - 1] : null
    // arg.nested = arg.parent ? `${arg.parent}/children` : " "
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
            <Label className="form-label" for="label">
              Name
            </Label>
            <Controller
              name="label"
              defaultValue={null}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  name="label"
                  invalid={errors.label && true}
                />
              )}
            />
            {errors.label && <FormFeedback>{errors.label.message}</FormFeedback>}
          </Col>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="Layer">
              Layer
            </Label>
            <Row>

              <Controller
                name="layer"
                control={control}
                render={({ field }) => (
                  <Cascader
                    options={departementOptions} onChange={onChange} changeOnSelect {...field} />
                )}
              />
              {errors.layer && <FormFeedback>{errors.layer.message}</FormFeedback>}
            </Row>
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
