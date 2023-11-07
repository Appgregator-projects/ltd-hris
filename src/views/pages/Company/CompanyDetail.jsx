import Avatar from '@components/avatar'
import { 
    CardText
} from 'reactstrap'
import { User,Trash } from 'react-feather'
import { readMore } from '../../../Helper/index'
import { capitalize } from 'lodash'

export default function CompanyDetail({item}){

    return (
        <>
        <div className="">
            <h3 className="h3 text-center">{capitalize(item?.name)}</h3>
            <h5 className='text-center'>NPWP : {item? item.company_npwp: " "}</h5>
            <h5 className='text-center'>Telpon : {item? item.phone_number: "-"}</h5>
            <h6 className='text-center mt-3'>{item? item.address: "-"}</h6>
        </div>
        </>
    )
}