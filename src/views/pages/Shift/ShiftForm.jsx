import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col,Label,FormFeedback,Input,Card,CardBody,Button,Form,FormGroup } from 'reactstrap'
// import api from '../../plugins/api'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function ShiftForm({onSubmit,close, item}){

    const [offices, setOffices] = useState([])
    const [isMainShift, setIsMainShift] = useState(false)

    // const fetchOffice = async() => {
	// 	try {
	// 		const {data} = await api.get('/api/office')
	// 		setOffices([...data])
	// 	} catch (error) {
	// 		throw error
	// 	}
	// }

	useEffect(() => {
		// fetchOffice()
	},[])

    const ItemSchema = yup.object().shape({
		office: yup.string().required(),
		name: yup.string().required(),
		clock_in: yup.string().required(),
		clock_out: yup.string().required(),
		begin_date: yup.date().required(),
		end_date: yup.date().required()
  	})

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })

    useEffect(() => {
		if(item){
            setValue('office', item.office_id)
            setValue('name', item.name)
            setValue('clock_in', item.clock_in)
            setValue('clock_out', item.clock_out)
            setValue('begin_date', dayjs(item.end_date).format('YYYY-MM-DD'))
            setValue('end_date', dayjs(item.end_date).format('YYYY-MM-DD'))
            setIsMainShift(item.main_shift ? true : false)
		}
	}, [item])

    const onSubmitForm = (arg) => {
        arg.office_id = arg.office
        arg.start_date = dayjs(arg.begin_date).format('YYYY-MM-DD')
        arg.end_date = dayjs(arg.end_date).format('YYYY-MM-DD')
        arg.main_shift = isMainShift
        onSubmit(arg)
    }

    return(
        <>
            <Form onSubmit={handleSubmit(onSubmitForm)}>
                <Row>
                    <Col md='6' sm='12' className='mb-1'>
                        <Label className='form-label' for='office'>Pick Office</Label>
                        <Controller
                            name='office'
                            defaultValue=''
                            control={control}
                            render={({ field }) => <Input type='select' {...field} name='office' placeholder='Ex:Finance Staff' invalid={errors.office && true}>
                                    <option value="">Select office</option>
                                    {
                                        offices.map(y => (
                                            <option key={y.id} value={y.id}>{y.name}</option>
                                        ))
                                    }
                                </Input>
                            }
                        />
                        {errors.office && <FormFeedback>{errors.office.message}</FormFeedback>}
                    </Col>
                    <Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='name'>Shif Name</Label>
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
						<Label className='form-label' for='clock_in'>Clock in time</Label>
						<Controller
								name='clock_in'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='time' {...field} name='clock_in' invalid={errors.clock_in && true}/>
							}
						/>
							{errors.clock_in && <FormFeedback>{errors.clock_in.message}</FormFeedback>}
					</Col>
                    <Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='clock_out'>Clock out time</Label>
						<Controller
								name='clock_out'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='time' {...field} name='clock_out' invalid={errors.clock_out && true}/>
							}
						/>
							{errors.clock_out && <FormFeedback>{errors.clock_out.message}</FormFeedback>}
					</Col>
                    <Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='begin_date'>Begin Date</Label>
						<Controller
								name='begin_date'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='date' {...field} name='begin_date' invalid={errors.begin_date && true}/>
							}
						/>
							{errors.begin_date && <FormFeedback>{errors.begin_date.message}</FormFeedback>}
					</Col>
                    <Col md='6' sm='12' className='mb-1'>
						<Label className='form-label' for='end_date'>End Date</Label>
						<Controller
								name='end_date'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='date' {...field} name='end_date' invalid={errors.end_date && true}/>
							}
						/>
							{errors.end_date && <FormFeedback>{errors.end_date.message}</FormFeedback>}
					</Col>
                    <Col md='12' sm='12' className='mb-1'>
                        <FormGroup switch>
                            <Input
                            type="switch"
                            checked={isMainShift}
                            onChange={() => {
                                setIsMainShift(!isMainShift);
                            }}
                            />
                            <Label check>Is main shift for this office?</Label>
                            <small>(When this toggle ON, the office schedule no longer needed)</small>
                        </FormGroup>
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

ShiftForm.defaultProps = {
    item:null
}