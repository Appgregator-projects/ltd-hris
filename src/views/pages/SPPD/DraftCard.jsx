// ** Reactstrap Imports
import {
     Card,
     CardBody,
     CardText,
     Row,
     Col,
     Table,
     Badge,
     Spinner,
     Input,
     Modal,
     ModalHeader,
     ModalBody,
     Button,
} from "reactstrap";

import Select from "react-select";
import { selectThemeColors } from "@utils";

import moment from "moment"
import { rupiah } from "../../../Helper";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const PreviewCard = ({ data, approvalHidden, currentItemStatus }) => {
     const location = useLocation()

     const [show, setShow] = useState({ file: false, index: null, attachment: null })

     console.log(location, "locloc")
     const allNonNull = (tdArray) => tdArray.every(item => item !== null);

     const calculateTotal = (category) => {
          if (category.price && category.qty && !isNaN(category.price) && !isNaN(category.qty)) {
               return parseFloat(category.price) * parseFloat(category.qty);
          }
          return 0;
     };

     // Calculate the total sum for "other" category
     const realTotal = data?.realization?.other?.reduce((acc, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseFloat(item.qty) || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0) || 0;

     // Calculate the total sum for other categories excluding "other"
     const realizationTotal = data?.realization ? Object.entries(data.realization).reduce((acc, [key, category]) => {
          if (key !== 'other') {
               acc += calculateTotal(category);
          }
          return acc;
     }, 0) : 0;

     // Calculate the total sum for "other" category
     const needsTotal = data?.accomodation?.other?.reduce((acc, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseFloat(item.qty) || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0) || 0;

     // Calculate the total sum for other categories excluding "other"
     const accomodationTotal = data?.accomodation ? Object.entries(data.accomodation).reduce((acc, [key, category]) => {
          if (key !== 'other') {
               acc += calculateTotal(category);
          }
          return acc;
     }, 0) : 0;


     // Calculate the total sum of everything
     const totalRealization = realTotal + realizationTotal;
     const totalAccomodation = needsTotal + accomodationTotal


     const parseCurrency = value => parseFloat(value?.replace(/\./g, ""));

     const parseValue = value => {
          if (typeof value === 'string') {
               return value ? parseCurrency(value) : 0;
          }
          return value || 0;
     };


     const output = [
          { value: "APPROVED", label: "APPROVED" },
          { value: "REJECTED", label: "REJECTED" },
     ];

     return data ? (
          <Card className="invoice-preview-card">
               <CardBody className="invoice-padding pb-0">
                    {/* Header */}
                    <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                         <div>
                              <div className="logo-wrapper">
                                   <svg viewBox="0 0 139 95" version="1.1" height="24">
                                        <defs>
                                             <linearGradient
                                                  id="invoice-linearGradient-1"
                                                  x1="100%"
                                                  y1="10.5120544%"
                                                  x2="50%"
                                                  y2="89.4879456%"
                                             >
                                                  <stop stopColor="#000000" offset="0%"></stop>
                                                  <stop stopColor="#FFFFFF" offset="100%"></stop>
                                             </linearGradient>
                                             <linearGradient
                                                  id="invoice-linearGradient-2"
                                                  x1="64.0437835%"
                                                  y1="46.3276743%"
                                                  x2="37.373316%"
                                                  y2="100%"
                                             >
                                                  <stop
                                                       stopColor="#EEEEEE"
                                                       stopOpacity="0"
                                                       offset="0%"
                                                  ></stop>
                                                  <stop stopColor="#FFFFFF" offset="100%"></stop>
                                             </linearGradient>
                                        </defs>
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                             <g transform="translate(-400.000000, -178.000000)">
                                                  <g transform="translate(400.000000, 178.000000)">
                                                       <path
                                                            className="text-primary"
                                                            d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                                                            style={{
                                                                 fill: "currentColor",
                                                            }}
                                                       ></path>
                                                       <path
                                                            d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                                                            fill="url(#invoice-linearGradient-1)"
                                                            opacity="0.2"
                                                       ></path>
                                                       <polygon
                                                            fill="#000000"
                                                            opacity="0.049999997"
                                                            points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                                                       ></polygon>
                                                       <polygon
                                                            fill="#000000"
                                                            opacity="0.099999994"
                                                            points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                                                       ></polygon>
                                                       <polygon
                                                            fill="url(#invoice-linearGradient-2)"
                                                            opacity="0.099999994"
                                                            points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                                                       ></polygon>
                                                  </g>
                                             </g>
                                        </g>
                                   </svg>
                                   <h3 className="text-primary invoice-logo">Lifetime Design</h3>
                              </div>
                              <CardText className="mb-25">
                                   Lifetime Design,
                              </CardText>
                              <CardText className="mb-25">
                                   Jl. Kemang Timur No.25, RT.7/RW.4
                              </CardText>
                              <CardText className="mb-0">
                                   0811-1256-162
                              </CardText>
                         </div>
                         <div className="mt-md-0 mt-2">
                              <h4 className="invoice-title">
                                   SPPD
                                   <span className="invoice-number">#{data["nomorSurat"]}</span>
                              </h4>
                              <div className="invoice-date-wrapper">
                                   <p className="invoice-date-title">Date Issued:</p>
                                   <p className="invoice-date">	{moment(data?.createdAtInt).format('DD MMMM YYYY')}</p>
                              </div>
                              <div className="invoice-date-wrapper">
                                   <p className="invoice-date-title">Status:</p>
                                   <p className="invoice-date">
                                        <Badge pill color={data?.status === "Approved" ? "success" : data?.status === "Rejected" ? "danger" : data?.status?.includes("for") ? "warning" : "primary"}>
                                             {data?.status}
                                        </Badge>
                                   </p>
                              </div>
                         </div>
                    </div>
                    {/* /Header */}
               </CardBody>

               <hr className="invoice-spacing" />

               {/* Address and Contact */}
               <CardBody className="invoice-padding pt-0">
                    <Row className="invoice-spacing">
                         {/* <Row> */}
                         <Col className="p-0" xl="4 ">
                              <h6 className="mb-2">Description:</h6>
                              <CardText className="mb-25">{data?.reason?.length > 0 ? data?.reason?.join(', ') : data?.reason}</CardText>
                         </Col>
                         <Col className="p-0" xl="4 ">
                              <h6 className="mb-2">Location:</h6>
                              <CardText className="mb-25">{data?.address1} {data?.address2 ? `and ${data?.address2}` : null}</CardText>
                         </Col>
                         {/* </Row> */}

                         {/* <Col className="p-0" xl="4">
                              <h6 className="mb-2">Vendor</h6>
                              <CardText className="mb-25">{data["vendorName"]}</CardText>
                              <CardText className="mb-25">{data["vendorNo"]}</CardText>
                         </Col> */}

                         <Col className="p-0 mt-xl-0 mt-2" xl="4">
                              <h6 className="mb-2">Payment Details:</h6>
                              <table>
                                   <tbody>
                                        <tr>
                                             <td className="pe-1">Account Name:</td>
                                             <td>
                                                  {data?.bankAccountName}
                                             </td>
                                        </tr>
                                        <tr>
                                             <td className="pe-1">Account Number:</td>
                                             <td>
                                                  {data?.bankAccountNumber}
                                             </td>
                                        </tr>
                                        <tr>
                                             <td className="pe-1">Bank Name:</td>
                                             <td>
                                                  {data?.bankName}
                                             </td>
                                        </tr>
                                   </tbody>
                              </table>
                         </Col>
                    </Row>
                    {/* /Address and Contact */}

                    {/* Invoice Description */}

                    <h6>RUNDOWN</h6>
                    <Table responsive>
                         <thead>
                              <tr>
                                   <th className="th-lg">
                                        <div>No</div>
                                   </th>
                                   <th>
                                        {" "}
                                        <div style={{ width: "150px" }}>Tanggal</div>
                                   </th>
                                   <th>
                                        <div style={{ width: "150px" }}>Lokasi</div>
                                   </th>

                                   <th>
                                        <div style={{ width: "150px" }}>Agenda</div>
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              {data?.rundown?.map((item, id) => (
                                   <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>{moment(item?.date).format('DD MMMM YYYY HH:mm')}</td>
                                        <td>{item?.location}</td>
                                        <td>{item?.description}</td>
                                   </tr>
                              ))}
                         </tbody>
                    </Table>
                    <hr className="invoice-spacing" />
                    <h6>MEMBER</h6>
                    <Table responsive>
                         <thead>
                              <tr>
                                   <th className="th-lg">
                                        <div>No</div>
                                   </th>
                                   <th>
                                        {" "}
                                        <div style={{ width: "150px" }}>Nama</div>
                                   </th>
                                   <th>
                                        <div style={{ width: "150px" }}>L/P</div>
                                   </th>

                                   <th>
                                        <div style={{ width: "150px" }}>Department</div>
                                   </th>
                                   <th>
                                        <div style={{ width: "150px" }}>Level</div>
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              {data?.member?.map((item, id) => (
                                   <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.gender}</td>
                                        <td>{item?.department}</td>
                                        <td>{item?.level}</td>
                                   </tr>
                              ))}
                         </tbody>

                    </Table>
                    {(data?.amount !== 0 && data?.status?.includes('Finance') || data?.isRealization) ? <>
                         <hr className="invoice-spacing" />
                         <h6>ALLOCATIONS</h6>

                         <Table responsive>
                              <thead>
                                   <tr>
                                        <th className="th-lg">
                                             <div style={{ width: "150px" }}>Keterangan</div>
                                        </th>
                                        <th>
                                             {" "}
                                             <div style={{ width: "150px" }}>Harga Satuan</div>
                                        </th>
                                        <th>
                                             <div style={{ width: "150px" }}>QTY</div>
                                        </th>

                                        <th>
                                             <div style={{ width: "150px" }}>Jumlah</div>
                                        </th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td>Uang dinas, level:</td>
                                   </tr>
                                   <tr>
                                        <td>Non Staff</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.dinasNonStaff?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.dinasNonStaff?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.dinasNonStaff?.price * data?.accomodation?.dinasNonStaff?.qty) ? data?.accomodation?.dinasNonStaff?.price * data?.accomodation?.dinasNonStaff?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>SPV</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.dinasSpv?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.dinasSpv?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.dinasSpv?.price * data?.accomodation?.dinasSpv?.qty) ? data?.accomodation?.dinasSpv?.price * data?.accomodation?.dinasSpv?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Manager Additional breakfast (jika tidak include hotel)</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.dinasManager?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.dinasManager?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.dinasManager?.price * data?.accomodation?.dinasManager?.qty) ? data?.accomodation?.dinasManager?.price * data?.accomodation?.dinasManager?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Hotel:</td>
                                   </tr>
                                   <tr>
                                        <td>Peserta Dinas</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.hotelMember?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.hotelMember?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.hotelMember?.price * data?.accomodation?.hotelMember?.qty) ? data?.accomodation?.hotelMember?.price * data?.accomodation?.hotelMember?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Driver</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.hotelDriver?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.hotelDriver?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.hotelDriver?.price * data?.accomodation?.hotelDriver?.qty) ? data?.accomodation?.hotelDriver?.price * data?.accomodation?.hotelDriver?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Akomodasi</td>
                                   </tr>
                                   <tr>
                                        <td>Darat: Bensin, Toll, Parkir</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.akomodasiDarat?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.akomodasiDarat?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.akomodasiDarat?.price * data?.accomodation?.akomodasiDarat?.qty) ? data?.accomodation?.akomodasiDarat?.price * data?.accomodation?.akomodasiDarat?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Tiket Kereta/ Kapal/ Pesawat</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.akomodasiTiket?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.akomodasiTiket?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.akomodasiTiket?.price * data?.accomodation?.akomodasiTiket?.qty) ? data?.accomodation?.akomodasiTiket?.price * data?.accomodation?.akomodasiTiket?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Taxi/ Ojek</td>
                                        <td>
                                             {rupiah(parseValue(data?.accomodation?.akomodasiTaxi?.price))}
                                        </td>
                                        <td>
                                             {data?.accomodation?.akomodasiTaxi?.qty}
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(data?.accomodation?.akomodasiTaxi?.price * data?.accomodation?.akomodasiTaxi?.qty) ? data?.accomodation?.akomodasiTaxi?.price * data?.accomodation?.akomodasiTaxi?.qty : 0)}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td>Lain-lain</td>
                                   </tr>
                                   {data?.accomodation?.other?.map((item, id) => {
                                        return (
                                             <tr key={id}>
                                                  <td>{item?.title}</td>
                                                  <td>{rupiah(parseValue(item?.price))}</td>
                                                  <td>{item?.qty}</td>
                                                  <td>
                                                       {rupiah(!isNaN(parseValue(item?.price) * item?.qty) ? parseValue(item?.price) * item?.qty : 0)}
                                                  </td>
                                             </tr>
                                        )
                                   })}

                              </tbody>
                              <tfoot>
                                   <tr>
                                        <td>
                                             TOTAL KEBUTUHAN DANA
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>{rupiah(totalAccomodation)}</td>
                                   </tr>
                              </tfoot>
                         </Table>
                    </> : null}

                    {((data?.amount !== 0 && data?.status?.includes('Finance') && data?.isRealization) || data?.status === 'Approved') ?
                         <>
                              <hr className="invoice-spacing" />
                              <h6>REALIZATION</h6>
                              <Table responsive>
                                   <thead>
                                        <tr>
                                             <th className="th-lg">
                                                  <div style={{ width: "150px" }}>Keterangan</div>
                                             </th>
                                             <th>
                                                  {" "}
                                                  <div style={{ width: "150px" }}>Harga Satuan</div>
                                             </th>
                                             <th>
                                                  <div style={{ width: "150px" }}>QTY</div>
                                             </th>

                                             <th>
                                                  <div style={{ width: "150px" }}>Jumlah</div>
                                             </th>
                                             {location.pathname.split('/')[2] === 'draft' ? <th>
                                                  <div style={{ width: "150px" }}>Attachment</div>
                                             </th> : null}
                                        </tr>
                                   </thead>
                                   <tbody>
                                        <tr>
                                             <td>Uang dinas, level:</td>
                                        </tr>
                                        <tr>
                                             <td>Non Staff</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.dinasNonStaff?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.dinasNonStaff?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.dinasNonStaff?.price * data?.realization?.dinasNonStaff?.qty) ? data?.realization?.dinasNonStaff?.price * data?.realization?.dinasNonStaff?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.dinasNonStaff?.attachment && data?.realization?.dinasNonStaff?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: "Uang Dinas Non Staff",
                                                                      image: data?.realization?.dinasNonStaff?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>SPV</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.dinasSpv?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.dinasSpv?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.dinasSpv?.price * data?.realization?.dinasSpv?.qty) ? data?.realization?.dinasSpv?.price * data?.realization?.dinasSpv?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.dinasSpv?.attachment && data?.realization?.dinasSpv?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: "Uang Dinas SPV",
                                                                      image: data?.realization?.dinasSpv?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Manager Additional breakfast (jika tidak include hotel)</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.dinasManager?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.dinasManager?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.dinasManager?.price * data?.realization?.dinasManager?.qty) ? data?.realization?.dinasManager?.price * data?.realization?.dinasManager?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.dinasManager?.attachment && data?.realization?.dinasManager?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: "Uang Dinas Manager",
                                                                      image: data?.realization?.dinasManager?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Hotel:</td>
                                        </tr>
                                        <tr>
                                             <td>Peserta Dinas</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.hotelMember?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.hotelMember?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.hotelMember?.price * data?.realization?.hotelMember?.qty) ? data?.realization?.hotelMember?.price * data?.realization?.hotelMember?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.hotelMember?.attachment && data?.realization?.hotelMember?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: "Hotel Peserta Dinas",
                                                                      image: data?.realization?.hotelMember?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Driver</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.hotelDriver?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.hotelDriver?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.hotelDriver?.price * data?.realization?.hotelDriver?.qty) ? data?.realization?.hotelDriver?.price * data?.realization?.hotelDriver?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.hotelDriver?.attachment && data?.realization?.hotelDriver?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: "Hotel Driver",
                                                                      image: data?.realization?.hotelDriver?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Akomodasi</td>
                                        </tr>
                                        <tr>
                                             <td>Darat: Bensin, Toll, Parkir</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.akomodasiDarat?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.akomodasiDarat?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.akomodasiDarat?.price * data?.realization?.akomodasiDarat?.qty) ? data?.realization?.akomodasiDarat?.price * data?.realization?.akomodasiDarat?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.akomodasiDarat?.attachment && data?.realization?.akomodasiDarat?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,

                                                                      title: item.expenseNotes,
                                                                      image: data?.realization?.akomodasiDarat?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Tiket Kereta/ Kapal/ Pesawat</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.akomodasiTiket?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.akomodasiTiket?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.akomodasiTiket?.price * data?.realization?.akomodasiTiket?.qty) ? data?.realization?.akomodasiTiket?.price * data?.realization?.akomodasiTiket?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.akomodasiTiket?.attachment && data?.realization?.akomodasiTiket?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,
                                                                      index: index,
                                                                      title: "Akomodasi Tiket",
                                                                      image: data?.realization?.akomodasiTiket?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Taxi/ Ojek</td>
                                             <td>
                                                  {rupiah(parseValue(data?.realization?.akomodasiTaxi?.price))}
                                             </td>
                                             <td>
                                                  {data?.realization?.akomodasiTaxi?.qty}
                                             </td>
                                             <td>
                                                  {rupiah(!isNaN(data?.realization?.akomodasiTaxi?.price * data?.realization?.akomodasiTaxi?.qty) ? data?.realization?.akomodasiTaxi?.price * data?.realization?.akomodasiTaxi?.qty : 0)}
                                             </td>
                                             {location.pathname.split('/')[2] === 'draft' ? <td>
                                                  {data?.realization?.akomodasiTaxi?.attachment && data?.realization?.akomodasiTaxi?.attachment?.length > 0 ? (
                                                       <a
                                                            className="text-primary"
                                                            onClick={() =>
                                                                 setShow({
                                                                      ...show,
                                                                      file: true,
                                                                      title: 'Akomodasi Taxi',
                                                                      image: data?.realization?.akomodasiTaxi?.attachment
                                                                 })
                                                            }
                                                       >
                                                            <Badge color="info">Show file</Badge>
                                                       </a>
                                                  ) : (
                                                       <a>
                                                            {" "}
                                                            <Badge color="primary">No Attachment</Badge>
                                                       </a>
                                                  )}
                                             </td> : null}
                                        </tr>
                                        <tr>
                                             <td>Lain-lain</td>
                                        </tr>
                                        {data?.realization?.other?.map((item, id) => {
                                             return (
                                                  <tr key={id}>
                                                       <td>{item?.title}</td>
                                                       <td>{rupiah(parseValue(item?.price))}</td>
                                                       <td>{item?.qty}</td>
                                                       <td>
                                                            {rupiah(!isNaN(parseValue(item?.price) * item?.qty) ? parseValue(item?.price) * item?.qty : 0)}
                                                       </td>
                                                       {location.pathname.split('/')[2] === 'draft' ? <td>
                                                            {item?.attachment && item?.attachment?.length > 0 ? (
                                                                 <a
                                                                      className="text-primary"
                                                                      onClick={() =>
                                                                           setShow({
                                                                                ...show,
                                                                                file: true,

                                                                                title: item?.title,
                                                                                image: item.attachment
                                                                           })
                                                                      }
                                                                 >
                                                                      <Badge color="info">Show file</Badge>
                                                                 </a>
                                                            ) : (
                                                                 <a>
                                                                      {" "}
                                                                      <Badge color="primary">No Attachment</Badge>
                                                                 </a>
                                                            )}
                                                       </td> : null}
                                                  </tr>
                                             )
                                        })}

                                   </tbody>
                                   <tfoot>
                                        <tr>
                                             <td>
                                                  TOTAL KEBUTUHAN DANA
                                             </td>
                                             <td></td>
                                             <td></td>
                                             <td>{rupiah(totalRealization)}</td>
                                        </tr>
                                   </tfoot>
                              </Table>
                              <Col className="mt-5">
                                   <h4>Sisa Realisasi: {rupiah(parseValue(totalRealization) - parseValue(totalAccomodation))}</h4>
                              </Col>
                              <Modal
                                   isOpen={show?.file}
                                   toggle={() => setShow({ file: false, index: null })}
                                   className="modal-dialog-centered modal-xl"
                              >
                                   <ModalHeader
                                        className="bg-transparent"
                                        toggle={() => setShow({ file: false, index: null })}
                                   ></ModalHeader>
                                   <ModalBody className="px-sm-5 mx-50 pb-5">
                                        <h1 className="text-center mb-1">
                                             {"See Attachment '" + show?.title + "' "}
                                        </h1>
                                        <div style={{ width: "100%" }}>
                                             {show?.image &&
                                                  show.file === true
                                                  ? show?.image?.map(
                                                       (x, id) => {
                                                            return (
                                                                 <li key={id}>
                                                                      <a href={x.url} target="_blank">
                                                                           {x.path}
                                                                      </a>
                                                                 </li>
                                                            );
                                                       }
                                                  )
                                                  : ""}
                                        </div>
                                        <div className="text-end">
                                             <Button
                                                  color="primary"
                                                  onClick={() => setShow({ file: false, index: null })}
                                             >
                                                  Done
                                             </Button>
                                        </div>
                                   </ModalBody>
                              </Modal>
                         </>
                         : null}
               </CardBody>

          </Card>
     ) : (
          <Spinner />
     );
};

export default PreviewCard;
