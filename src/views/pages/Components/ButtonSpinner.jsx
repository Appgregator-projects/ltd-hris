import { 
  Spinner, Button
} from 'reactstrap'
export default function ButtonSpinner(props) {
  return (
    <Button disabled={props.isLoading} color={props.color} onClick={props.onClick} size={props.size} block={props.block} type={props.type}>
      {
        props.isLoading ? (
          <>
            <Spinner size='sm' type='grow' />
            <span className='ms-50'>Loading...</span>
          </>
        ) : props.label
      }
      
    </Button>
  )
}

ButtonSpinner.defaultProps = {
  color:'warning',
  isLoading:false,
  label:'Button',
  block:false,
  type:'button',
  size:'md'
}