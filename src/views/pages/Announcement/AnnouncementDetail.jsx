import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, Row } from 'reactstrap'

const AnnouncementDetail = ({item}) => {
  return (
    <>
    <Card>
      <CardHeader>
        <div className='d-flex flex-column my-0'>
          <h6 className='fw-bolder'>TITLE :</h6>
          <span>{item.title}</span>
        </div>
      </CardHeader>
      <CardBody>
        <div className='d-flex flex-column mb-2' >
          <h6 className='fw-bolder'>MESSAGE :</h6>
          <span>{item.message}</span>
        </div>
        <div>
          <Link className='pointer text-primary fs-md'
          to={item.url_file}
          >Attachment</Link>
        </div>
      </CardBody>
      {/* <CardFooter>

      </CardFooter> */}
    </Card>
    </>
  )
}

export default AnnouncementDetail