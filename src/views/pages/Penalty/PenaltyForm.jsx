import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { useState } from 'react'
import { Upload } from '../../../Helper/firebaseStorage'
import Api from '../../../sevices/Api'
import { useDropzone } from 'react-dropzone'
import { upload } from '../../../Helper'
import toast from 'react-hot-toast'
import { DownloadCloud } from 'react-feather'
import CardLoader from '../Components/CardLoader'
import { createTheme } from 'react-data-table-component'


const PenaltyForm = ({item, close, user}) => {
  const [file, setFile] = useState(null)
  const [selectUser, setSelectUser] = useState(null)
  const [attachment, setAttachment] = useState(null);
  const [penalty, setPenalty] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory]= useState([])

  const ItemSchema = yup.object().shape({
		// name: yup.string().required(),
		title: yup.string().required(),
		message: yup.string().required(),
		file: yup.string().required(),
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
			setValue('message', item.message)
			setValue('file', item.file)
		}
	}, [item])

  const fetchCategory = async() => {
    try {
      const data = await Api.get('/hris/penalty-category')
      setPenalty([...data])
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchHistory = async(arg) => {
    try {
      let newArr = []
      const data = await Api.get(`/hris/warning-letter/${arg.value}/history`)
      if(data.data){
        const createdDate = new Date(data.data.createdAt)
        const currentDate = new Date()
        const timeDifference = currentDate - createdDate
        const daysDifference = Math.floor(timeDifference /(1000 * 60 * 60 *24))
        if(daysDifference > 30) {
          newArr.push({...data.data, daysDifference, status: "expired"})
        } if (daysDifference < 30) {
          newArr.push({...data.data, daysDifference, status: "active"})
        }
        setHistory([...newArr][0])
      } else {
        newArr.push({...data.data, status: "no penalty"})
        console.log( newArr, "no penalty")
        setHistory([...newArr][0])
      }
    } catch (error) {
      throw error
    }
  }

  console.log(history, "history")
  

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: async (acceptedFiles) => {
      try {
        const { size, name } = acceptedFiles[0];
        if (size > 10000000)
          return toast.error(`Error : File size should not exceed 3mb`, {
            position: "top-center",
          });
        setFile(acceptedFiles[0]);
        setIsLoading(true);
        const post = await upload(acceptedFiles[0], name, "penalty/user");
        setIsLoading(false);
        setAttachment(post);
      } catch (error) {
        setIsLoading(false);
        return toast.error(`Error : ${error.message}`, {
          position: "top-center",
        });
      }
    },
  });

	const onSubmitForm = (params) => {
    params.file = attachment
    // return console.log(params, "params")
		return onSubmit(params)
	}
  
  return (
    <>
    	<Form onSubmit={handleSubmit(onSubmitForm)}>
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
                  placeholder="Select Employee"
                  closeMenuOnSelect={true}
                  options={user}
                  invalid={errors.name && true}
                  onChange={(arg) => {setSelectUser(arg.value); fetchHistory(arg)}}
                  />
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
                <Input 
                type='select' {...field} 
                name='title' 
                invalid={errors.title && true} 
                >
                  <option value="">Select Penalty</option>
                  {penalty?.map((x)=> (
                    <option key={x.id} value={x.duration} 
                    disabled= {history.status == "active"? x.title <= history.title : null}
                    >{x.title}</option>))
                  }
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
            <Card className="bg-transparent border-primary shadow-none">
            <CardBody>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="d-flex align-items-center justify-content-center flex-column">
                  {!attachment ? (
                    <DownloadCloud size={60} />
                  ) : (
                    <>
                      <p className="text-primary">{file ? file.name : "-"}</p>
                    </>
                  )}

                  <h5>Drop Files here or click to upload</h5>
                  <p className="text-secondary">
                    Drop files here or click{" "}
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      browse
                    </a>{" "}
                    horough your machine
                  </p>
                </div>
              </div>
              <CardLoader open={isLoading} />
            </CardBody>
          </Card>
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