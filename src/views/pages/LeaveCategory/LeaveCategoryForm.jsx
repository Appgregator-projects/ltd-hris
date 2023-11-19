import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col, Label, FormFeedback, Input, Button, Form } from 'reactstrap'
import { useEffect } from 'react'

export default function LeaveCategoryForm({ item, close, onSubmit }) {

  const ItemSchema = yup.object().shape({
    name: yup.string().required(),
    initial_balance: yup.number().required(),
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
    if (item) {
      setValue('name', item.name)
      setValue('initial_balance', item.initial_balance)
    }
  }, [item])

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
              render={({ field }) => <Input type='text' {...field} name='name' invalid={errors.name && true} />
              }
            />
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
          </Col>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='balance'>Initial Balance</Label>
            <Controller
              name='initial_balance'
              defaultValue='0'
              control={control}
              render={({ field }) => <Input type='number' {...field} name='initial_balance' invalid={errors.initial_balance && true} />
              }
            />
            {errors.initial_balance && <FormFeedback>{errors.initial_balance.message}</FormFeedback>}
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

LeaveCategoryForm.defaultProps = {
  item: null
}