export default function Divider({title}) {
  return (
    <div className='divider'>
      {title ? <div className='divider-text'>{title}</div> : '' }
    </div>
  )
}