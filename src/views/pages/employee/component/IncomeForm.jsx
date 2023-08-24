import React, { useEffect } from 'react'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Api from "../../../../sevices/Api";


export default function IncomeForm({isLoading, close, income, onSubmit}) {
    const {
        setValue,
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({ mode: "onChange"});
      console.log(errors, "error");

    useEffect(() => {
        return console.log(income, "assurance")
    },[income])

    const onSubmitIncome = async (arg) => {
        onSubmit(arg)
    }

  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitIncome)}>
    <div className='py-1'>
        <Col>
        <FormGroup>
            <Label for="form-label">
            Name
            </Label>
            <Controller
            name='name'
            defaultValue=""
            control={control}
            render={({field}) => (
                <Input
                type="text"
                {...field}
                name='name'
                invalid={errors.name && true}
                />
            )}/>
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

        </FormGroup>
        </Col>
        <Row className='mb-1'>
        <Col md='6' sm='12' className='mb-1'>
            <FormGroup>
            <Label className='form-label'>Amount (Rp)</Label>
            <Controller
            name='amount'
            defaultValue=''
            control={control}
            render={({field}) => (
                <Input
                type="number"
                {...field}
                defaultValue={0}
                />
            )}/>
            {errors.amount && <FormFeedback>{errors.amount.message}</FormFeedback>}
            </FormGroup>
        </Col>
        <Col md='6' sm='12' className='mb-1'>
            <FormGroup>
            <Label className='form-label'>Flag</Label>
            <Controller
            name='flag'
            defaultValue=''
            control={control}
            render={({field}) => (
                <Input
                type="text"
                {...field}
                defaultValue={0}
                name='flag'
                />
            )}/>
            {errors.flag && <FormFeedback>{errors.flag.message}</FormFeedback>}
            </FormGroup>
        </Col>

        </Row>
        <Col>
            <Button type='button' size='md' color='danger' className='mx-1' onClick={close}>Cancel</Button>
            <ButtonSpinner label="Submit" type="submit" className="m-1"/>
        </Col>

    </div>
    </Form>
    </>
  )
}
