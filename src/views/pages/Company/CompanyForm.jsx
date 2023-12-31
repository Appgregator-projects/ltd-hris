import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col,Label,FormFeedback,Input,Card,CardBody,Button,Form } from 'reactstrap'
import { useEffect } from 'react'

export default function CompanyForm({close, onSubmit, item}){

	const ItemSchema = yup.object().shape({
		name: yup.string().required(),
		address: yup.string().required(),
  	})

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })
	console.log(errors, "error")

	useEffect(() => {
		if(item){
			setValue('name', item.name)
			setValue('address', item.address)
			setValue('phone', item.phone_number)
			setValue('company_npwp', item.company_npwp)
		}
	}, [item])
	
	const onSubmitForm = (params) => {
			onSubmit(params)
	}

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmitForm)}>
				<Row>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='name'>Company Name</Label>
						<Controller
								name='name'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='text' {...field} name='name' invalid={errors.name && true}/>
							}
						/>
							{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='phone'>Phone Number</Label>
						<Controller
								name='phone'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='text' {...field} name='phone' invalid={errors.phone_number && true}/>
							}
						/>
							{errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='company_npwp'>NPWP Company</Label>
						<Controller
								name='company_npwp'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='text' {...field} name='company_npwp' invalid={errors.company_npwp && true}/>
							}
						/>
							{errors.company_npwp && <FormFeedback>{errors.company_npwp.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='address'>Address</Label>
						<Controller
								name='address'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='textarea' {...field} name='address' invalid={errors.address && true}/>
							}
						/>
							{errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
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