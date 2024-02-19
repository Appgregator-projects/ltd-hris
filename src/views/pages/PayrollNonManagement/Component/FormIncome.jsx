import { useRef } from "react"
import { Button, Input, Label } from "reactstrap"

export default function FormIncome({ onSubmit, type }) {
  const nameRef = useRef()
  const amountRef = useRef()

  const handleSubmit = () => {
    const params = {
      name: nameRef.current.value,
      amount: amountRef.current.value
    }

    return onSubmit(params, type)
  }

  return (
    <>
      <div className="mb-2">
        <Label>Name</Label>
        <Input innerRef={nameRef} />
      </div>
      <div className="mb-2">
        <Label>Amount</Label>
        <Input defaultValue={0} type="number" innerRef={amountRef} />
      </div>
      <div className="">
        <Button color="primary" onClick={handleSubmit}>Add</Button>
      </div>
    </>
  )
}
