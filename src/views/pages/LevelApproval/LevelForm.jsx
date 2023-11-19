import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup';

const LevelForm = ({ item, close, onSubmit, department }) => {

  const ItemSchema = yup.object().shape({
    name: yup.string().required(),
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  const onSubmitForm = (arg) => {
    // console.log(arg, "data")
    onSubmit(arg);
  };

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
    }
  }, [item]);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='name'>Leave Name</Label>
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
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='division_id'>Department & Division</Label>
            <Controller
              name='division_id'
              defaultValue=''
              control={control}
              render={({ field }) =>
                <Input
                  type='select'
                  {...field} name='division_id'
                  invalid={errors.division_id && true} >
                  <option>Select division</option>
                  {department?.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </Input>
              }
            />
            {errors.division_id && <FormFeedback>{errors.division_id.message}</FormFeedback>}
          </Col>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label me-2' for='approved_by'>Approved by</Label>
            <Controller
              name='manager'
              control={control}
              render={({ field }) =>
                <FormGroup check inline>
                  <Input type="checkbox"{...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }} />
                  <Label check>
                    Manager
                  </Label>
                </FormGroup>
              }
            />

            <Controller
              name='supervisor'
              control={control}
              render={({ field }) =>
                <FormGroup check inline>
                  <Input type="checkbox"{...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }} />
                  <Label check>
                    Supervisor
                  </Label>
                </FormGroup>
              }
            />

            <Controller
              name='head_of_division'
              control={control}
              render={({ field }) =>
                <FormGroup check inline>
                  <Input type="checkbox"{...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }} />
                  <Label check>
                  Head of division
                  </Label>
                </FormGroup>
              }
            />

            <Controller
              name='hr'
              control={control}
              render={({ field }) =>
                <FormGroup check inline>
                  <Input type="checkbox"{...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }} />
                  <Label check>
                    HR
                  </Label>
                </FormGroup>
              }
            />

            <Controller
              name='finance'
              control={control}
              render={({ field }) =>
                <FormGroup check inline>
                  <Input type="checkbox"{...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }} />
                  <Label check>
                    Finance
                  </Label>
                </FormGroup>
              }
            />
            {errors.approved_by && <FormFeedback>{errors.approved_by.message}</FormFeedback>}
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

export default LevelForm