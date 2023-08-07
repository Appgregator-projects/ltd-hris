import Avatar from '@components/avatar'
import { 
    CardText
} from 'reactstrap'
import { User,Trash } from 'react-feather'
import { dateFormat, readMore } from '../../../Helper/index'

export default function ShiftDetail({item, onDeleteUser}){

    const renderEmployee = () => {
        if(!item.main_shift) {
            if(item.employees.length) return(
                <ul className='d-flex m-0 p-0 mt-1 flex-wrap'>
                    {
                        item.employees.map((x, index) => (
                        <li key={index} className="col-md-4 col-sm-12 p-0 m-0 list-none mb-1">
                            <div className='d-flex justify-content-left align-items-center'>
                                <Avatar
                                    initials
                                    className='me-1'
                                    color="light-primary"
                                    content={x.user.name}
                                />
                                <div className='d-flex flex-column'>
                                    <span className='fw-bolder'>{readMore(x.user.name, 20)}</span>
                                    <small className='text-truncate text-muted mb-0'>{readMore(x.user.email, 20)}</small>
                                    <Trash className='me-50 text-primary pointer' size={13} onClick={() => onDeleteUser(x, index)}/> <span className='align-middle'></span>
                                </div>
                            </div>
                        </li>
                        ))
                    }
                </ul>
            )

            return (<p className='text-center text-warning'>No Employee on this office</p>)
        }
        return <></>
    }
    return(
        <>
            <div className="">
                <p className="h3 text-center">{item.name}</p>
                <p className='text-center'>{item.office.name}</p>
                <p className='text-center'>
                    { !item.main_shift ? 
                           <> <small> Schedule : { dateFormat(item.start_date)}- {dateFormat(item.end_date)}</small><br/></>
                            : <></>
                    }
                    <small>{item.clock_in} | {item.clock_out}</small>
                </p>
                <div className='d-flex align-items-center justify-content-center'>
                <Avatar color="light-info" icon={<User size={24} />} className='me-1' />
                {
                    !item.main_shift ? 
                    <h4 className='fw-bolder mb-0 me-1'>{item.employees.length}</h4> : <></>
                }
                <div className='my-auto'>
                    <CardText className='font-small-3 mb-0 text-secondary'>{!item.main_shift ? '' : 'All'} Employees</CardText>
                </div>
                </div>
            </div>
            {
                !item.main_shift ? <>
                    <h5 className='fw-bolder mb-0 me-1'>Employee lists</h5>
                </> : <></>
            }
            {renderEmployee()}
        </>
    )
}