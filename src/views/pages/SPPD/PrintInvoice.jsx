// ** React Imports
import { useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { rupiah } from '../../../Helper'

const Print = () => {

     const invoiceData = JSON.parse(localStorage.getItem("invoiceData"))
     const calculateTotal = (category) => {
          if (category.price && category.qty && !isNaN(category.price) && !isNaN(category.qty)) {
               return parseFloat(category.price) * parseFloat(category.qty);
          }
          return 0;
     };

     // Calculate the total sum for "other" category
     const realTotal = invoiceData?.realization?.other?.reduce((acc, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseFloat(item.qty) || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0) || 0;

     // Calculate the total sum for other categories excluding "other"
     const realizationTotal = invoiceData?.realization ? Object.entries(invoiceData.realization).reduce((acc, [key, category]) => {
          if (key !== 'other') {
               acc += calculateTotal(category);
          }
          return acc;
     }, 0) : 0;

     // Calculate the total sum for "other" category
     const needsTotal = invoiceData?.accomodation?.other?.reduce((acc, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseFloat(item.qty) || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0) || 0;

     // Calculate the total sum for other categories excluding "other"
     const accomodationTotal = invoiceData?.accomodation ? Object.entries(invoiceData.accomodation).reduce((acc, [key, category]) => {
          if (key !== 'other') {
               acc += calculateTotal(category);
          }
          return acc;
     }, 0) : 0;


     // Calculate the total sum of everything
     const totalRealization = realTotal + realizationTotal;
     const totalAccomodation = needsTotal + accomodationTotal

     console.log(invoiceData, "invoiceData")
     // ** Print on mount
     useEffect(() => {
          setTimeout(() => window.print(), 50)
     }, [])

     return (
          <div className='invoice-print p-3'>
               <div className='d-flex justify-content-between flex-md-row flex-column pb-2'>
                    <div>
                         <div className='d-flex mb-1'>
                              <svg viewBox='0 0 139 95' version='1.1' height='24'>
                                   <defs>
                                        <linearGradient id='invoice-linearGradient-1' x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%'>
                                             <stop stopColor='#000000' offset='0%'></stop>
                                             <stop stopColor='#FFFFFF' offset='100%'></stop>
                                        </linearGradient>
                                        <linearGradient
                                             id='invoice-linearGradient-2'
                                             x1='64.0437835%'
                                             y1='46.3276743%'
                                             x2='37.373316%'
                                             y2='100%'
                                        >
                                             <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                                             <stop stopColor='#FFFFFF' offset='100%'></stop>
                                        </linearGradient>
                                   </defs>
                                   <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                                        <g transform='translate(-400.000000, -178.000000)'>
                                             <g transform='translate(400.000000, 178.000000)'>
                                                  <path
                                                       className='text-primary'
                                                       d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                                                       style={{ fill: 'currentColor' }}
                                                  ></path>
                                                  <path
                                                       d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                                                       fill='url(#invoice-linearGradient-1)'
                                                       opacity='0.2'
                                                  ></path>
                                                  <polygon
                                                       fill='#000000'
                                                       opacity='0.049999997'
                                                       points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                                                  ></polygon>
                                                  <polygon
                                                       fill='#000000'
                                                       opacity='0.099999994'
                                                       points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                                                  ></polygon>
                                                  <polygon
                                                       fill='url(#invoice-linearGradient-2)'
                                                       opacity='0.099999994'
                                                       points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                                                  ></polygon>
                                             </g>
                                        </g>
                                   </g>
                              </svg>
                              <h3 className='text-primary fw-bold ms-1'>Lifetime Design</h3>
                         </div>
                         <p className='mb-25'>Lifetime Design,</p>
                         <p className='mb-25'>Jl. Kemang Timur No.25, RT.7/RW.4</p>
                         <p className='mb-0'>0811-1256-162</p>
                    </div>
                    <div className='mt-md-0 mt-2'>
                         <h4 className='fw-bold text-end mb-1'>{`SPPD #${invoiceData?.nomorSurat}`}</h4>
                         <div className='invoice-date-wrapper mb-50'>
                              <span className='invoice-date-title'>Date Issued:</span>
                              <span className='fw-bold'> {moment(invoiceData?.createdAtInt).format('DD MMMM YYYY')}</span>
                         </div>
                         {/* <div className='invoice-date-wrapper'>
                              <span className='invoice-date-title'>Due Date:</span>
                              <span className='fw-bold'>29/08/2020</span>
                         </div> */}
                    </div>
               </div>

               <hr className='my-2' />

               <Row className='pb-2'>
                    <Col sm='6'>
                         <h6 className='mb-1'>Description:</h6>
                         <p className='mb-10'>{invoiceData?.reason?.length > 0 ? invoiceData?.reason?.join(', ') : invoiceData?.reason}</p>
                         <h6 className='mb-1'>Location:</h6>
                         <p className='mb-25'>{invoiceData?.address1} {invoiceData?.address2 ? `and ${invoiceData?.address2}` : null}</p>
                    </Col>
                    <Col className='mt-sm-0 mt-2' sm='6'>
                         <h6 className='mb-1'>Payment Details:</h6>
                         <table>
                              <tbody>
                                   <tr>
                                        <td className="pe-1">Account Name:</td>
                                        <td>
                                             {invoiceData?.bankAccountName}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td className="pe-1">Account Number:</td>
                                        <td>
                                             {invoiceData?.bankAccountNumber}
                                        </td>
                                   </tr>
                                   <tr>
                                        <td className="pe-1">Bank Name:</td>
                                        <td>
                                             {invoiceData?.bankName}
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    </Col>
               </Row>
               <h6>RUNDOWN</h6>
               <Table className='mt-2 mb-2' responsive>
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
                         {invoiceData?.rundown?.map((item, id) => (
                              <tr key={id}>
                                   <td>{id + 1}</td>
                                   <td>{moment(item?.date).format('DD MMMM YYYY HH:mm')}</td>
                                   <td>{item?.location}</td>
                                   <td>{item?.description}</td>
                              </tr>
                         ))}
                    </tbody>
               </Table>

               <h6>MEMBER</h6>
               <Table className='mt-2 mb-2' responsive>
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
                         {invoiceData?.member?.map((item, id) => (
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

               <h6>ALLOCATIONS</h6>
               <Table className='mt-2 mb-2' responsive>
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
                                   {invoiceData?.accomodation?.dinasNonStaff?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.dinasNonStaff?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.dinasNonStaff?.price * invoiceData?.accomodation?.dinasNonStaff?.qty) ? invoiceData?.accomodation?.dinasNonStaff?.price * invoiceData?.accomodation?.dinasNonStaff?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>SPV</td>
                              <td>
                                   {invoiceData?.accomodation?.dinasSpv?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.dinasSpv?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.dinasSpv?.price * invoiceData?.accomodation?.dinasSpv?.qty) ? invoiceData?.accomodation?.dinasSpv?.price * invoiceData?.accomodation?.dinasSpv?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Manager Additional breakfast (jika tidak include hotel)</td>
                              <td>
                                   {invoiceData?.accomodation?.dinasManager?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.dinasManager?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.dinasManager?.price * invoiceData?.accomodation?.dinasManager?.qty) ? invoiceData?.accomodation?.dinasManager?.price * invoiceData?.accomodation?.dinasManager?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Hotel:</td>
                         </tr>
                         <tr>
                              <td>Peserta Dinas</td>
                              <td>
                                   {invoiceData?.accomodation?.hotelMember?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.hotelMember?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.hotelMember?.price * invoiceData?.accomodation?.hotelMember?.qty) ? invoiceData?.accomodation?.hotelMember?.price * invoiceData?.accomodation?.hotelMember?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Driver</td>
                              <td>
                                   {invoiceData?.accomodation?.hotelDriver?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.hotelDriver?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.hotelDriver?.price * invoiceData?.accomodation?.hotelDriver?.qty) ? invoiceData?.accomodation?.hotelDriver?.price * invoiceData?.accomodation?.hotelDriver?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Akomodasi</td>
                         </tr>
                         <tr>
                              <td>Darat: Bensin, Toll, Parkir</td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiDarat?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiDarat?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.akomodasiDarat?.price * invoiceData?.accomodation?.akomodasiDarat?.qty) ? invoiceData?.accomodation?.akomodasiDarat?.price * invoiceData?.accomodation?.akomodasiDarat?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Tiket Kereta/ Kapal/ Pesawat</td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiTiket?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiTiket?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.akomodasiTiket?.price * invoiceData?.accomodation?.akomodasiTiket?.qty) ? invoiceData?.accomodation?.akomodasiTiket?.price * invoiceData?.accomodation?.akomodasiTiket?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Taxi/ Ojek</td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiTaxi?.price}
                              </td>
                              <td>
                                   {invoiceData?.accomodation?.akomodasiTaxi?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.accomodation?.akomodasiTaxi?.price * invoiceData?.accomodation?.akomodasiTaxi?.qty) ? invoiceData?.accomodation?.akomodasiTaxi?.price * invoiceData?.accomodation?.akomodasiTaxi?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Lain-lain</td>
                         </tr>
                         {invoiceData?.accomodation?.other?.map((item, id) => {
                              return (
                                   <tr key={id}>
                                        <td>{item?.title}</td>
                                        <td>{item?.price}</td>
                                        <td>{item?.qty}</td>
                                        <td>
                                             {rupiah(!isNaN(item?.price * item?.qty) ? item?.price * item?.qty : 0)}
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

               <h6>REALIZATION</h6>
               <Table className='mt-2 mb-2' responsive>
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
                                   {invoiceData?.realization?.dinasNonStaff?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.dinasNonStaff?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.dinasNonStaff?.price * invoiceData?.realization?.dinasNonStaff?.qty) ? invoiceData?.realization?.dinasNonStaff?.price * invoiceData?.realization?.dinasNonStaff?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>SPV</td>
                              <td>
                                   {invoiceData?.realization?.dinasSpv?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.dinasSpv?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.dinasSpv?.price * invoiceData?.realization?.dinasSpv?.qty) ? invoiceData?.realization?.dinasSpv?.price * invoiceData?.realization?.dinasSpv?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Manager Additional breakfast (jika tidak include hotel)</td>
                              <td>
                                   {invoiceData?.realization?.dinasManager?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.dinasManager?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.dinasManager?.price * invoiceData?.realization?.dinasManager?.qty) ? invoiceData?.realization?.dinasManager?.price * invoiceData?.realization?.dinasManager?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Hotel:</td>
                         </tr>
                         <tr>
                              <td>Peserta Dinas</td>
                              <td>
                                   {invoiceData?.realization?.hotelMember?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.hotelMember?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.hotelMember?.price * invoiceData?.realization?.hotelMember?.qty) ? invoiceData?.realization?.hotelMember?.price * invoiceData?.realization?.hotelMember?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Driver</td>
                              <td>
                                   {invoiceData?.realization?.hotelDriver?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.hotelDriver?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.hotelDriver?.price * invoiceData?.realization?.hotelDriver?.qty) ? invoiceData?.realization?.hotelDriver?.price * invoiceData?.realization?.hotelDriver?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Akomodasi</td>
                         </tr>
                         <tr>
                              <td>Darat: Bensin, Toll, Parkir</td>
                              <td>
                                   {invoiceData?.realization?.akomodasiDarat?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.akomodasiDarat?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.akomodasiDarat?.price * invoiceData?.realization?.akomodasiDarat?.qty) ? invoiceData?.realization?.akomodasiDarat?.price * invoiceData?.realization?.akomodasiDarat?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Tiket Kereta/ Kapal/ Pesawat</td>
                              <td>
                                   {invoiceData?.realization?.akomodasiTiket?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.akomodasiTiket?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.akomodasiTiket?.price * invoiceData?.realization?.akomodasiTiket?.qty) ? invoiceData?.realization?.akomodasiTiket?.price * invoiceData?.realization?.akomodasiTiket?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Taxi/ Ojek</td>
                              <td>
                                   {invoiceData?.realization?.akomodasiTaxi?.price}
                              </td>
                              <td>
                                   {invoiceData?.realization?.akomodasiTaxi?.qty}
                              </td>
                              <td>
                                   {rupiah(!isNaN(invoiceData?.realization?.akomodasiTaxi?.price * invoiceData?.realization?.akomodasiTaxi?.qty) ? invoiceData?.realization?.akomodasiTaxi?.price * invoiceData?.realization?.akomodasiTaxi?.qty : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Lain-lain</td>
                         </tr>
                         {invoiceData?.realization?.other?.map((item, id) => {
                              return (
                                   <tr key={id}>
                                        <td>{item?.title}</td>
                                        <td>{item?.price}</td>
                                        <td>{item?.qty}</td>
                                        <td>
                                             {rupiah(!isNaN(item?.price * item?.qty) ? item?.price * item?.qty : 0)}
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
                              <td>{rupiah(totalRealization)}</td>
                         </tr>
                    </tfoot>
               </Table>
               <Row className='invoice-sales-total-wrapper mt-3'>
                    <Col className='mt-md-0 mt-0' md='6' order={{ md: 1, lg: 2 }}>
                         <p className='mb-0'>
                              {/* <span className='fw-bold'>Salesperson:</span> <span className='ms-75'>Alfie Solomons</span> */}
                         </p>
                    </Col>
                    <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
                         <div className='invoice-total-wrapper'>
                              <div className='invoice-total-item'>
                                   <p className='invoice-total-title'>Alokasi:</p>
                                   <p className='invoice-total-amount'>{rupiah(totalAccomodation)}</p>
                              </div>
                              <div className='invoice-total-item'>
                                   <p className='invoice-total-title'>Real:</p>
                                   <p className='invoice-total-amount'>{rupiah(totalRealization)}</p>
                              </div>
                              <hr className='my-50' />
                              <div className='invoice-total-item'>
                                   <p className='invoice-total-title'>Sisa:</p>
                                   <p className='invoice-total-amount'>{rupiah(totalAccomodation - totalRealization)}</p>
                              </div>
                         </div>
                    </Col>
               </Row>

               <hr className='my-1' />

               <Row>
                    <Col sm='12'>
                         <span className='fw-bold'>Note:</span>
                         <span>
                              It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
                              projects. Thank You!
                         </span>
                    </Col>
               </Row>
          </div>
     )
}

export default Print
