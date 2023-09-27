import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { useState } from 'react'
import { Upload } from '../../../Helper/firebaseStorage'
import Api from '../../../sevices/Api'


const PenaltyForm = ({item, close, user}) => {
  const [file, setFile] = useState("")
  const [penalty, setPenalty] = useState([])

  const option = user?.map((e) => ({value: e.id, label: e.name}))

  const ItemSchema = yup.object().shape({
		// name: yup.string().required(),
		title: yup.string().required(),
		penalty_type: yup.string().required(),
		message: yup.string().required(),
		// file: yup.string().required(),
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
			setValue('title', item.title)
			setValue('penalty_type', item.penalty_type)
			setValue('message', item.message)
			setValue('file', item.file)
		}
	}, [item])

  const fetchPenalty = async() => {
    try {
      const data = await Api.get('/hris/penalty-category')
      setPenalty([...data])
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchPenalty()
  }, [])

  const handleUpload = (e) => {
    const fileObj = e.target.files && e.target.files[0];
    setFile(fileObj)
    console.log(fileObj, "fileObj")
  };

  const onSubmitFile = async(arg) => {
    let baseURL = ""
    console.log(arg, "arg onsubmitfile")
    try{
    let reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = async () => {
      baseURL = reader.result;
      // return console.log(baseURL, "baseURL")
    }
    const uploadFile = await Upload(file.name, )
    } catch(error){

    }
  }

	const onSubmitForm = (params) => {
    return console.log(params, "params")
			onSubmit(params)
	}
  
  return (
    <>
    	<Form onSubmit={handleSubmit(onSubmitFile)}>
				<Row>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='name'>Name</Label>
						<Controller
								name='name'
								defaultValue=''
								control={control}
								render={({ field }) => 
                  <Select 
                  className='react-select'
                  classNamePrefix="select"
                  id='label'
                  {...field}
                  placeholder="Select Employee"
                  options={option}
                  invalid={errors.name && true}/>
							}
						/>
							{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='title'>Penalty</Label>
						<Controller
								name='title'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Input type='select' {...field} name='title' invalid={errors.title && true}>
                  <option value="">Select Penalty</option>
                  {penalty?.map((x)=> (
                    <option key={x.id} value={x.duration}>{x.title}</option>
                  ))}
                </Input>
							}
						/>
							{errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
					</Col>
					<Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='message'>Message</Label>
						<Controller
								name='message'
								defaultValue=''
								control={control}
								render={({ field }) => <Input type='textarea' {...field} name='message' invalid={errors.message && true}/>
							}
						/>
							{errors.message && <FormFeedback>{errors.message.message}</FormFeedback>}
					</Col>
          <Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='file'>Attachment</Label>
						<Controller
								name='file'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Input 
                type='file' {...field} 
                name='file' 
                id="inputFile" 
                onChange={(e) => handleUpload(e)}
                invalid={errors.file && true}/>
							}
						/>
							{errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
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


export default PenaltyForm