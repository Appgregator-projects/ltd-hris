import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from 'reactstrap'

const AnnouncementIndex = () => {

  const dummy = [
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
    {
      title : 'hari libur bermalas ria',
      message : "mari semua libur setahun, tapi abis itu kantornya udah gada y",
      start_time :  '23-09-2020',
      end_time : "22-09-2021",
      createdAd : "21-09-2023"
    },
  ]

  return (
    <>
      <Row>
        <Row>
          <Col xl='6' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle>Announcement</CardTitle>
                <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="3">
                  <Button color='warning' size='sm'>Add Announcement</Button>
                </Col>
              </CardHeader>
              <CardBody>
                <div className='info-list'>
                {dummy?.map((x) => {
                  return(
                      <ul className='list-unstyled'>
                        <li>
                          <span>{x.title}</span>
                        </li>
                      </ul>
                  )
                })}
                </div>

              </CardBody>
            </Card>
          </Col>
          <Col xl='6' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Employee Alert</CardTitle>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Row>
    </>
  )
}

export default AnnouncementIndex