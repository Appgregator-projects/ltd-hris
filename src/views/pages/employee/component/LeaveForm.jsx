import { useEffect,useState } from "react"
import { Form,Row,Col,Button,Input,Table } from "reactstrap"
import ButtonSpinner from "../../components/ButtonSpinner"

export default function LeaveForm ({leave, close, balance, onSubmit, isLoading}) {

  const [formLeave, setFormLeave] = useState([])

  console.log(leave, "leave")
  console.log(balance, "balance")

  const generateForm = () => {
    if(leave.length && balance.length){
      const g = leave.map(x => {
        // console.log(x.name, "x")
        x.defaultValue = 0
        const check = balance.find(y => y.leave_id == x.id) 
        if(check){
          x.defaultValue = check.balance
          console.log(check.balance , "isinya apa")
        }
        return x
      })
      return setFormLeave([...g])
    }
    setFormLeave([...leave.map(x => {
      x.defaultValue = 0
      return x
    })])
  }
  useEffect(() => {
    generateForm()
  }, [leave, balance])

  const onChangeBalance = (e, index) => {
    const value = e.target.value
    // return console.log(value, "value onchange")
    const old = formLeave
    old[index].defaultValue = value
    return setFormLeave([...old])
  }

  const onSubmitForm = (arg) => {
    // return console.log(arg, "arg employee detail postleave")
    const params = {
      leaves:formLeave.map(x => {
        return{
          leave_id:x.id,
          balance:x.defaultValue
        }
      })
    }
    console.log(formLeave, "formleaves on submit form")
    console.log(params, "params on submit form")
    return onSubmit(params)
  }

  return(
    <>
        <Row>
          <Col lg="12">
            <Table responsive>
              <tbody>
                {
                  formLeave.map((x,index) => (
                    <tr key={x.id}>
                      <td>{x.name}</td>
                      <td>
                        <Input 
                        type="number" 
                        defaultValue={x.balance} 
                        min={0} 
                        onChange={(e)=>onChangeBalance(e,index)}/>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Col>
          <Col>
            <Button type="button" size="md" color='danger' className="mx-1" onClick={close}>Cancel</Button>
            <ButtonSpinner isLoading={isLoading} label="Submit" type="button" onClick={onSubmitForm}/>
          </Col>
        </Row>
    </>
  )
}

LeaveForm.defaultProps = {
  leave:[],
  isLoading:false
}