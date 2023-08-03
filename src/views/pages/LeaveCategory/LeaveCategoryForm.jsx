import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col,Label,FormFeedback,Input,Button,Form } from 'reactstrap'
import { useEffect } from 'react'

export default function LeaveCategoryForm({item, close, onSubmit}){

  const ItemSchema = yup.object().shape({
      name: yup.string().required(),
      balance: yup.number().required(),
  	})

  // console.log(item,"item formcategory")

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })
  // console.log(errors, "error.message")

  const onSubmitForm = (arg) => {
    console.log(arg,"arg categories")
      onSubmit(arg)
  }

  useEffect(() => {
    console.log(item, "item useefet")
    if(item){
      setValue('name', item.name)
      setValue('initial_balance', item.initial_balance)
    }
  }, [item])

  return(
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <Col md='12' sm='12' className='mb-1'>
              <Label className='form-label' for='name'>Leave Name</Label>
              <Controller
                  name='name'
                  defaultValue=''
                  control={control}
                  render={({ field }) => <Input type='text' {...field} name='name' invalid={errors.name && true}/>
                }
              />
              {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
            </Col>
            <Col md='12' sm='12' className='mb-1'>
              <Label className='form-label' for='initial_balance'>Initial Balance</Label>
              <Controller
                  name='balance'
                  defaultValue=''
                  control={control}
                  render={({ field }) => <Input type='number' {...field} name='balance' invalid={errors.balance && true}/>
                }
              />
              {errors.balance && <FormFeedback>{errors.balance.message}</FormFeedback>}
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
  item:null
}