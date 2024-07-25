// ** React Imports
import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, Alert } from "reactstrap";

// ** Invoice Preview Components

// import AddPaymentSidebar from "../shared-sidebar/SidebarAddPayment";
// import SendInvoiceSidebar from "../shared-sidebar/SidebarSendInvoice";

// ** Styles
import "@styles/base/pages/app-invoice.scss";

// import ButtonBack from "../../../../@core/components/back-button/ButtonBack";
import PreviewActions from "./Actions";
import PreviewCard from "./DraftCard";
import moment from "moment";
import { getSingleDocumentFirebase } from "../../../sevices/FirebaseApi";


// ** Services

const InvoicePreviewSPPD = () => {
     // ** HooksVars
     const { id, companyId } = useParams();
     const location = useLocation();
     const [listDetail, setListDetail] = useState([]);
     const [itemData, setItemData] = useState([]);
     const [sendSidebarOpen, setSendSidebarOpen] = useState(false);
     const [addPaymentOpen, setAddPaymentOpen] = useState(false);


     const GetDetailPurchInvById = async (id) => {
          let result = "";
          // if (location?.["state"]?.["type"] === "CashAdv") {
          //      let arr = await serviceGetDownPaymentOutstandingById(id);
          //      result = { accurate: arr, data: arr };
          // } else {
          //      // result = await getDetailPurchaseInvById(id);
          // }
          result = await getSingleDocumentFirebase('sppd', id)
          setListDetail(result)
          // setListDetail({
          //      "vendorName": "John Doe",
          //      "sppdNumber": "SPPD001",
          //      "description": "Business trip to Jakarta",
          //      "location": "Jakarta",
          //      "transportation": "Plane",
          //      "driver": "N/A",
          //      "number": 5000,
          //      "status": "Waiting for Realization",
          //      "createdBy": "Admin",
          //      "approvedBy": "Manager",
          //      "checkedBy": "HR",
          //      "financeBy": "Finance Dept",
          //      "realization": 4800,
          //      "createdAt": "2024-06-01",
          //      "vendorNo": "002",
          //      "branchId": "Kantor Pusat",
          //      "accountName": "Keira Renata",
          //      "accountNo":"55435267",
          //      "bankName":"BCA",
          //      "member":
          //      [{name: "Nadira Devara",gender:"P",days:5,department:"IT",level:"staff"}],
          //      rundown:[{
          //           date: moment().format(
          //                "D MMMM YYYY"
          //           ),
          //           location: "Bandung",
          //           description:"playing"
          //      }],
          //      head:[{td:"Uang Dinas Level:", style:"bold"},{td:"Non Staff"},{td:"Staff"},{td:"SPV"},{td:"Hotel:", style:"bold"},{td:'Peserta Dinas'},{td:'Driver'},{td: "Akomodasi:", style:"bold"},{td:"Darat: Bensin, Toll, Parkir"},{td:"Tiket"},{td:"Taxi/Ojek"},{td:"Lain-lain",style:"bold"},{td:'TOTAL KEBUTUHAN DANA',style:'bold'}],
          //      realization: [{ td: "Uang Dinas Level:", style: "bold" }, { td: "Non Staff" }, { td: "Staff" }, { td: "SPV" }, { td: "Hotel:", style: "bold" }, { td: 'Peserta Dinas' }, { td: 'Driver' }, { td: "Akomodasi:", style: "bold" }, { td: "Darat: Bensin, Toll, Parkir" }, { td: "Tiket" }, { td: "Taxi/Ojek" }, { td: "Lain-lain", style: "bold" }, { td: 'TOTAL KEBUTUHAN DANA', style: 'bold' }],
          // },);
     };

     // ** Get purchase requisition on mount based on id

     useEffect(() => {
          // GetDetailPurchInvByDealId();
          GetDetailPurchInvById(id);
     }, []);

     const currentItemStatus = useCallback(
          async (data) => {
               setItemData(data);
          },
          [setItemData]
     );

     console.log(listDetail, "ini list detail")

     return listDetail !== undefined ? (
          <div className="invoice-preview-wrapper">
               {/* <ButtonBack /> */}
               <Row className="invoice-preview">
                    <Col xl={9} md={8} sm={12}>
                         <PreviewCard
                              data={listDetail}
                              approvalHidden={location?.["state"]?.["approvalHidden"]}
                              item={location?.["state"]?.["item"]}
                              currentItemStatus={currentItemStatus}
                              type={location?.["state"]?.["type"]}
                         />
                    </Col>
                    <Col xl={3} md={4} sm={12}>
                         <PreviewActions
                              id={id}
                              // setSendSidebarOpen={setSendSidebarOpen}
                              setAddPaymentOpen={setAddPaymentOpen}
                              approvalHidden={location?.["state"]?.["approvalHidden"]}
                              item={location?.["state"]?.["item"]}
                              itemData={itemData}
                              data={listDetail}
                         />
                    </Col>
               </Row>
               {/* <SendInvoiceSidebar toggleSidebar={toggleSendSidebar} open={sendSidebarOpen} />
      <AddPaymentSidebar toggleSidebar={toggleAddSidebar} open={addPaymentOpen} /> */}
          </div>
     ) : (
          <>
               {/* <ButtonBack /> */}
               <Alert color="danger">
                    <h4 className="alert-heading">Invoice not found</h4>
                    <div className="alert-body">
                         Invoice with id: {id} doesn't exist. Check list of all invoices:{" "}
                         <Link to="/apps/invoice/list">Invoice List</Link>
                    </div>
               </Alert>
          </>
     );
};

export default InvoicePreviewSPPD;
