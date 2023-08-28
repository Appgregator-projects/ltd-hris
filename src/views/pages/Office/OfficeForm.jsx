import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col,Label,FormFeedback,Input,Card,CardBody,Button,Form } from 'reactstrap'
import { useEffect } from 'react'

export default function OfficeForm({close, onSubmit, item}){

	const ItemSchema = yup.object().shape({
		name: yup.string().required(),
		address: yup.string().required(),
		latitude: yup.number().required(),
		longitude: yup.number().required(),
		radius: yup.number()
  	})

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })

	useEffect(() => {
		if(item){
			setValue('name', item.name)
			setValue('radius', item.radius)
			setValue('latitude', item.latitude)
			setValue('longitude', item.longitude)
			setValue('address', item.address)
		}
	}, [item])
	
	const onSubmitForm = (params) => {
			onSubmit(params)
	}

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmitForm)}>
				<Row>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='name'>Office Name</Label>
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
						<Label className='form-label' for='radius'>Radius (m) to fill absence</Label>
						<Controller
								name='radius'
								defaultValue='50'
								control={control}
								render={({ field }) => <Input type='number' {...field} name='radius' invalid={errors.naradiusme && true}/>
							}
						/>
							{errors.radius && <FormFeedback>{errors.radius.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='latitude'>Latitude</Label>
						<Controller
								name='latitude'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='number' {...field} name='latitude' invalid={errors.latitude && true}/>
							}
						/>
							{errors.latitude && <FormFeedback>{errors.latitude.message}</FormFeedback>}
					</Col>
					<Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='longitude'>Longitude</Label>
						<Controller
								name='longitude'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='number' {...field} name='longitude' invalid={errors.longitude && true}/>
							}
						/>
							{errors.longitude && <FormFeedback>{errors.longitude.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='longitude'>Address</Label>
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