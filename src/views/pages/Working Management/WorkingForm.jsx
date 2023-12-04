import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

const WorkingForm = ({ item, close, onSubmit }) => {

  console.log(item, "itemsssbbomboboms")
  const ItemSchema = yup.object().shape({
    name: yup.string().required(),
    type: yup.string().required(),
    productive: yup.string().required(),
    off: yup.string().required(),
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  const onSubmitForm = (arg) => {
    onSubmit(arg);
  };

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
      setValue("type", item.type)
      setValue("productive_minutes", item.productive_minutes)
      if (item.details) {
        setValue("productive_days", item.productive_days)
        setValue("productive_detail", item.productive_detail)
        setValue("off_days", item.off_days)
        setValue("off_detail", item.off_detail)
      }
    }
  }, [item]);


  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <Row>
            <Col md='112' sm='12' className='mb-1'>
              <Label className='form-label' for='name'>Name</Label>
              <Controller
                name='name'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='text'
                    {...field} name='name'
                    invalid={errors.name && true} />
                }
              />
              {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
            </Col>
          </Row>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='type'>Type</Label>
              <Controller
                name='type'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='select'
                    {...field} name='type'
                    invalid={errors.type && true} >
                    <option>Select type</option>
                    <option value={"Flexible"}>Flexible</option>
                    <option value={"Reguler"}>Reguler</option>
                  </Input>
                }
              />
              {errors.type && <FormFeedback>{errors.type.message}</FormFeedback>}
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='productive_minutes'>Productive (minutes)</Label>
              <Controller
                name='productive_minutes'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='text'
                    {...field} name='productive_minutes'
                    invalid={errors.productive_minutes && true} />
                }
              />
              {errors.productive_minutes && <FormFeedback>{errors.productive_minutes.message}</FormFeedback>}
            </Col>
          </Row>
          <Col md="12" sm="12" className="pb-1 fs-6 fw-bold">Details</Col>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='productive'>Productive (days)</Label>
              <Controller
                name='productive'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='number'
                    {...field} name='productive'
                    invalid={errors.productive && true} />
                } />
              {errors.productive && <FormFeedback>{errors.productive.message}</FormFeedback>}
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='productive_detail'>Productive Details</Label>
              <Controller
                name='productive_detail'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='text'
                    {...field} name='productive_detail'
                    invalid={errors.productive_detail && true} />
                }
              />
              {errors.productive_detail && <FormFeedback>{errors.productive_detail.message}</FormFeedback>}
            </Col>
          </Row>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='off'>Off (days)</Label>
              <Controller
                name='off'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='number'
                    {...field} name='off'
                    invalid={errors.off && true} />
                } />
              {errors.off && <FormFeedback>{errors.off.message}</FormFeedback>}
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='off_detail'>Off Details</Label>
              <Controller
                name='off_detail'
                defaultValue=''
                control={control}
                render={({ field }) =>
                  <Input
                    type='text'
                    {...field} name='off_detail'
                    invalid={errors.off_detail && true} />
                }
              />
              {errors.off_detail && <FormFeedback>{errors.off_detail.message}</FormFeedback>}
            </Col>
          </Row>
          <Col>
            <Button type="button" size="md" color='danger' onClick={close}>Cancel</Button>
            <Button type="submit" size="md" color='primary' className="m-1">Submit</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default WorkingForm