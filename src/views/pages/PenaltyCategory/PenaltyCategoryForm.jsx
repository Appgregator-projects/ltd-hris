import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useEffect } from 'react'
import { Controller, useForm  } from 'react-hook-form'
import { Button, Col, FormFeedback, Input, Label, Row, Form } from 'reactstrap'
import * as yup from 'yup'


export default function PenaltyCategoryForm ({item, close, onSubmit}){

  const ItemSchema = yup.object().shape({
    title: yup.string().required(),
    duration: yup.number().required(),
  })

const {
  setValue,
  control,
  handleSubmit,
  formState: { errors }
} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })

const onSubmitForm = (arg) => {
    onSubmit(arg)
}

useEffect(() => {
  if(item){
    setValue('title', item.title)
    setValue('duration', item.duration)
  }
}, [item])
  return (
    <>
    <Form onSubmit={handleSubmit(onSubmitForm)}>
      <Row>
        <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='title'>Penalty Title</Label>
            <Controller
                name='title'
                defaultValue=''
                control={control}
                render={({ field }) => <Input type='text' {...field} name='title' invalid={errors.title && true}/>
              }
            />
            {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
          </Col>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='balance'>Duration</Label>
            <Controller
                name='duration'
                defaultValue='0'
                control={control}
                render={({ field }) => (<Input type='select' {...field} name='duration' invalid={errors.duration && true}>
                  <option>Select month</option>
                  <option value={1}>1 month</option>
                  <option value={2}>2 month</option>
                  <option value={3}>3 month</option>
                </Input>
              )}
            />
            {errors.duration && <FormFeedback>{errors.duration.message}</FormFeedback>}
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

PenaltyCategoryForm.defaultProps = {
  item:null
}