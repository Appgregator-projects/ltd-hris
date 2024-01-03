import React, { useEffect } from 'react'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Api from "../../../../sevices/Api";
import { useState } from 'react';


export default function IncomeForm({ isLoading, close, income, onSubmit }) {

  const [allowance, setAllowance] = useState()
  const [payrollType, setPayrollType] = useState()
  const ItemSchema = yup.object().shape({
    payroll_type: yup.string().oneOf(["nett", "gross", "gross_up"], "Please select a valid payroll type").required("payroll type is required"),
    type: yup.string().required("type is required"),
    amount: yup.string().required("amount is required"),

    // flag: yup.string().required("Flag is required")
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });

  console.log(errors)
  const selectOnType = (arg) => {
    setAllowance(arg)
  }

  const onSubmitIncome = (arg) => {
    arg.amount = parseFloat(arg.amount)
    // return console.log(arg, 'argg')
    onSubmit(arg)
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitIncome)}>
        {/* <div className='pb-2'> */}

        <Col md='12' sm='12' className='mb-2 d-flex'>
          <Label className='form-label me-3'>Payroll type</Label>
          <Controller
            name='payroll_type'
            defaultValue=''
            control={control}
            render={({ field }) => (
              <>
                <FormGroup check>
                  <Input  {...field}
                    invalid={errors.payroll_type && true} type='radio' name='payroll_type' value="nett" />
                  <Label check className='me-2'>Nett</Label>
                </FormGroup>
                <FormGroup check>
                  <Input  {...field}
                    invalid={errors.payroll_type && true} type='radio' name='payroll_type' value="gross" />
                  <Label check className='me-2'>Gross</Label>
                </FormGroup>
                <FormGroup check>
                  <Input  {...field}
                    invalid={errors.payroll_type && true} type='radio' name='payroll_type' value="gross_up" />
                  <Label check className='me-2'>Gross Up</Label>
                </FormGroup>
              </>
            )} />
          {errors.payroll_type && <FormFeedback>{errors.payroll_type.message}</FormFeedback>}
        </Col>
        <Col md='12' sm='12' className='mb-2'>
          <Label className='form-label'>Type</Label>
          <Controller
            name='type'
            defaultValue=''
            control={control}
            render={({ field }) => (
              <Input
                id='type'
                type="select"
                {...field}
                invalid={errors.type && true}
                name='type'
                placeholder='Select income type'
                onChange={(e) => {
                  field.onChange(e);
                  selectOnType(e.target.value);
                }}
              >
                <option value=''>Select income type</option>
                <option value='Basic'>Basic salary</option>
                <option value='Allowance'>Allowance</option>
              </Input>
            )} />
          {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
        </Col>
        <Col md='12' sm='12' className='mb-1'>
          <Label className='form-label'>Label Allowance</Label>
          <Controller
            name='label_allowance'
            defaultValue=''
            control={control}
            render={({ field }) => (
              <Input
                type="text"

                {...field}
                // invalid={errors.label_allowance && true}
                defaultValue={0}
                placeholder='Ex: Annual Allowance'
                disabled={allowance !== "Allowance"}
              />
            )} />
          {/* {errors.label_allowance && <FormFeedback>{errors.label_allowance.message}</FormFeedback>} */}
        </Col>
        <Col md='12' sm='12' className='mb-1'>
          <Label className='form-label'>Amount (Rp)</Label>
          <Controller
            name='amount'
            defaultValue=''
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                defaultValue={0}
                invalid={errors.amount && true}
              />
            )} />
          {errors.amount && <FormFeedback>{errors.amount.message}</FormFeedback>}
        </Col>


        <Col className='mt-2 mb-1 pl-0'>
          <Button type='button' size='md' color='danger' className='mx-1' onClick={close}>Cancel</Button>
          <Button label="Submit" type="submit" size='md' color='primary' className="mx-1" >Submit</Button>
        </Col>

        {/* </div> */}
      </Form>
    </>
  )
}
