import React from 'react'
import { Controller, Form, useForm } from 'react-hook-form'
import { Col, Label, Row } from 'reactstrap'

const LevelListIndex = () => {

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors)

  return (
    <>
      <Form>
        <Row>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='label'>Add approved by</Label>
            <Controller
              name='label'
              defaultValue=''
              control={control}
              render={({ field }) =>
                <Input
                  type='text'
                  {...field} name='label'
                  invalid={errors.label && true} />
              }
            />
            {errors.label && <FormFeedback>{errors.label.message}</FormFeedback>}
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

export default LevelListIndex