import React from 'react'

function AttandanceDetail({attendance}) {
    console.log(attendance, "attendance")
  return (
    <>
    <ul>
        <li className="d-flex justify-content-between pb-1">
            <span className="fw-bold">Day</span>
            <span className="capitalize">{attendance.dayname}</span>
        </li>
        <li className="d-flex justify-content-between pb-1">
            <span className="fw-bold">Date</span>
            <span className="capitalize">{attendance.periode}</span>
        </li>
        <li className="d-flex justify-content-between pb-1">
            <span className="fw-bold">Clock In </span>
            <span className="capitalize">{attendance.clock_in}</span>
        </li>
        <li className="d-flex justify-content-between pb-1">
            <span className="fw-bold">Clock out</span>
            <span className="capitalize">{attendance?.clock_out}</span>
        </li>
    </ul>
    {/* NO detail needed */}
    </>
  ) 
}

export default AttandanceDetail