import { useRef } from "react"
import { Button, Input, Label } from "reactstrap"

export default function FormIncome({ onSubmit }) {
  const nameRef = useRef()
  const amountRef = useRef()

  const handleSubmit = () => {
    const params = {
      name: nameRef.current.value,
      amount: amountRef.current.value
    }

    return onSubmit(params)
  }

  return (
    <>
      <div className="mb-2">
        <Label>Name</Label>
        <Input innerRef={nameRef} />
      </div>
      <div className="mb-2">
        <Label>Amount</Label>
        <Input defaultValue={0} innerRef={amountRef} />
      </div>
      <div className="">
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </>
  )
}
