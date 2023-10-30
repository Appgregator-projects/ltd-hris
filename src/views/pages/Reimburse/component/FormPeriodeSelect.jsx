import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'

const FormPeriodeSelect = ({submit}) => {

  const ItemSchema = yup.object().shape({
    month: yup.string().required("Month is required"),
    year: yup.string().required("Year is required")
  })

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors, "error");

  const onSubmitForm = (arg) => {
    // console.log(arg, "arg")
    return submit(arg)
  }

  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitForm)}>
      <Row>
      <Col md='6' sm='12' className='mb-1'>
				<Label className='form-label' for='month'>Month</Label>
					<Controller
						name='month'
						defaultValue=''
						control={control}
						render={({ field }) => 
              <Input 
              type='number'
              name='month'
              placeholder="Ex : 9 "
              {...field}
              invalid={errors.month && true}
              // onChange={(arg) => {setSelectUser(arg.value); console.log(arg, "arg name")}}
              />
							}
						/>
          {errors.month && <FormFeedback>{errors.month.message}</FormFeedback>}

				</Col>
      <Col md='6' sm='12' className='mb-1'>
				<Label className='form-label' for='year'>Year</Label>
					<Controller
						name='year'
						defaultValue=''
						control={control}
						render={({ field }) => 
              <Input 
              type='number'
              name='year'
              placeholder="Ex : 2023"
              {...field}
              invalid={errors.year && true}
              // onChange={(arg) => {setSelectUser(arg.value); console.log(arg, "arg name")}}
              />
							}
						/>
          {errors.year && <FormFeedback>{errors.year.message}</FormFeedback>}
				</Col>
        <Col>
        <Button type='submit' size='md' color='primary' className='m-1'>Submit</Button>
        </Col>
      </Row>
    </Form>
    </>
  )
}

export default FormPeriodeSelect