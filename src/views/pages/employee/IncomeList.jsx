import React, { Fragment } from 'react'
import { Trash, Edit } from 'react-feather';
import {
     Card, CardBody, CardHeader, CardTitle, CardFooter, Button, Table
} from "reactstrap";
import { numberFormat } from '../../../Helper';


const IncomeList = ({ income, onDelete, onEditIncome }) => {
     return (
          <Card>
               <CardHeader>
                    <CardTitle>Employee Income</CardTitle>
               </CardHeader>
               <CardBody>
                    <Table responsive>
                         <thead>
                              <tr className="text-xs">
                                   <th className="fs-6">Type</th>
                                   <th className="fs-6">Label</th>

                                   <th className="fs-6">Amount</th>
                                   <th className="fs-6">Payroll Type</th>

                                   <th className="fs-6">Action</th>
                              </tr>
                         </thead>
                         <tbody>
                              {income ? income.map((x) => (
                                   <tr key={x.id}>
                                        <td>{x.type}</td>
                                        <td>{x.type === 'Allowance' ? (x.label_allowance ? x.label_allowance : '-') : 'Salary'}</td>

                                        <td>Rp {numberFormat(x.amount)},-</td>
                                        <td>{x.payroll_type}</td>
                                        <td>
                                             <Trash className="me-50 pointer" size={15} onClick={() => onDelete(x)}></Trash>
                                        </td>
                                   </tr>
                              )) :
                                   <tr>
                                        <td>This Employee has no income</td>
                                   </tr>
                              }
                         </tbody>
                    </Table>
               </CardBody>
               <CardFooter>
                    <Fragment>
                         <Button.Ripple
                              size="sm"
                              color="warning"
                              onClick={(e) => { e.preventDefault(); onEditIncome(income) }}
                         >
                              <Edit size={13} />
                              <span className="align-middle ms-25">Add Income</span>
                         </Button.Ripple>
                    </Fragment>
               </CardFooter>
          </Card>
     )
}

export default IncomeList