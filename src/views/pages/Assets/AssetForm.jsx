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
import AsyncSelect from "react-select/async";

const AssetForm = ({user,asset, onSubmit, close, fetch, load}) => {

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

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
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
                <AsyncSelect
                  {...field}
                  isClearable
                  cacheOptions
                  loadOptions={load}
                  defaultOptions
                  // onChange={(e) => selectedCustomer(e)}
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