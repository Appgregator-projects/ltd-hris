import React from 'react'
import Avatar from '../../../@core/components/avatar'
import { CardText, Row } from 'reactstrap'
import { User } from 'react-feather'

const PenaltyDetail = (item) => {
    console.log(item, "item")
  return (
    <>
    <div className="">
        <p className="h3 text-center">{item?.item.name}</p>
        <Row className='d-flex'>
        <p className='text-center sm-6'>{item?.item.email}</p>
        <p className='text-center'>{item?.item.division}</p>
        </Row>
        <div className='d-flex align-items-center justify-content-center'>
        <Avatar color="light-info" icon={<User size={24} />} className='me-1' />
        <h4 className='fw-bolder mb-0 me-1'></h4>
        <div className='my-auto'>
            <CardText className='font-small-3 mb-0 text-secondary'>Employees</CardText>
        </div>
        </div>
    </div>
    </>
  )
}

export default PenaltyDetail