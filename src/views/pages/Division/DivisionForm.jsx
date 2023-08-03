import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col,Label,FormFeedback,Input,Button,Form } from 'reactstrap'
import { useEffect } from 'react'
import Select from 'react-select'
import FormUserAssign from '../Components/FormUserAssign'
import Api from '../../../sevices/Api'

export default function DivisionForm({close, onSubmit, item, userSelect, users}){

    const ItemSchema = yup.object().shape({
		name: yup.string().required(),
        manager_id :  yup.string().required()
        
  	})

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })

    const onSubmitForm = async (arg) => {
        // console.log(arg, " ini arg")
        onSubmit(arg)
    }

    useEffect(() => {
        // console.log(item.manager, "item ni isi apa")
        if(item){
            setValue('name', item.name)
            setValue('parent', item && item.parent? item.parent : item.name)
            setValue('manager_id', item.manager.email)
        }
    },[item])

    return(
        <>
            <Form onSubmit={handleSubmit(onSubmitForm)}>
                <Row>
                    <Col md='12' sm='12' className='mb-1'>
                        <Label className='form-label' for='name'>Division Name</Label>
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
                        <Label className='form-label' for='parent'>Division Parent</Label>
						<Controller
								name='parent'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='text' {...field} name='parent' invalid={errors.parent && true}/>
							}
						/>
                        {errors.parent && <FormFeedback>{errors.parent.message}</FormFeedback>}
                    </Col>
                    <Col md='12' sm='12' className='mb-1'>
                        <Label className='form-label' for='manager'>Select Division Leader</Label>
                        <Controller
                            name="manager_id"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                            <Input
                                type="select"
                                {...field}
                                name="division_leader"
                                invalid={errors.manager && true}
                            >
                                <option value="">Select manager</option>
                                {users?.map((x) => (
                                <option key={x.value} value={x.id}>
                                    {x.email}
                                </option>
                                ))}
                            </Input>
                            )}
                        />
                        {errors.manager_id && ( 
                            <FormFeedback>{errors.manager_id.message}</FormFeedback>
                        )}
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

DivisionForm.defaultProps = {
    item:null
}