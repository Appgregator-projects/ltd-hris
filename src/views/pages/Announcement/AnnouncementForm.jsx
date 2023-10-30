import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { DownloadCloud } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { Button, Col, FormFeedback, Input, Label, Row, Form, Card, CardBody} from 'reactstrap'
import * as yup from 'yup'
import CardLoader from '../Components/CardLoader'
import toast from 'react-hot-toast'
import { upload } from '../../../Helper'

const AnnouncementForm = ({close, item, onSubmit}) => {
  const [file, setFile] = useState(null)
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ItemSchema = yup.object().shape({
		title: yup.string().required(),
		message: yup.string().required(),
		start_date: yup.string().required(),
		expire_date: yup.string().required(),
		// file: yup.string().required(),
  	})

  const {
		setValue,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({ mode: 'onChange', resolver: yupResolver(ItemSchema) })
	console.log(errors, "error")

  // useEffect(() => {
	// 	if(item){
	// 		setValue('title', item.name)
	// 		setValue('message', item.address)
	// 		setValue('start', item.phone_number)
	// 		setValue('company_npwp', item.company_npwp)
	// 	}
	// }, [item])

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
    params.url_file = attachment
		onSubmit(params)
	}
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
				<Row>
        <Col md='12' sm='12' className='mb-1'>
						<Label className='form-label' for='title'>Title</Label>
						<Controller
								name='title'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Input type='text' 
                {...field} name='title' invalid={errors.title && true}/>
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
								render={({ field }) => 
                <Input type='textarea' 
                {...field} name='message' invalid={errors.message && true}/>
							}
						/>
							{errors.message && <FormFeedback>{errors.message.message}</FormFeedback>}
					</Col>
          <Row>
          <Col md='6' sm='6' className='mb-1'>
						<Label className='form-label' for='start_date'>Start date</Label>
						<Controller
								name='start_date'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Input type='date' 
                {...field} name='start_date' invalid={errors.start_date && true}/>
							}
						/>
							{errors.start_date && <FormFeedback>{errors.start_date.message}</FormFeedback>}
					</Col>
          <Col md='6' sm='6' className='mb-1'>
						<Label className='form-label' for='expire_date'>End date</Label>
						<Controller
								name='expire_date'
								defaultValue=''
								control={control}
								render={({ field }) => 
                <Input type='date' 
                {...field} name='expire_date' invalid={errors.expire_date && true}/>
							}
						/>
							{errors.expire_date && <FormFeedback>{errors.expire_date.message}</FormFeedback>}
					</Col>
          </Row>

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

export default AnnouncementForm