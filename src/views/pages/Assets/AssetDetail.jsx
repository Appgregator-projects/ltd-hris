import React from 'react'
import { User } from 'react-feather'
import { CardText } from 'reactstrap'
import Avatar from '@components/avatar'


const AssetDetail = ({ asset, user, close, onSubmit }) => {
  console.log(asset, "isi asset")
  return (
    <>
      <div className="">
        <p className="h3 text-center">{asset?.users.name}</p>
        <p className='text-center'>{asset?.users.email}</p>
        <div className='d-flex align-items-center justify-content-center'>
          <Avatar color="light-info" icon={<User size={24} />} className='me-1' />
          <h4 className='fw-bolder mb-0 me-1'>{asset.users.division_id}</h4>
          <div className='my-auto'>
            <CardText className='font-small-3 mb-0 text-secondary'>Employees</CardText>
          </div>
        </div>
      </div>
      {/* <h5 className='fw-bolder mb-0 me-1'>Employee lists</h5>
        <ul className='d-flex m-0 p-0 mt-1 flex-wrap'>
            {
            item.employees.map((x, index) => (
            <li key={index} className="col-md-4 col-sm-12 p-0 m-0 list-none mb-1">
                <div className='d-flex justify-content-left align-items-center'>
                    <Avatar
                        initials
                        className='me-1'
                        color="light-primary"
                        content={x.employee?.name || ""}
                    />
                    <div className='d-flex flex-column'>
                        <span className='fw-bolder'>{readMore(x.employee?.name, 20)}</span>
                        <small className='text-truncate text-muted mb-0'>{readMore(x.employee?.email, 20)}</small>
                        <Trash className='me-50 text-primary pointer' size={13} onClick={() => onDeleteUser(x, index)}/> <span className='align-middle'></span>
                    </div>
                </div>
            </li>
            ))
        }
        </ul> */}
      {!asset ? (<p className='text-center text-warning'>No Employee on this office</p>) : <></>}
    </>
  )
}

export default AssetDetail