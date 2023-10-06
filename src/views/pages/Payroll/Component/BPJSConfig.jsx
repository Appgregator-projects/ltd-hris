import React, { useEffect } from 'react'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Api from "../../../../sevices/Api";

const BPJSConfig = ({isLoading, close, item, onSubmit}) => {
    const {
        setValue,
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({ mode: "onChange"});
      console.log(errors, "error");

    useEffect(() => {
        if(item) {
        setValue("name", item.name);
        setValue("payment", item.is_employee)
        setValue("percentage", item.percentage)
        setValue("topper", item.topper)
        }
    },[item])

    const onSubmitAssurance = async (arg) => {
        // return console.log(arg,"tinggal pasang api")
        onSubmit(arg)
    }

  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitAssurance)}>
    <div className='pb-1'>
        <Col className='pb-1'>
            <Label for="form-label">
            BPJS
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
        <Col className='pb-1'>
            <Label className="form-label" for="payment">
            Payment type
            </Label>
            <Controller
            name="payment"
            defaultValue=""
            control={control}
            render={({field})=> (
                <Input
                type="select"
                {...field}
                name='payment'
                // value={item?.is_employee}
                invalid={errors.payment && true}
                >
                <option value=''>Select type</option>                                                                  
                <option value='true'>by Employee</option>                                                                  
                <option value='false'>by Company</option>
                </Input>
            )}
            />
            {errors.peyment && <FormFeedback>{errors.payment.message}</FormFeedback>}
        </Col>
        <Row className='pb-1'>
        <Col md='6' sm='12' className='pb-1'>
            <Label className='form-label'>Percentage</Label>
            <Controller
            name='percentage'
            defaultValue=''
            control={control}
            render={({field}) => (
                <Input
                type="number"
                {...field}
                defaultValue={0}
                />
            )}/>
            {errors.percentage && <FormFeedback>{errors.percentage.message}</FormFeedback>}
        </Col>
        <Col md='6' sm='12' className='pb-1'>
            <Label className='form-label'>Topper</Label>
            <Controller
            name='topper'
            defaultValue=''
            control={control}
            render={({field}) => (
                <Input
                type="number"
                {...field}
                defaultValue={0}
                name='topper'
                />
            )}/>
            {errors.topper && <FormFeedback>{errors.topper.message}</FormFeedback>}
        </Col>
        </Row>
        <Col>
            <Button type='button' size='md' color='danger' className='mx-1' onClick={close}>Cancel</Button>
            <ButtonSpinner label="Submit" type="submit" className="mx-1"/>
        </Col>

    </div>
    </Form>
    </>
  )
}

export default BPJSConfig