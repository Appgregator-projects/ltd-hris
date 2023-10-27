import React from 'react'
import Select from 'react-select'
import { Label } from 'reactstrap'
import makeAnimated from 'react-select/animated'
import AsyncSelect from 'react-select/async'


const FormProjectSelect = ({list, label, disabled, onSelect, close}) => {

  const animatedComponents = makeAnimated()
  return (
    <div className="py-2">
      <Label className='form-label' for='amount'>{label}</Label>
      <Select
        isDisabled={disabled}
        onChange={(e) => onSelect(e)}
        closeMenuOnSelect={close}
        components={animatedComponents}
        options={list}
      />
    </div>
  )
}

FormProjectSelect.defaultProps = {
  multiple : false,
  label : "Select Project",
  disabled : false
}

export default FormProjectSelect