import React from 'react'
import Avatar from '../../../@core/components/avatar'
import { CardText, Row } from 'reactstrap'
import { User } from 'react-feather'
import Api from "../../../sevices/Api"
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


const PenaltyDetail = ({item}) => {
    const [divisionUser, setDivisionUser] = useState([])
    const imageUrl = item.file

    const fetchDivision = async () =>{
      try {
        const {status,data} = await Api.get(`/hris/division/${item.users.division_id}`)
        if(status){
          setDivisionUser(data)
        }
      } catch (error) {
        throw error
      }
    }
  
    useEffect(() => {
      fetchDivision()
    }, [])
    
  return (
    <>
    <div className="">
        <p className="h3 text-center">Penalty type {item?.title}</p>
        <div className='text-center d-flex-column mb-1'>
          <Avatar color="light-info" icon={<User size={24} />} className='me-1' />
          <h4 className='fw-bolder mb-0 me-1'>{item?.users.name ? item.users?.name : "-"}</h4>
          <CardText className='font-small-3 mb-0 text-secondary'>{item?.users.email}</CardText>
          <h4 className='text-center my-2'>{item?.message}</h4>
          <a href={imageUrl} alt={"Attchment"} target="_blank" className='d-flex-column'>
            <img src={imageUrl} alt="Attachment" width="200" height="150"/>
          </a>
        </div>
    </div>
    </>
  )
}

export default PenaltyDetail