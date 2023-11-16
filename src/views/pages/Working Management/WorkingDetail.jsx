import React from 'react'
import Avatar from '../../../@core/components/avatar'
import { Badge, CardText, Col, Row } from 'reactstrap'
import { readMore } from '../../../Helper'
import { Trash, User } from 'react-feather'

const WorkingDetail = ({ item, close, assignee }) => {
  console.log(item, assignee, "difjowriefoiwrof")
  return (
    <>
      <div className="">
        <p className="h3 text-center">{item?.name}</p>
        <Col className='text-center'>
          <Row className='d-flex'>
            <Badge color='success'>{item.details?.productive_days} days productive</Badge>
            <Badge color='light-danger'>{item.details?.off_days} days off</Badge>
            <Badge className='' color='light-info'>{item?.type}</Badge>
          </Row>
          {/* <Row>
            <Badge color='light-success'>{item.details?.productive_detail ? item.details.productive_detail : "-"}</Badge>
            <Badge color='light-danger'>{item.details?.off_detail ? item.details.off_detail : "-"}</Badge>
          </Row> */}
        </Col>
        <div className='d-flex align-items-center justify-content-center mt-1'>
          <Avatar color="light-info" icon={<User size={24} />} className='me-1' />
          <h4 className='fw-bolder mb-0 me-1'>{assignee?.employee.length}</h4>
          <div className='my-auto'>
            <CardText className='font-small-3 mb-0 text-secondary'>Employees</CardText>
          </div>
        </div>
      </div>
      <h5 className='fw-bolder mb-0 me-1'>Employee lists</h5>
      <ul className='d-flex m-0 p-0 mt-1 flex-wrap'>
        {
          assignee?.employee.map((x, index) => (
            <li key={index} className="col-md-4 col-sm-12 p-0 m-0 list-none mb-1">
              <div className='d-flex justify-content-left align-items-center'>
                <Avatar
                  initials
                  className='me-1'
                  color="light-primary"
                  content={x?.name || ""}
                />
                <div className='d-flex flex-column'>
                  <span className='fw-bolder'>{readMore(x?.name, 20)}</span>
                  <small className='text-truncate text-muted mb-0'>{readMore(x?.id, 20)}</small>
                  <Trash className='me-50 text-primary pointer' size={13} /> <span className='align-middle'></span>
                </div>
              </div>
            </li>
          ))
        }
      </ul>
      {!assignee?.employee ? (<p className='text-center text-warning'>No Employee on this office</p>) : <></>}
    </>
  )
}

export default WorkingDetail