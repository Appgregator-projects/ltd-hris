<<<<<<< HEAD
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col, Label, FormFeedback, Input, Button, Form } from "reactstrap";
import { useEffect } from "react";
import Select from "react-select";
import FormUserAssign from "../Components/FormUserAssign";
import Api from "../../../sevices/Api";

export default function AssetsForm({
  close,
  onSubmit,
  item,
  users,
  divisions,
  selectDivison,
  type
}) {
  const ItemSchema = yup.object().shape({
    user_name: yup.string().required(),
    Assets: yup.string().required(),
    Description: yup.string().required(),
    type: yup.string().required(),
    model: yup.string().required(),
    price: yup.string().required(),
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

  const onSubmitForm = (arg) => {
    onSubmit(arg);
  };

  useEffect(() => {
    console.log(item, "item setvalue ")
    // return console.log(DivitionOption.filter((e) => e.value === item.parent_id)[0],"blabla")
    if (item) {
      setValue("name", item.name)
      setValue("parent", item == undefined? item.parent_id : DivitionOption.filter((e) => e.value === item.parent_id)[0]) 
      setValue("manager_id", item == undefined? item.manager_id : Option.filter((e) => e.value === item.manager_id)[0])
    }
  }, [item]);
=======
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Form, Col, Input, Label, Row, FormFeedback } from 'reactstrap'
import Select from 'react-select'
import { useState } from 'react'
import Api from '../../../sevices/Api'
import toast from 'react-hot-toast'
import { DownloadCloud } from 'react-feather'
import CardLoader from '../Components/CardLoader'

const AssetForm = ({user,asset, onSubmit, close}) => {
  const [selectUser, setSelectUser] = useState(null)
  const [selectAsset, setSelectAsset] = useState(null)

  const ItemSchema = yup.object().shape({
		name: yup.object().shape({
      value: yup.string().required("Name is required"),
      label: yup.string().required("Name is required"),
    }),
    asset: yup.object().shape({
      value: yup.string().required("Asset is required"),
      label: yup.string().required("Asset is required"),
    }),
  	})
  console.log(ItemSchema, "itschema")

  const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })
	console.log(errors, "error")

  const onSubmitForm = (params) => {
		return onSubmit(params)
	}
>>>>>>> e5ce312d0f7de79f3d10d5f464bca72ecc1b6c60

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
<<<<<<< HEAD
        <Row>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="name">
              User
            </Label>
            <Controller
              name="user_id"
              defaultValue={null}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  name="user_name"
                  invalid={errors.user_name && true}
                />
              )}
            />
            {errors.user_name && <FormFeedback>{errors.user_name.message}</FormFeedback>}
          </Col>

          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" for="name">
              User
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
            <Label className="form-label" for="name">
              User
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
            <Label className="form-label" for="name">
              User
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
            <Label className="form-label" for="name">
              User
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
            <Label className="form-label" for="name">
              User
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

AssetsForm.defaultProps = {
  item: null,
};
=======
				<Row>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='name'>Name</Label>
						<Controller
								name='name'
								defaultValue=''
								control={control}
								render={({ field }) => 
                  <Select 
                  name='name'
                  className='react-select'
                  classNamePrefix="select"
                  id='label'
                  placeholder="Select Employee"
                  {...field}
                  closeMenuOnSelect={true}
                  options={user}
                  invalid={errors.name && true}
                  // onChange={(arg) => {setSelectUser(arg.value); console.log(arg, "arg name")}}
                  />
							}
						/>
							{errors.name && <span style={{ color: "red" }}>Name is Required</span>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='asset'>Assets</Label>
						<Controller
								name='asset'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Select 
                name='asset'
                  className='react-select'
                  classNamePrefix="select"
                  id='asset'
                  {...field}
                  // value={field.value}
                  placeholder="Select Asset"
                  closeMenuOnSelect={true}
                  options={asset}
                  invalid={errors.asset && true}
                />
							}
						/>
							{errors.asset && <span style={{ color: "red" }}>Asset is required</span>}
					</Col>
					<Col>
						<Button type="button" size="md" color='danger' onClick={close}>Cancel</Button>
						<Button type="submit" size="md" color='primary' className="m-1">Submit</Button>
					</Col>
				</Row>
			</Form>
    </>
  )
}

export default AssetForm
>>>>>>> e5ce312d0f7de79f3d10d5f464bca72ecc1b6c60
