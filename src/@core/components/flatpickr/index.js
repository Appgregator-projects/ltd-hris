import React from 'react'
import { Col } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
// ** Third Party Components
import Flatpickr from 'react-flatpickr'

const DateRange = ({ picker, setPicker }) => {
     return (
          <Col className='mb-1'>
               <Flatpickr
                    value={picker}
                    id='range-picker'
                    className='form-control'
                    onChange={date => setPicker(date)}
                    options={{
                         mode: 'range',
                         defaultDate: ['2020-02-01', '2020-02-15']
                    }}
               />
          </Col>
     )
}

export default DateRange