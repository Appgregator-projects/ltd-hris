import { ArrowLeft } from "react-feather"
import { Button } from "reactstrap"
import { useNavigate } from 'react-router-dom'
export default function BackButton({title}) {
  const navigate = useNavigate()
  return (
    <Button.Ripple size="sm" color='secondary' onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <span className='align-middle ms-25'>{title}</span>
    </Button.Ripple>
  )
}