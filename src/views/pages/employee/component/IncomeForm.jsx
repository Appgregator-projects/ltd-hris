import React, { useEffect } from 'react'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Api from "../../../../sevices/Api";


export default function IncomeForm({isLoading, close, income, onSubmit}) {

    const ItemSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        amount: yup.string().required("Amount is required"),
        flag: yup.string().required()
    })
    const {
        setValue,
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({ mode: "onChange"});

    const onSubmitIncome = (arg) => {
        // return console.log(arg, "arg")
        onSubmit(arg)
    }

  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitIncome)}>
    <div className='py-2'>
        <Col sm='12' className='mb-1'>
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
        </Col>
        <Row className='my-2'>
        <Col md='6' sm='12' >
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
        </Col>
        <Col md='6' sm='12' className='mb-1'>
            <Label className='form-label'>Flag</Label>
            <Controller
            name='flag'
            defaultValue=''
            control={control}
            render={({field}) => (
                <Input
                type="select"
                {...field}
                defaultValue={0}
                name='flag'
                >
                    <option value=''>Select income category</option>
                    <option value='gaji pokok'>Gaji pokok</option>
                    <option value='tunjangan driver'>Tunjangan driver</option>
                    <option value='tunjangan perusahaan'>Tunjangan perusahaan</option>
                </Input>
            )}/>
            {errors.flag && <FormFeedback>{errors.flag.message}</FormFeedback>}
        </Col>

        </Row >
        <Col className='mt-2'>
            <Button type='button' size='md' color='danger' className='mx-1' onClick={close}>Cancel</Button>
            <ButtonSpinner label="Submit" type="submit" className="mx-1"/>
        </Col>

    </div>
    </Form>
    </>
  )
}
