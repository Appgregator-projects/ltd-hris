import React from 'react'
import { Link } from 'react-router-dom'
import { Badge } from 'reactstrap'

const MealDetail = ({item, close}) => {
  console.log(item, "detail")

  const renderStatus = (arg) => {
    // return console.log(arg, "arg status")
    if (!arg)
      return <Badge color="light-warning">Requested</Badge>;
    if (arg === "requested")
      return <Badge color="light-primary">Requested</Badge>;
    if (arg === "approve")
      return <Badge color="light-success">Approved</Badge>;
    if (arg === "reject")
      return <Badge color="light-danger">Rejected</Badge>;
    return <Badge color="light-info">Processed</Badge>;
  }

  return (
    <>
    <ul>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Name</span>
        <span className="capitalize">{item.item.users.name}</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Division</span>
        <span className="capitalize">{item.item.division_id}</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Level</span>
        <span className="capitalize">{item.item.users.title}</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Day</span>
        <span className="capitalize">{item.item.quantity} days</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Total Allowance</span>
        <span className="capitalize">Rp{item.item.total},-</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Status</span>
        <span className="capitalize">{renderStatus(item.item.status)}</span>
      </li>
      <li className="d-flex justify-content-between pb-1">
        <span className="fw-bold">Attachment</span>
        <span className="capitalize">
        <Link
          to={item.item ? item.item.attachment : "-"}
          target="_blank"
          >
          attachment
          </Link>
        </span>
      </li>
    </ul>
    </>
  )
}

export default MealDetail