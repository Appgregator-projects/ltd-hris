import { Spinner } from "reactstrap"
export default function CardLoader({open}) {
  return open ? (
    <div className="card-loader">
      <Spinner color='light' style={{
        height: '3rem',
        width: '3rem'
      }} />
    </div>
  ) : <></>
}