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
        setValue("name", item.name);
        setValue("payment type", item.is_employee)
        setValue("percentage", item.percentage)
        setValue("topper", item.topper)
    },[item])

    const onSubmitAssurance = async (arg) => {
        // return console.log(arg,"tinggal pasang api")
        onSubmit(arg)
    }

  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitAssurance)}>
    <div className='py-1'>
        <Col>
        <FormGroup>
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

        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
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
                invalid={errors.payment && true}
                >
                <option value=''>Select</option>                                                                  
                <option value='true'>by Employee</option>                                                                  
                <option value='false'>by Company</option>
                </Input>
            )}
            />
            {errors.peyment && <FormFeedback>{errors.payment.message}</FormFeedback>}
        </FormGroup>
        </Col>
        <Row className='mb-1'>
        <Col md='6' sm='12' className='mb-1'>
            <FormGroup>
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
            </FormGroup>
        </Col>
        <Col md='6' sm='12' className='mb-1'>
            <FormGroup>
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

export default BPJSConfig