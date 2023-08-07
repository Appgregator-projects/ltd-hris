import { memo } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Label } from 'reactstrap'
const animatedComponents = makeAnimated()
function FormUserAssign({options, onSelect, multiple, label,disabled}) {
  return (
    <div className="py-2">
      <Label className='form-label' for='amount'>{label}</Label>
      <Select
        isDisabled={disabled}
        onChange={(e) => onSelect(e)}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti={multiple}
        options={options}
      />
    </div>
  )
}

FormUserAssign.defaultProps = {
  multiple:true,
  label:'Select user',
  disabled:false
}

export default memo(FormUserAssign)