import Avatar from '@components/avatar'
import { 
    CardText
} from 'reactstrap'
import { User,Trash } from 'react-feather'
import { readMore } from '../../../Helper/index'

export default function CompanyDetail({item}){


    console.log(item, "item Company detail")
    return (
        <>
        <div className="">
            <p className="h3 text-center">{item?.name}</p>
            <p className='text-center'>{item? item.company_npwp: " "}</p>
            <p className='text-center'>{item? item.address: "-"}</p>
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