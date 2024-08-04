import React, { useEffect, useState } from 'react'
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Button, Card, CardBody, CardFooter, CardText, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap';
import moment from 'moment';
import AsyncSelect from "react-select/async";
import { serviceAccurateEmployeeHrisDeals } from '../../../apis/services/Services';
import { numberFormat, rupiah } from '../../../Helper';
import { addDocumentFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../../sevices/FirebaseApi';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import { File, Plus, Trash } from 'react-feather';
import FileUploaderMultiple from '../../../@core/components/multiple-file';
import { Upload } from '../../../Helper/firebaseStorage';
import InputPrice from '../../../@core/components/input-price';
const MySwal = withReactContent(Swal);

const reason = ['Tugas', 'Visit Project', 'Meeeting Client', 'Training', 'Lain-lain']
const driver = ['yes', 'no']
const transport = ['Mobil Pribadi', 'Mobil Operasional', 'Kereta', 'Kapal', 'Pesawat', 'Taxi Online', 'Taxi Lokal']

const SppdForm = () => {
     const parseCurrency = value => parseFloat(value?.replace(/\./g, ""));

     const parseValue = value => {
          if (typeof value === 'string') {
               return value ? parseCurrency(value) : 0;
          }
          return value || 0;
     };

     const userData = JSON.parse(localStorage.getItem('userData'))
     const navigate = useNavigate()
     const { id, type } = useParams()

     console.log({ type, id })

     function convertToRoman(num) {
          const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
          return roman[num - 1];
     }


     const [member, setMember] = useState([{
          id: null,
          name: null,
          gender: null,
          department: null,
          level: null
     },])

     const [needs, setNeeds] = useState([{
          title: null,
          price: null,
          qty: null,
          total: null
     }])

     const [realization, setRealization] = useState([{
          title: null,
          price: null,
          qty: null,
          total: null
     }])

     const [rundown, setRundown] = useState([{
          date: null,
          location: null,
          description: null,
     }])

     const [accomodation, setAccomodation] = useState({ dinasNonStaff: {}, dinasSpv: {}, dinasManager: {}, hotelMember: {}, hotelDriver: {}, akomodasiDarat: {}, akomodasiTiket: {}, akomodasiTaxi: {} })
     const [real, setReal] = useState({ dinasNonStaff: {}, dinasSpv: {}, dinasManager: {}, hotelMember: {}, hotelDriver: {}, akomodasiDarat: {}, akomodasiTiket: {}, akomodasiTaxi: {} })
     const [owner, setOwner] = useState([])
     const [allEmployee, setAllEmployee] = useState([])
     const [department, setDepartment] = useState([])
     const [data, setData] = useState({ nomorSurat: `${moment().format("MM-YY-HHmm-ssSSS")}/SPPD/HRD/LD-JKT/${convertToRoman(moment().month() + 1)}/${moment().year()}`, driver: null, status: null })

     const addNewRow = (type) => {
          if (type === 'member') {
               setMember((prevState) => [
                    ...prevState,
                    {
                         id: null,
                         name: null,
                         gender: null,
                         department: null,
                         level: null
                    },
               ]);
          } else if (type === 'needs') {
               setNeeds((prevState) => [
                    ...prevState,
                    {
                         price: null,
                         qty: null,
                         total: null
                    },
               ]);
          } else if (type === 'rundown') {
               setRundown((prevState) => [
                    ...prevState,
                    {
                         date: null,
                         location: null,
                         description: null,
                    },
               ]);
          } else {
               setRealization((prevState) => [
                    ...prevState,
                    {
                         price: null,
                         qty: null,
                         total: null
                    },
               ]);
          }


     };

     const getDataSearch = async (inputValue) => {
          try {
               const response = await serviceAccurateEmployeeHrisDeals(inputValue)

               if (response) {
                    setAllEmployee(response)
                    const obj = response?.map(({ id, name }) => {
                         return { value: id, label: name };
                    });

                    return obj;
               }

          } catch (error) {
               throw error
          }
     };
     console.log(allEmployee, "allEmployee")
     const loadOption = (inputValue, callback) => {
          setTimeout(() => {
               getDataSearch(inputValue).then((e) => {
                    callback(e);
               });
          }, 2000);
     };

     const handleSelectOwner = (e, i) => {
          console.log(allEmployee, "selectedEmployee")
          const selectedEmployee = allEmployee?.filter((x) => x.id === e.value)?.[0]

          console.log(selectedEmployee, "selectedEmployee", e)

          setOwner({ ...e, email: selectedEmployee?.email })

          member[i].id = selectedEmployee?.id
          member[i].name = selectedEmployee?.name
          member[i].department = selectedEmployee?.departement?.label
          member[i].gender = selectedEmployee?.employee_attribute?.gender
          member[i].level = selectedEmployee?.level

          setMember(member)
          const employees = selectedEmployee?.departement;

          if (employees) {
               setDepartment(employees.label)
          } else {
               setDepartment('')
          }
     };

     const handleChangeCheckbox = (e, item, type) => {
          if (e.target.checked) {
               setData(prevData => ({
                    ...prevData,
                    [type]: [...(prevData[type] || []), item]
               }));
          } else {
               setData(prevData => ({
                    ...prevData,
                    [type]: prevData[type].filter(value => value !== item)
               }));
          }
     }


     const calculateTotal = (category) => {
          return category.price && category.qty && !isNaN(category.price * category.qty) ? category.price * category.qty : 0;
     };


     const handleSave = async () => {
          let newData = { ...data }

          // console.log({member, real, realization,accomodation,needs, data})
          const accomodationTotal = Object.values(accomodation).reduce((acc, category) => acc + calculateTotal(category), 0);

          const needsTotal = needs.reduce((acc, item) => {
               const price = item.price || 0;
               const qty = item.qty || 0;
               const total = !isNaN(price * qty) ? price * qty : 0;
               return acc + total;
          }, 0);

          const totalNeeds = accomodationTotal + needsTotal;
          // Calculate the total sum for accomodation
          const realTotal = Object.values(real).reduce((acc, category) => acc + calculateTotal(category), 0);

          // Calculate the total sum for needs
          const realizationTotal = realization.reduce((acc, item) => {
               const price = item.price || 0;
               const qty = item.qty || 0;
               const total = !isNaN(price * qty) ? price * qty : 0;
               return acc + total;
          }, 0);

          // Calculate the total sum of everything
          const totalRelization = realTotal + realizationTotal;


          newData = { ...data, member, rundown, status: "Waiting in Head", realization: { ...real, other: realization }, accomodation: { ...accomodation, other: needs }, employee: { name: userData?.name, email: userData?.user?.email, id: userData?.id }, amount: totalNeeds, createdAtInt: new Date().getTime() }

          console.log(newData, "newData")
          try {
               let result = ''
               if (type === 'edit' && data?.status === 'Waiting in HRGA') {
                    newData = { ...newData, status: "Waiting in Finance", hrga_id: userData?.name }
                    result = await setDocumentFirebase('sppd', id, newData)
               } else if (type === 'edit' && data?.isRejected === true) {
                    newData = { ...newData, isRejected: false }
                    result = await setDocumentFirebase('sppd', id, newData)
               } else if (type === 'edit' && data?.isRealization) {
                    newData = { ...newData, status: 'Waiting Realization in Finance' }
                    result = await setDocumentFirebase('sppd', id, newData)
               } else {
                    result = await addDocumentFirebase('sppd', newData)
               }

               if (result) {
                    toast.success("SPPD has been created", {
                         position: "top-center",
                    });
                    navigate(-1)
               } else {
                    toast.error(`Error : ${result}`, {
                         position: "top-center",
                    });
               }

          } catch (error) {
               toast.error(`Error : ${error}`, {
                    position: "top-center",
               });
          }
     }

     const handleReject = async () => {
          Swal.fire({
               title: 'Reject',
               text: 'Please input your reason',
               input: 'text',

          }).then(async (result) => {
               console.log(result, "ni result")
               if (result.isConfirmed) {
                    const newData = { ...data, isRejected: true, rejected_by: userData?.name, notes: result?.value, manager_id: '', status: 'Waiting in Head' }
                    const resultEdit = await setDocumentFirebase('sppd', id, newData)
                    if (resultEdit) {
                         navigate(-1)
                         toast.success("SPPD has been rejected", {
                              position: "top-center",
                         });
                    }
                    // Swal.fire(`Success`, `You have been ${row.status === 'Outstanding' ? 'Stock IN' : 'Extended'} the tools`, "success");
               }
          });
     }

     const fetchDataSppd = async () => {
          try {
               const resultSppd = await getSingleDocumentFirebase('sppd', id)
               if (resultSppd) {
                    setData(resultSppd)
                    setRundown(resultSppd?.rundown)
                    setMember(resultSppd?.member)
                    setAccomodation(resultSppd?.accomodation)
                    setNeeds(resultSppd?.accomodation?.other)
                    setRealization(resultSppd?.realization?.other)
                    setReal(resultSppd?.realization)
               }

          } catch (error) {
               throw error
          }
     }
     console.log({ member })
     const accomodationTotal = Object.values(accomodation).reduce((acc, category) => acc + calculateTotal(category), 0);

     const needsTotal = needs.reduce((acc, item) => {
          const price = item.price || 0;
          const qty = item.qty || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0);

     const totalNeeds = accomodationTotal + needsTotal;
     // Calculate the total sum for accomodation
     const realTotal = Object.values(real).reduce((acc, category) => acc + calculateTotal(category), 0);

     // Calculate the total sum for needs
     const realizationTotal = realization.reduce((acc, item) => {
          const price = item.price || 0;
          const qty = item.qty || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0);

     // Calculate the total sum of everything
     const totalRelization = realTotal + realizationTotal;
     useEffect(() => {
          if (type === 'edit') {
               fetchDataSppd()
          }
     }, [])
     console.log(data, 'ni data', real, realization)

     return (
          <>
               <Breadcrumbs
                    title="SPPD"
                    data={[{ title: "SPPD", link: '/sppd' }, { title: 'Create' }]}
               />
               <Card>
                    <CardBody>
                         <Form>
                              <Row className='mb-5'>
                                   <Col >
                                        <Label>Nomor Surat</Label>
                                        <Input type='text'
                                             value={data?.nomorSurat}
                                             disabled
                                        />
                                   </Col>
                                   <Row className="mt-1">
                                        <Col>
                                             <Label>Tanggal Keberangkatan</Label>
                                             <Input type='date' onChange={(e) => setData({ ...data, dateDeparture: e.target.value })} defaultValue={data?.dateDeparture} disabled={type === 'edit' && data?.isRejected ? false : true} />
                                        </Col>
                                        <Col>
                                             <Label>Tanggal Kembali</Label>
                                             <Input type='date' onChange={(e) => setData({ ...data, dateReturn: e.target.value })} defaultValue={data?.dateReturn} disabled={type === 'edit' && data?.isRejected ? false : true} />
                                        </Col>
                                   </Row>
                                   <Row className="mt-1">
                                        <Label>Alasan Perjalanan Dinas</Label>
                                        <Col>

                                             {
                                                  reason?.map((item, index) => (

                                                       <div className='form-check form-check-inline' key={index}>
                                                            <Input type='checkbox' onChange={(e) => handleChangeCheckbox(e, item, 'reason')} defaultChecked={data?.reason?.includes(item)} disabled={type === 'edit' && data?.isRejected ? false : true} />
                                                            <Label value={item}>
                                                                 {item}
                                                            </Label>
                                                       </div>

                                                  ))
                                             }
                                        </Col>
                                   </Row>
                                   <Row className="mt-1">
                                        <Col>
                                             <Label>Alamat Tujuan 1</Label>
                                             <Input disabled={type === 'edit' && data?.isRejected ? false : true} onChange={(e) => setData({ ...data, address1: e.target.value })} defaultValue={data?.address1} />
                                        </Col>
                                        <Col>
                                             <Label>Alamat Tujuan 2</Label>
                                             <Input disabled={type === 'edit' && data?.isRejected ? false : true} onChange={(e) => setData({ ...data, address2: e.target.value })} defaultValue={data?.address2} />
                                        </Col>
                                   </Row>
                                   <Row className="mt-1">
                                        <Label>Transportasi</Label>
                                        <Col>
                                             {
                                                  transport?.map((item, index) => (

                                                       <div className='form-check form-check-inline' key={index}>
                                                            <Input disabled={type === 'edit' && data?.isRejected ? false : true} type='checkbox' onChange={(e) => handleChangeCheckbox(e, item, 'transport')} defaultChecked={data?.transport?.includes(item)} />
                                                            <Label value={item}>
                                                                 {item}
                                                            </Label>
                                                       </div>

                                                  ))
                                             }
                                        </Col>
                                   </Row>
                                   <Row className="mt-1">
                                        <Label>Kebutuhan Driver</Label>
                                        <Col>
                                             {driver?.map((item, index) => {

                                                  return (

                                                       <div className='form-check form-check-inline' key={index}>
                                                            <Input
                                                                 disabled={data?.status === "Waiting in HRGA" ? false : true}
                                                                 type='radio'
                                                                 name='radioGroup'
                                                                 checked={data?.driver === item}
                                                                 onChange={() => setData({ ...data, driver: item })}
                                                            />
                                                            <Label>
                                                                 {item}
                                                            </Label>
                                                       </div>

                                                  )
                                             })}
                                        </Col>
                                   </Row>
                                   <Row className="mt-1">
                                        <Col>
                                             <Label>Bank Account Number</Label>
                                             <Input disabled={type === 'edit' && data?.isRejected ? false : true} onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value })} defaultValue={data?.bankAccountNumber} />
                                        </Col>
                                        <Col>
                                             <Label>Bank Account Name</Label>
                                             <Input disabled={type === 'edit' && data?.isRejected ? false : true} onChange={(e) => setData({ ...data, bankAccountName: e.target.value })} defaultValue={data?.bankAccountName} />
                                        </Col>
                                        <Col>
                                             <Label>Bank Name</Label>
                                             <Input disabled={type === 'edit' && data?.isRejected ? false : true} onChange={(e) => setData({ ...data, bankName: e.target.value })} defaultValue={data?.bankName} />
                                        </Col>
                                   </Row>
                              </Row>
                         </Form>
                         <Col>
                              <TableRundown addNewRow={addNewRow} rundown={rundown} setRundown={setRundown} />
                         </Col>
                         <Col className="mt-5">
                              <TableMember addNewRow={addNewRow} member={member} setMember={setMember} loadOption={loadOption} handleSelectOwner={handleSelectOwner} type={type} data={data} />
                         </Col>
                         {data?.status === "Waiting in HRGA" || data?.isRealization ?
                              <Col className="mt-5">
                                   <TableNeeds data={data} type={type} addNewRow={addNewRow} needs={needs} setNeeds={setNeeds} accomodation={accomodation} setAccomodation={setAccomodation} />
                              </Col>
                              : null}
                         {data?.status?.includes("Realization") ?
                              <Col className="mt-5">
                                   <TableRealization type={type} addNewRow={addNewRow} realization={realization} setRealization={setRealization} real={real} setReal={setReal} />
                                   <h4>Sisa Realisasi: {rupiah(parseValue(totalRelization) - parseValue(totalNeeds))}</h4>
                              </Col>
                              : null}

                         <CardFooter className='mt-5'>
                              {data?.status === "Waiting in HRGA" ?
                                   <Button.Ripple onClick={handleReject} color='danger' className="m-1">
                                        Reject
                                   </Button.Ripple>

                                   : null}

                              <Button.Ripple onClick={handleSave} color='primary'>
                                   Submit
                              </Button.Ripple>

                         </CardFooter>
                    </CardBody>
               </Card>
          </>
     )

}

const TableRundown = ({ type, addNewRow, rundown, setRundown }) => {
     const handleChangeRundown = (newValue, index, type) => {
          const updatedRowData = [...rundown];
          updatedRowData[index][type] = newValue;
          console.log(updatedRowData, 'ups')
          setRundown(updatedRowData);
     };
     return (
          <>
               <h4>Rundown</h4>
               <Table className="table table-hover table-fixed mb-5" responsive>
                    <thead>
                         <tr>
                              <th className="th-lg">
                                   <div style={{ width: "150px" }}>No</div>
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
                         {rundown?.map((item, id) => {
                              return (
                                   <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td><Input type='datetime-local' defaultValue={item?.date} onChange={(e) => handleChangeRundown(e.target.value, id, 'date')} /></td>
                                        <td><Input defaultValue={item?.location} onChange={(e) => handleChangeRundown(e.target.value, id, 'location')} /></td>
                                        <td><Input defaultValue={item?.description} onChange={(e) => handleChangeRundown(e.target.value, id, 'description')} /></td>
                                   </tr>
                              )
                         })}
                    </tbody>
               </Table>
               <CardText>
                    <Button
                         color="primary"
                         outline
                         className="mt-2"
                         onClick={() => addNewRow('rundown')}
                    >
                         Add new rundown
                    </Button>
               </CardText>
          </>
     )
}

const TableMember = ({ addNewRow, member, loadOption, handleSelectOwner, setMember, type, data }) => {
     const handleChangeMember = (newValue, index, type) => {
          const updatedRowData = [...member];
          updatedRowData[index][type] = newValue;
          console.log(updatedRowData, 'ups')
          setMember(updatedRowData);
     };

     return (
          <>
               <h4>Peserta Dinas</h4>
               <Table className="table table-hover table-fixed mb-5" responsive>
                    <thead>
                         <tr>
                              <th className="th-lg">
                                   <div style={{ width: "150px" }}>No</div>
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
                         {member?.map((item, id) => {
                              console.log(item, 'item')
                              return (
                                   <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                             {type === 'edit' ?
                                                  <Input defaultValue={item?.name} disabled={type === 'edit' && data?.isRejected ? false : true} />
                                                  :

                                                  <AsyncSelect
                                                       menuPosition={"absolute"}
                                                       loadOptions={loadOption}
                                                       defaultOptions
                                                       onChange={(e) => handleSelectOwner(e, id)}
                                                       defaultValue={{ value: item?.id, label: item?.name }}
                                                  />
                                             }

                                        </td>
                                        {/* <td><Input defaultValue={item?.name}/></td> */}
                                        <td><Input defaultValue={item?.gender} onChange={(e) => handleChangeMember(e.target.value, id, 'gender')} disabled={type === 'edit' && data?.isRejected ? false : true} /></td>
                                        <td><Input defaultValue={item?.department} onChange={(e) => handleChangeMember(e.target.value, id, 'department')} disabled={type === 'edit' && data?.isRejected ? false : true} /></td>
                                        <td><Input defaultValue={item?.level} onChange={(e) => handleChangeMember(e.target.value, id, 'level')} disabled={type === 'edit' && data?.isRejected ? false : true} /></td>
                                   </tr>
                              )
                         })}
                    </tbody>
               </Table>
               {type !== 'edit' &&
                    <CardText>
                         <Button
                              color="primary"
                              outline
                              className="mt-2"
                              onClick={() => addNewRow('member')}
                         >
                              Add new member
                         </Button>
                    </CardText>
               }
          </>
     )

}

const TableNeeds = ({ type, addNewRow, needs, setNeeds, accomodation, setAccomodation, setReal, real, data }) => {

     const parseCurrency = value => parseFloat(value?.replace(/\./g, ""));

     const parseValue = value => {
          if (typeof value === 'string') {
               return value ? parseCurrency(value) : 0;
          }
          return value || 0;
     };

     const handleChangeNeeds = (newValue, index, type) => {
          const updatedRowData = [...needs];
          updatedRowData[index][type] = newValue;
          setNeeds(updatedRowData);
     };

     // Calculate the total for each category
     const calculateTotal = (category) => {
          return category.price && category.qty && !isNaN(category.price * category.qty) ? category.price * category.qty : 0;
     };

     // Calculate the total sum for accomodation
     const accomodationTotal = Object.values(accomodation).reduce((acc, category) => acc + calculateTotal(category), 0);

     // Calculate the total sum for needs
     const needsTotal = needs.reduce((acc, item) => {
          const price = parseValue(item.price) || 0;
          const qty = item.qty || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0);

     // Calculate the total sum of everything
     const totalNeeds = accomodationTotal + needsTotal;

     return (
          <>
               <h4>Kebutuhan Perjalanan Dinas</h4>
               <Table className="table table-hover table-fixed mb-5" responsive>
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

                                   <InputPrice
                                        inputValue={accomodation?.dinasNonStaff?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             dinasNonStaff: {
                                                  ...accomodation.dinasNonStaff,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.dinasNonStaff?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             dinasNonStaff: {
                                                  ...accomodation.dinasNonStaff,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.dinasNonStaff?.price) * accomodation?.dinasNonStaff?.qty)
                                        ? parseValue(accomodation?.dinasNonStaff?.price) * accomodation?.dinasNonStaff?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>SPV</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.dinasSpv?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             dinasSpv: {
                                                  ...accomodation.dinasSpv,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.dinasSpv?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             dinasSpv: {
                                                  ...accomodation.dinasSpv,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.dinasSpv?.price) * accomodation?.dinasSpv?.qty)
                                        ? parseValue(accomodation?.dinasSpv?.price) * accomodation?.dinasSpv?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Manager Additional breakfast (jika tidak include hotel)</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.dinasManager?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             dinasManager: {
                                                  ...accomodation.dinasManager,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.dinasManager?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             dinasManager: {
                                                  ...accomodation.dinasManager,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.dinasManager?.price) * accomodation?.dinasManager?.qty)
                                        ? parseValue(accomodation?.dinasManager?.price) * accomodation?.dinasManager?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Hotel:</td>
                         </tr>
                         <tr>
                              <td>Peserta Dinas</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.hotelMember?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             hotelMember: {
                                                  ...accomodation.hotelMember,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.hotelMember?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             hotelMember: {
                                                  ...accomodation.hotelMember,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.hotelMember?.price) * accomodation?.hotelMember?.qty)
                                        ? parseValue(accomodation?.hotelMember?.price) * accomodation?.hotelMember?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Driver</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.hotelDriver?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             hotelDriver: {
                                                  ...accomodation.hotelDriver,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.hotelDriver?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             hotelDriver: {
                                                  ...accomodation.hotelDriver,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.hotelDriver?.price) * accomodation?.hotelDriver?.qty)
                                        ? parseValue(accomodation?.hotelDriver?.price) * accomodation?.hotelDriver?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Akomodasi</td>
                         </tr>
                         <tr>
                              <td>Darat: Bensin, Toll, Parkir</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.akomodasiDarat?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             akomodasiDarat: {
                                                  ...accomodation.akomodasiDarat,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.akomodasiDarat?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             akomodasiDarat: {
                                                  ...accomodation.akomodasiDarat,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.akomodasiDarat?.price) * accomodation?.akomodasiDarat?.qty)
                                        ? parseValue(accomodation?.akomodasiDarat?.price) * accomodation?.akomodasiDarat?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Tiket Kereta/ Kapal/ Pesawat</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.akomodasiTiket?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             akomodasiTiket: {
                                                  ...accomodation.akomodasiTiket,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.akomodasiTiket?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             akomodasiTiket: {
                                                  ...accomodation.akomodasiTiket,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.akomodasiTiket?.price) * accomodation?.akomodasiTiket?.qty)
                                        ? parseValue(accomodation?.akomodasiTiket?.price) * accomodation?.akomodasiTiket?.qty
                                        : 0)}

                              </td>
                         </tr>
                         <tr>
                              <td>Taxi/ Ojek</td>
                              <td>
                                   <InputPrice
                                        inputValue={accomodation?.akomodasiTaxi?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setAccomodation({
                                             ...accomodation,
                                             akomodasiTaxi: {
                                                  ...accomodation.akomodasiTaxi,
                                                  price: newValue
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />

                              </td>
                              <td>
                                   <Input
                                        defaultValue={accomodation?.akomodasiTaxi?.qty || ''}
                                        onChange={(e) => setAccomodation({
                                             ...accomodation,
                                             akomodasiTaxi: {
                                                  ...accomodation.akomodasiTaxi,
                                                  qty: e.target.value
                                             }
                                        })}
                                        disabled={data?.status === "Waiting in HRGA" ? false : true}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(accomodation?.akomodasiTaxi?.price) * accomodation?.akomodasiTaxi?.qty)
                                        ? parseValue(accomodation?.akomodasiTaxi?.price) * accomodation?.akomodasiTaxi?.qty
                                        : 0)}
                              </td>
                         </tr>
                         <tr>
                              <td>Lain-lain</td>
                         </tr>
                         {needs?.map((item, id) => {
                              return (
                                   <tr key={id}>
                                        <td>
                                             <Input
                                                  disabled={data?.status === "Waiting in HRGA" ? false : true}
                                                  defaultValue={item.title || ''}
                                                  onChange={(e) => handleChangeNeeds(e.target.value, id, 'title')}
                                             />
                                        </td>
                                        <td>
                                             <InputPrice
                                                  inputValue={accomodation?.dinasManager?.price || ''}
                                                  type={true}
                                                  onInputChange={(newValue) => handleChangeNeeds(newValue, id, 'price')}
                                                  disabled={data?.status === "Waiting in HRGA" ? false : true}
                                             />

                                        </td>
                                        <td>
                                             <Input
                                                  disabled={data?.status === "Waiting in HRGA" ? false : true}
                                                  defaultValue={item.qty || ''}
                                                  onChange={(e) => handleChangeNeeds(e.target.value, id, 'qty')}
                                             />
                                        </td>
                                        <td>
                                             {rupiah(!isNaN(parseValue(item.price) * item.qty)
                                                  ? parseValue(item.price) * item.qty
                                                  : 0)}
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
                              <td>{rupiah(totalNeeds)}</td>
                         </tr>
                    </tfoot>
               </Table>
               {data?.status === "Waiting in HRGA" ?
                    <CardText>
                         <Button
                              color="primary"
                              outline
                              onClick={() => addNewRow('needs')}
                         >
                              Add new accomodation
                         </Button>
                    </CardText>
                    :
                    null}
          </>
     )
}

const TableRealization = ({ type, addNewRow, realization, real, setReal, setRealization }) => {

     console.log(real, 'ni reals')


     const parseCurrency = value => parseFloat(value?.replace(/\./g, ""));

     const parseValue = value => {
          console.log(value, "yiha")
          if (typeof value === 'string') {
               return value ? parseCurrency(value) : 0;
          }
          return value || 0;
     };



     const [show, setShow] = useState({})
     const [image, setImage] = useState([])

     const handleChangeRealization = (newValue, index, type) => {
          const updatedRowData = [...realization];
          updatedRowData[index][type] = newValue;
          setRealization(updatedRowData);
     };
     // Calculate the total for each category
     const calculateTotal = (category) => {
          return category.price && category.qty && !isNaN(category.price * category.qty) ? category.price * category.qty : 0;
     };

     // Calculate the total sum for accomodation
     const realTotal = Object.values(real).reduce((acc, category) => acc + calculateTotal(category), 0);

     // Calculate the total sum for needs
     const realizationTotal = realization.reduce((acc, item) => {
          const price = item.price || 0;
          const qty = item.qty || 0;
          const total = !isNaN(price * qty) ? price * qty : 0;
          return acc + total;
     }, 0);

     // Calculate the total sum of everything
     const totalRelization = realTotal + realizationTotal;

     const handleAttachment = (value, obj, type) => {
          if (obj?.[type]) {
               // real?.[`${type}`].attachment = value
               obj[type].attachment = value;
          }
          console.log(obj, type, "ini rows", value)
          // rowData = value;
     };

     const submit = async (data, dataImg, obj, type) => {
          let files = data.target.files;
          let url = [];
          for (let i = 0; i < files.length; i++) {
               url.push(URL.createObjectURL(files[i]));
          }

          files = Object.values(files);

          let uploadedUrls = [];
          const uploadPromises = files.map((file, index) => {
               uploadedUrls.push({ name: file.name, type: file.type });
               return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onprogress = (event) => {
                         if (event.lengthComputable) {
                              const percentLoaded = Math.round(
                                   (event.loaded / event.total) * 100
                              );
                         }
                    };
                    reader.onload = async () => {
                         const baseURL = reader.result;
                         try {
                              const fileName = `${file.name}`;
                              const result = await Upload(fileName, index, baseURL, 'sppd');
                              resolve(result);
                         } catch (error) {
                              reject(error);
                         }
                    };
               });
          });
          let results = await Promise.all(uploadPromises);

          const updatedArrObj = uploadedUrls.map((obj, index) => {
               return {
                    ...obj,
                    url: results[index].url,
                    path: results[index].path
               };
          });

          let newAttch = []

          if (image?.length === 0) {
               newAttch = [...obj[type].attachment, ...updatedArrObj]
          } else {
               newAttch = [...image, ...updatedArrObj]
          }
          handleAttachment(newAttch, dataImg)
          setImage(newAttch)

     };


     const onDelete = (data, id, obj, type) => {
          const updatedAttachments = [...data];
          updatedAttachments.splice(id, 1);

          handleAttachment(updatedAttachments, obj, type)
          setImage(updatedAttachments)
     }

     return (
          <>
               <h4>Laporan Pertanggung Jawaban</h4>
               <Table className="table table-hover table-fixed mb-5" responsive>
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
                              <th>
                                   <div style={{ width: "100px" }}>Attachment</div>
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
                                   <InputPrice
                                        inputValue={real?.dinasNonStaff?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, dinasNonStaff: { ...real.dinasNonStaff, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.dinasNonStaff?.qty || ''}
                                        onChange={(e) => setReal({ ...real, dinasNonStaff: { ...real.dinasNonStaff, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.dinasNonStaff?.price) * real?.dinasNonStaff?.qty) ? parseValue(real?.dinasNonStaff?.price) * real?.dinasNonStaff?.qty : 0)}
                              </td>
                              <td>
                                   {real?.dinasNonStaff?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'dinasNonStaff', obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'dinasNonStaff', obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>SPV</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.dinasSpv?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, dinasSpv: { ...real.dinasSpv, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.dinasSpv?.qty || ''}
                                        onChange={(e) => setReal({ ...real, dinasSpv: { ...real.dinasSpv, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.dinasSpv?.price) * real?.dinasSpv?.qty) ? parseValue(real?.dinasSpv?.price) * real?.dinasSpv?.qty : 0)}
                              </td>
                              <td>
                                   {real?.dinasSpv?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'dinasSpv', obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: 'dinasSpv', obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Manager Additional breakfast (jika tidak include hotel)</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.dinasManager?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, dinasManager: { ...real.dinasManager, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.dinasManager?.qty || ''}
                                        onChange={(e) => setReal({ ...real, dinasManager: { ...real.dinasManager, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.dinasManager?.price) * real?.dinasManager?.qty) ? parseValue(real?.dinasManager?.price) * real?.dinasManager?.qty : 0)}
                              </td>
                              <td>
                                   {real?.dinasManager?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'dinasManager', obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: 'dinasManager', obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Hotel:</td>
                         </tr>
                         <tr>
                              <td>Peserta Dinas</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.hotelMember?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, hotelMember: { ...real.hotelMember, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.hotelMember?.qty || ''}
                                        onChange={(e) => setReal({ ...real, hotelMember: { ...real.hotelMember, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.hotelMember?.price) * real?.hotelMember?.qty) ? parseValue(real?.hotelMember?.price) * real?.hotelMember?.qty : 0)}
                              </td>
                              <td>
                                   {real?.hotelMember?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'hotelMember', obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: 'hotelMember', obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Driver</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.hotelDriver?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, hotelDriver: { ...real.hotelDriver, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.hotelDriver?.qty || ''}
                                        onChange={(e) => setReal({ ...real, hotelDriver: { ...real.hotelDriver, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.hotelDriver?.price) * real?.hotelDriver?.qty) ? parseValue(real?.hotelDriver?.price) * real?.hotelDriver?.qty : 0)}
                              </td>
                              <td>
                                   {real?.hotelDriver?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: 'hotelDriver', obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: 'hotelDriver', obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Akomodasi</td>
                         </tr>
                         <tr>
                              <td>Darat: Bensin, Toll, Parkir</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.akomodasiDarat?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, akomodasiDarat: { ...real.akomodasiDarat, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.akomodasiDarat?.qty || ''}
                                        onChange={(e) => setReal({ ...real, akomodasiDarat: { ...real.akomodasiDarat, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.akomodasiDarat?.price) * real?.akomodasiDarat?.qty) ? parseValue(real?.akomodasiDarat?.price) * real?.akomodasiDarat?.qty : 0)}
                              </td>
                              <td>
                                   {real?.akomodasiDarat?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: "akomodasiDarat", obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: "akomodasiDarat", obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Tiket Kereta/ Kapal/ Pesawat</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.akomodasiTiket?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, akomodasiTiket: { ...real.akomodasiTiket, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.akomodasiTiket?.qty || ''}
                                        onChange={(e) => setReal({ ...real, akomodasiTiket: { ...real.akomodasiTiket, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.akomodasiTiket?.price) * real?.akomodasiTiket?.qty) ? parseValue(real?.akomodasiTiket?.price) * real?.akomodasiTiket?.qty : 0)}
                              </td>
                              <td>
                                   {real?.akomodasiTiket?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: "akomodasiTiket", obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: "akomodasiTiket", obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Taxi/ Ojek</td>
                              <td>
                                   <InputPrice
                                        inputValue={real?.akomodasiTaxi?.price || ''}
                                        type={true}
                                        onInputChange={(newValue) => setReal({ ...real, akomodasiTaxi: { ...real.akomodasiTaxi, price: newValue } })}
                                   />
                              </td>
                              <td>
                                   <Input
                                        defaultValue={real?.akomodasiTaxi?.qty || ''}
                                        onChange={(e) => setReal({ ...real, akomodasiTaxi: { ...real.akomodasiTaxi, qty: e.target.value } })}
                                   />
                              </td>
                              <td>
                                   {rupiah(!isNaN(parseValue(real?.akomodasiTaxi?.price) * real?.akomodasiTaxi?.qty) ? parseValue(real?.akomodasiTaxi?.price) * real?.akomodasiTaxi?.qty : 0)}
                              </td>
                              <td>
                                   {real?.akomodasiTaxi?.attachment ?
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, file: true, type: "akomodasiTaxi", obj: real })}
                                        >
                                             <Badge color="success">Show file</Badge>
                                        </a>
                                        :
                                        <a
                                             className="text-primary"
                                             onClick={() => setShow({ ...show, upload: true, type: "akomodasiTaxi", obj: real })}
                                        >
                                             <Badge color="primary">upload file</Badge>
                                        </a>
                                   }
                              </td>
                         </tr>
                         <tr>
                              <td>Lain-lain</td>
                         </tr>
                         {realization?.map((item, id) => {
                              return (
                                   <tr key={id}>
                                        <td><Input defaultValue={item.title || ''} onChange={(e) => handleChangeRealization(e.target.value, id, 'title')} /></td>
                                        <td>
                                             <InputPrice
                                                  inputValue={item?.price || ''}
                                                  type={true}
                                                  onInputChange={(newValue) => handleChangeRealization(newValue, id, 'price')}
                                             />
                                        </td>
                                        <td><Input defaultValue={item.qty || ''} onChange={(e) => handleChangeRealization(e.target.value, id, 'qty')} /></td>
                                        <td>
                                             {rupiah(!isNaN(parseValue(item.price) * item.qty) ? parseValue(item.price) * item.qty : 0)}
                                        </td>
                                        <td>
                                             {item?.attachment ?
                                                  <a
                                                       className="text-primary"
                                                       onClick={() => setShow({ ...show, file: true, index: id, type: "realization", obj: realization })}
                                                  >
                                                       <Badge color="success">Show file</Badge>
                                                  </a>
                                                  :
                                                  <a
                                                       className="text-primary"
                                                       onClick={() => setShow({ ...show, upload: true, index: id, type: "realization", obj: realization })}
                                                  >
                                                       <Badge color="primary">upload file</Badge>
                                                  </a>
                                             }
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
                              <td>{rupiah(totalRelization)}</td>
                         </tr>
                    </tfoot>
               </Table>
               <CardText>
                    <Button
                         color="primary"
                         outline
                         className="mt-2"
                         onClick={() => addNewRow('accomodation')}
                    >
                         Add new realization
                    </Button>
               </CardText>
               <Modal
                    isOpen={show.file || show.upload}
                    toggle={() => { setShow({ file: false, upload: false, index: null }); setImage([]) }}
                    className="modal-dialog-centered modal-xl"
               >

                    <ModalHeader
                         className="bg-transparent"
                         toggle={() => setShow({ file: false, upload: false, index: null })}
                    ></ModalHeader>
                    <ModalBody className="px-sm-5 mx-50 pb-5">
                         <h1 className="text-center mb-1">
                              {show.file === true ? "See Uploaded" : "Upload"} File
                         </h1>
                         <div style={{ width: "100%" }}>
                              {(show.obj?.[`${show?.type}`]?.attachment && show.file) ? (
                                   <>
                                        {image?.length > 0 ? image.map((x, id) => (
                                             <Col key={id} className="my-1 position-relative">
                                                  <Link to={x.url} target="_blank" className="d-flex align-items-center">
                                                       <File size={16} />
                                                       <span className="ml-2">{x.path}</span>
                                                  </Link>
                                                  <Button.Ripple
                                                       className="position-absolute"
                                                       style={{ top: 0, right: 0 }}
                                                       size="sm"
                                                       color="danger"
                                                       onClick={() => onDelete(image, id, show?.index)}
                                                  >
                                                       <Trash size={12} />
                                                  </Button.Ripple>
                                             </Col>
                                        )) :
                                             show.obj?.[`${show?.type}`]?.attachment?.map((x, id) => (
                                                  <Col key={id} className="my-1 position-relative">
                                                       <Link to={x.url} target="_blank" className="d-flex align-items-center">
                                                            <File size={16} />
                                                            <span className="ml-2">{x.path}</span>
                                                       </Link>
                                                       <Button.Ripple
                                                            className="position-absolute"
                                                            style={{ top: 0, right: 0 }}
                                                            size="sm"
                                                            color="danger"
                                                            onClick={() => onDelete(obj[type].attachment, id, show?.obj, show?.type)}
                                                       >
                                                            <Trash size={12} />
                                                       </Button.Ripple>
                                                  </Col>
                                             ))}
                                        <Input
                                             type="file"
                                             id="file-input"
                                             style={{ display: 'none' }}
                                             onChange={(e) => submit(e, show?.index, show?.obj, show?.type)}
                                             multiple
                                        />
                                        <Label
                                             htmlFor="file-input"
                                             className="file-label"
                                             style={{ color: "#7367f0", cursor: 'pointer', fontWeight: 'bold' }}
                                             size="sm"
                                        >
                                             <Plus size={14} />
                                             Add File
                                        </Label>
                                   </>
                              ) : (
                                   <FileUploaderMultiple
                                        setAttachment={(value) => handleAttachment(value, show.obj, show?.type)}
                                        attachment={show.obj?.[`${show?.type}`]?.attachment}
                                        fileName={show?.type}
                                   />
                              )}
                         </div>
                         <div className="text-end">
                              <Button
                                   color="primary"
                                   onClick={() =>
                                        setShow({ file: false, upload: false, index: null })
                                   }
                              >
                                   Done
                              </Button>
                         </div>
                    </ModalBody>
               </Modal>
          </>
     )
}


export default SppdForm