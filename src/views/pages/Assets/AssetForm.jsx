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
		// name: yup.string().required(),
		// title: yup.string().required(),
		// message: yup.string().required(),
		// file: yup.string().required(),
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
                  className='react-select'
                  classNamePrefix="select"
                  id='label'
                  placeholder="Select Employee"
                  {...field}
                  closeMenuOnSelect={true}
                  options={user}
                  invalid={errors.name && true}
                  // onChange={(arg) => {setSelectUser(arg); console.log(arg, "arg name")}}
                  />
							}
						/>
							{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='asset'>Message</Label>
						<Controller
								name='asset'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Select 
                className='react-select'
                  classNamePrefix="select"
                  id='label'
                  {...field}
                  placeholder="Select Asset"
                  closeMenuOnSelect={true}
                  options={asset}
                  invalid={errors.asset && true}
                  // onChange={(arg) => {setSelectAsset(arg); console.log(arg, "arg asset")}}
                />
							}
						/>
							{errors.asset && <FormFeedback>{errors.asset.message}</FormFeedback>}
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