import React from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonSpinner from '../../components/ButtonSpinner'

export default function HealthForm(isLoading, close, assurance) {
    console.log(assurance,"got u")
  return (
    <>
    <div className='py-2'>
        <Col>
        <FormGroup>
            <Label for="form-label">
            Employee
            </Label>
            <Input
            type="select"
            >
            <option value='true'>True</option>
            <option value='false'>False</option>
            </Input>
        </FormGroup>
        </Col>
        <Row className='mb-1'>
        <Col md='6' sm='12' className='mb-1'>
            <Label className='form-label'>Percentage</Label>
            <Input
            type='number'
            defaultValue={0}
            onChange={() => e.target.value()}
            />
        </Col>
        <Col md='6' sm='12' className='mb-1'>
            <Label className='form-label'>Topper</Label>
            <Input
            type='number'
            defaultValue={0}
            onChange={() => e.target.value()}
            />
        </Col>

        </Row>
        <Col>
            <Button type='button' size='md' color='danger' className='mx-1' onClick={close}>Cancel</Button>
            <ButtonSpinner></ButtonSpinner>
        </Col>

    </div>
    </>
  )
}
