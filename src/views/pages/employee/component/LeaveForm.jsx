import { useEffect,useState } from "react"
import { Form,Row,Col,Button,Input,Table } from "reactstrap"
import ButtonSpinner from "../../components/ButtonSpinner"

export default function LeaveForm ({leave, close, balance, onSubmit, isLoading}) {

  const [formLeave, setFormLeave] = useState([])
  console.log(balance,"balance")
  console.log(leave,"leave")

  const generateForm = () => {
    if(balance?.length && leave.length){
      const g = leave?.map(x => {
        x.defaultValue = 0
        const check = balance?.find(y => y.leave_category_id ===  x.id) 
        console.log(check, "check")
        if(check !== null){
          x.defaultValue = check ? check?.balance : 0
        }
        return x
      })  
      console.log(g, "G")
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
    const old = formLeave
    old[index].defaultValue = value
    return setFormLeave([...old])
  }

  console.log(formLeave, "lalal")

  const onSubmitForm = (arg) => {
    const params = {
      leaves:formLeave?.map(x => {
        const check = leave.find(y => y.id == x.id) 
        const current = check.initial_balance - x.defaultValue
        if(current >= 0){
          return{
            leave_id:x.id,
            balance:current
          }
        }
        return{
          leave_id:x.id,
          balance: check.initial_balance
        }
      })
    }
    console.log(params, "kakakak")
    return onSubmit(params)
  }

  return(
    <>
        <Row>
          <Col lg="12">
            <Table responsive>
              <tbody>
                {
                  formLeave?.map((x,index) => (
                    <tr key={x.id}>
                      <td>{x.name}</td>
                      <td>
                        <Input 
                        type="number" 
                        defaultValue={x.defaultValue} 
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