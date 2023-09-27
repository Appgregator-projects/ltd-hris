import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useEffect } from 'react'
import { Controller, Form, useForm } from 'react-hook-form'
import Select from 'react-select'
import { Button, Col, FormFeedback, Input, Label, Row } from 'reactstrap'
import * as yup from 'yup'

const AnnouncementForm = ({close, item}) => {

  const ItemSchema = yup.object().shape({
		name: yup.string().required(),
		address: yup.string().required(),
  	})

  const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })
	console.log(errors, "error")

  useEffect(() => {
		if(item){
			setValue('name', item.name)
			setValue('address', item.address)
			setValue('phone_number', item.phone_number)
			setValue('company_npwp', item.company_npwp)
		}
	}, [item])
	
	const onSubmitForm = (params) => {
    return console.log(params, "params")
			onSubmit(params)
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
                  {...field}
                  placeholder="Select Employee"
                  // options={option}
                  invalid={errors.name && true}/>
							}
						/>
							{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='title'>Title</Label>
						<Controller
								name='title'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='text' {...field} name='title' invalid={errors.title && true}/>
							}
						/>
							{errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='penalty_type'>Penalty type</Label>
						<Controller
								name='penalty_type'
								defaultValue=''
								control={control}
								render={({ field }) => 
                  <Input type='select' {...field} name='penalty_type' invalid={errors.penalty_type && true}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </Input>
							}
						/>
							{errors.penalty_type && <FormFeedback>{errors.penalty_type.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='message'>Message</Label>
						<Controller
								name='message'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='textarea' {...field} name='message' invalid={errors.message && true}/>
							}
						/>
							{errors.message && <FormFeedback>{errors.message.message}</FormFeedback>}
					</Col>
          <Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='file'>Attachment</Label>
						<Controller
								name='file'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='file' {...field} name='file' invalid={errors.file && true}/>
							}
						/>
							{errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
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

export default AnnouncementForm