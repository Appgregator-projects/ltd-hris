import React from 'react'
import { Button, Col, Row, Table } from 'reactstrap'
import ButtonSpinner from '../../../components/ButtonSpinner'
import { useState } from 'react'
import Api from '../../../../../sevices/Api'


const PenaltyForm = () => {
  const [penalty, setPenalty] = useState([])
  const [penaltyBalance, setBalance] = useState([])

  const fectPenalty = async() =>{
    try {
      const data = await Api.get('/hris/penalty-category')
    } catch (error) {
      
    }
  }
  return (
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

export default PenaltyForm