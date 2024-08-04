// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import { Card, CardBody, Button, Label, Row, Input } from "reactstrap";
import toast from "react-hot-toast";
import { useState } from "react";
import { setDocumentFirebase } from "../../../sevices/FirebaseApi";





async function handleSubmit(data, type, id, approve, navigate) {
     let user = JSON.parse(localStorage.getItem("userData"));
     let result = ''
     let newData = {}

     let objData = { ...data };
     if (objData?.isRealization) {
          if (user?.attributes?.level === 'Manager' && user?.user?.departement_id !== 42) {
               objData = { ...objData, manager_id: user?.name, status: 'Waiting in HRGA' }
          } else if (user?.user?.departement_id === 17 || user?.user?.departement_id === 26) {
               objData = { ...objData, hrga_id: user?.name, status: 'Waiting Realization in Finance' }
          } else {
               objData = { ...objData, real_finance_id: user?.name, status: 'Approved' }
          }
     } else {
          if (user?.attributes?.level === 'Manager' && user?.user?.departement_id !== 42) {
               objData = { ...objData, manager_id: user?.name, status: 'Waiting in HRGA', isRealization: false }
          } else if (user?.user?.departement_id === 17 || user?.user?.departement_id === 26) {
               objData = { ...objData, hrga_id: user?.name, status: 'Waiting in Finance', isRealization: false }
          } else if (user?.user?.departement_id === 42) {
               objData = { ...objData, finance_id: user?.name, status: 'Waiting for Realization', isRealization: true }
          }
     }

     try {
          if ((approve.approval === 'Rejected')) {
               newData = { ...objData, isRejected: true, status: "Waiting in Head", notes: approve.notes, manager_id: '', finance_id: '', hrga_id: '', rejected_by: user.name }
               result = await setDocumentFirebase(type, id, newData)
               console.log('1')
          }
          else {
               newData = { ...objData, isRejected: false }
               result = await setDocumentFirebase(type, id, newData)
               console.log('3')
          }

          if (result) {
               navigate(-1)
               return toast.success("This invoice has been updated.", {
                    position: "top-center",
               });
          } else {
               return toast.error("error", {
                    position: "top-center",
               });
          }

     } catch (error) {
          return toast.error(error.message, {
               position: "top-center",
          });
     }
}

const PreviewActions = ({
     id,
     itemData,
     data,
}) => {
     let user = JSON.parse(localStorage.getItem("userData"));
     const type = 'sppd'
     console.log(data, "data")
     const [approve, setApprove] = useState({ approval: 'Rejected', notes: '' })
     const navigate = useNavigate()

     const handleClick = () => {
          localStorage.setItem('invoiceData', JSON.stringify(data));
          window.open("/apps/invoice/print", "_blank");
     };

     return (
          <Card className="invoice-action-wrapper">
               <CardBody>
                    {/* <Button color='primary' block className='mb-75' onClick={() => setSendSidebarOpen(true)}>
          Send Invoice
        </Button>
        <Button color='secondary' block outline className='mb-75'>
          Download
        </Button> */}
                    <Button
                         color="secondary"
                         // tag={Link}
                         // to={{
                         //      pathname: "/apps/invoice/print",
                         //      state: data,
                         // }}
                         onClick={handleClick}
                         // to="/apps/invoice/print"
                         // target="_blank"
                         block
                         outline
                         className="mb-75"
                    >
                         Print
                    </Button>
                    {location.pathname.split('/')[2] === 'invoice' ? null : (
                         <>
                              {((user?.attributes?.level === "Manager" && data?.status?.includes("Head") && user?.user?.departement_id !== 42) ||
                                   ((user?.user?.departement_id === 17 || user?.user?.departement_id === 26) && data?.status?.includes("HRGA")) ||
                                   (user?.user?.departement_id === 42 && data?.status?.includes("Finance"))) ? (
                                   <>
                                        <Row className="mb-1">
                                             <Label style={{ fontWeight: 'bold' }}>Notes</Label>
                                             <textarea onChange={(e) => setApprove({ ...approve, notes: e.target.value })} />
                                        </Row>
                                        <Input
                                             type="select"
                                             id="select-plan"
                                             name="select-plan"
                                             className="mb-1"
                                             onChange={(e) => setApprove({ ...approve, approval: e.target.value })}
                                        >
                                             <option value="Rejected">Rejected</option>
                                             <option value="Approved">Approved</option>
                                        </Input>
                                   </>
                              ) : null}
                              {((user?.attributes?.level === "Manager" && data?.status?.includes("Head") && user?.user?.departement_id !== 42) ||
                                   ((user?.user?.departement_id === 17 || user?.user?.departement_id === 26) && data?.status?.includes("HRGA")) ||
                                   (user?.user?.departement_id === 42 && data?.status?.includes("Finance"))) ? (
                                   <Button
                                        color="success"
                                        onClick={() => handleSubmit(data, type, id, approve, navigate)}
                                        block
                                        className="mb-75"
                                   >
                                        Submit
                                   </Button>
                              ) : null}
                         </>
                    )}

               </CardBody>
          </Card>
     );
};

export default PreviewActions;
