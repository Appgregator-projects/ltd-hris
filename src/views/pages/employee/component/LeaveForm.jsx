import { useEffect,useState } from "react"
import { Form,Row,Col,Button,Input,Table } from "reactstrap"
import ButtonSpinner from "../../components/ButtonSpinner"

export default function LeaveForm ({leave, close, balance, onSubmit, isLoading}) {

  const [formLeave, setFormLeave] = useState([])

  const generateForm = () => {
    if(balance.length){
      const g = leave.map(x => {
        x.defaultValue = 0
        const check = balance.find(y => y.leave_id == x.id) 
        if(check){
          x.defaultValue = check.balance
          console.log(x.defaultValue , "isinya apa")
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
    const old = formLeave
    console.log(old, "old")
    old[index].defaultValue = value
    return setFormLeave([...old])
  }


  const onSubmitForm = (arg) => {
    // console.log(arg, "onsubmitform")
    const params = {
      leaves:formLeave.map(x => {
        return{
          leave_id:x.id,
          balance:x.defaultValue
        }
      })
    }
    console.log(params, "onsubmitform")
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