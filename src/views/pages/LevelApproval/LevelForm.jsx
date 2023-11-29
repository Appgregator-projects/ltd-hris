import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup';
import { Delete, Trash } from 'react-feather';
import Api from '../../../sevices/Api'
import toast from 'react-hot-toast';

const LevelForm = ({ item, close, onSubmit, department, level }) => {
  const [levelList, setLevelList] = useState([])
  const [toggleModal, setToggleModal] = useState(false)
  const [nestedModal, setNestedModal] = useState(false)
  const [modal, setModal] = useState({
    title: 'Leave Form',
    mode: 'add',
    item: null
  })

  const ItemSchema = yup.object().shape({
    label: yup.string().required(),
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });

  const onSubmitForm = (arg) => {
    console.log(arg, "data")
    return
    onSubmit(arg);
  };

  const onSubmitLevel = async (arg) => {
    const itemSubmit = {
      label: arg.label
    }
    try {
      const { status, data } = await Api.post(`/hris/level-approval-list`, itemSubmit)
      setNestedModal(!nestedModal)
      if (!status) return toast.error(`Error : ${data}`, {
        position: 'top-center'
      })
      toast.success('New Level has saved', {
        position: 'top-center'
      })
    } catch (error) {
      console.log(error.message)
      toast.error(`Error : ${error.message}`, {
        position: "top-center",
      });
    }
  }

  const onEditLevel = () => {
    setModal({
      title: "Edit level",
      mode: "level",
      item: item
    })
    setToggleModal(true)
  }

  const onAddLevel = () => {
    setModal({
      title: "Add level",
      mode: "add level",
      item: item
    })
    setNestedModal(true)
  }

  useEffect(() => {
    if (item) {
      setValue("name", item.name)
    }
  }, [item]);

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
              render={({ field }) =>
                <Input
                  type='text'
                  {...field} name='name'
                  invalid={errors.name && true} />
              }
            />
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
          </Col>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label' for='division_id'>Department & Division</Label>
            <Controller
              name='division_id'
              defaultValue=''
              control={control}
              render={({ field }) =>
                <Input
                  type='select'
                  {...field} name='division_id'
                  invalid={errors.division_id && true} >
                  <option>Select division</option>
                  {department?.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </Input>
              }
            />
            {errors.division_id && <FormFeedback>{errors.division_id.message}</FormFeedback>}
          </Col>
          <Col md='12' sm='12' className='mb-1'>
            <Label className='form-label me-2' for='approved_by'>Approved by</Label>
            {level?.map((x) => (
              <>
                <Controller
                  name='manager'
                  control={control}
                  render={({ field }) =>
                    <FormGroup check inline>
                      <Input type="checkbox"{...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }} />
                      <Label check>
                        {x.label}
                      </Label>
                    </FormGroup>
                  }
                />
              </>
            ))}
            {errors.approved_by && <FormFeedback>{errors.approved_by.message}</FormFeedback>}
          </Col>
          <Col>
            <Button type="button" size="md" color='danger' onClick={close}>Cancel</Button>
            <Button type="submit" size="md" color='primary' className="m-1">Submit</Button>
            <Button type="button" size="md" color='info' onClick={onEditLevel}>Edit level </Button>
          </Col>
        </Row>
      </Form>
      <Modal
        isOpen={toggleModal}
        toggle={() => setToggleModal(!toggleModal)}
        className={`modal-dialog-centered modal-lg`}>
        <ModalHeader toggle={() => setToggleModal(!toggleModal)}>{modal.title}</ModalHeader>
        <ModalBody>
          <Button size='sm' className='my-1 position-absolut top-0 end-0 w-20'
            onClick={() => onAddLevel()}>
            Add new level
            <Modal
              isOpen={nestedModal}
              className={`modal-dialog-centered modal-lg`}
              backdrop={"static"}>
              <ModalHeader toggle={() => setNestedModal(!nestedModal)}>Add new level</ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit(onSubmitLevel)}>
                  <Row>
                    <Col md='12' sm='12' className='mb-1'>
                      <Label className='form-label' for='label'>Level</Label>
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
                      <Button type="submit" size="md" color='primary' className="mb-1">Submit</Button>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {level?.map((x) => (
                <tr key={x.id}>
                  <td>{x.label}</td>
                  <td><Trash size={'14'} /></td>
                </tr>

              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  )
}

export default LevelForm