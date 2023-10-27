import React from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Avatar from '../../../@core/components/avatar'
import { capitalize } from 'lodash'

const ReimburseDetail = ({item, close}) => {
  return (
    <>
    <Col className='d-flex justify-content-between'>
      <Row className='date'>
        <h1>{item.periode}</h1>
        <div className='w-25 mt-2 d-flex-column align-items-center'>
          <div className='mb-2 d-flex-column align-items-center'>
            <h4>Project :</h4>
            <span>{item.project_number}</span>
          </div>
          <div className='h-25 d-flex-column align-items-center' >
            <h4>Manager :</h4>
            <span className='fst-italic'>{item.manager_uid ? item.manager.name : "Manager unknown"}</span>
          </div>
        </div>
        <Col className='w-50 mx-1'>
          {item.details?.map((x) => (
              <img
                height='80'
                width='60'
                alt={x.name}
                src={x.image}
                className='img-fluid rounded mx-1 my-2'		
              />        
            )
          )}
        </Col>
      </Row>
    </Col>
    </>
  )
}

export default ReimburseDetail