import React, { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from "@components/breadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Input, Label, FormFeedback, Form, CardBody, CardTitle } from "reactstrap"
import Api from '../../../sevices/Api'
import ObjectClass from '../FormBuilder/FieldsType';
import { Save } from 'react-feather';
import TableIndex from './table/TableIndex';
import TableComponent from './table/TableComponent';
import { TableData } from './table/TableData';
import { addDocumentFirebase, getCollectionWhereFirebase } from '../../../sevices/FirebaseApi';
import moment from "moment";

const DigitalizationForm = () => {
     const { id } = useParams()

     const [formDetail, setFormDetail] = useState({})
     const [edited, setEdited] = useState(true)
     const [dataSubmit, setDataSubmit] = useState([])
     const [table, setTable] = useState([])

     function GetObject(data) {
          return ObjectClass(data);
     }

     const extractTextInParentheses = (str) => {
          const regex = /\(([^)]+)\)/;
          const matches = str.match(regex);
          return matches ? matches[1] : null;
     };

     function convertToRoman(num) {
          const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
          return roman[num - 1];
     }

     function GetTable(id) {
          console.log(id, 'yip')
          return TableIndex(id)
     }


     const fetchDataDetailForm = async () => {
          try {
               const { status, data } = await Api.get(`/hris/form-builder/${id}`)
               const resTable = await getCollectionWhereFirebase('table_builder', "idForm", "array-contains", parseInt(id))
               console.log(data,"ni dta")
               setFormDetail({ ...data, nomorSurat: `${moment().format("MM-YY-HHmm-ssSSS")}/${extractTextInParentheses((data && data.title && data.title[0].title).toUpperCase())}/HRD/LD-JKT/${convertToRoman(moment().month() + 1)}/${moment().year()}`})
               setDataSubmit(data.fields)
               setTable(resTable)
               console.log(resTable, "datasub", [parseInt(id)])
          } catch (error) {
               throw error
          }
     }

     const valueFromObject = (data) => {
          const findId = Object.assign(dataSubmit);
          findId.map((item, index) => {
               if (item["id"] === data["id"]) {
                    item["value"] = data;
               }
          });
     };

     const valueFormTable = (rowIndex, colIndex, value, id) => {
          table[id].tbody[rowIndex].td[colIndex] = value
     };
     

     const handleSubmit = async () => {
          try {
               const title = extractTextInParentheses((formDetail && formDetail.title && formDetail.title[0].title).toLowerCase())

               const data = {
                    dataSubmit,
                    table,
                    status: 'Waiting in Head',
                    nomorSurat: formDetail.nomorSurat
               }

               console.log(data, "ni data submit")

               const result = await addDocumentFirebase(title, data)

          } catch (error) {
               throw error
          }
     }

     // console.log(formDetail && formDetail.title && formDetail.title[0].title, "ini datasubmit")

     useEffect(() => {
          fetchDataDetailForm()
          return () => {
               setFormDetail({})
          }
     }, [])


     return (
          <Fragment>
               <Breadcrumbs
                    title="Digitalization"
                    data={[{ title: "Digitalization", link: '/digitalization' }, { title: formDetail && formDetail.title && formDetail.title[0].title }]}
               />

               <Card className='p-1'>
                    <CardBody>
                         <CardTitle>
                              {formDetail && formDetail.title && formDetail.title[0].title}
                         </CardTitle>

                         <Form>
                              <Row className='mb-5'>
                                   <Col>
                                        <Label>Nomor Surat</Label>
                                        <Input type='text'
                                          value={formDetail.nomorSurat}
                                          disabled
                                        />
                                   </Col>
                                   {formDetail && formDetail.fields && formDetail.fields.map((item, index) => (
                                        <div key={index} className='pt-1'>
                                             <Col >
                                                  <div>
                                                       <GetObject data={[
                                                            item,
                                                            valueFromObject,
                                                       ]}
                                                            required={true}
                                                            editMode={false}
                                                            // validDate={validDate}
                                                            edited={edited}
                                                            setEdited={setEdited} />
                                                  </div>


                                             </Col>

                                        </div>

                                   ))}
                              </Row>

                              <Row className='mt-1'>
                                   {[...table.filter(item => !item?.title?.includes("LAPORAN")),
                                   ...table.filter(item => item?.title?.includes("LAPORAN"))]
                                        .map((item, id) => (
                                             <div key={id} className='mb-2'>
                                                  <h5 className='mb-2'>{item?.title?.toUpperCase()}</h5>
                                                  <TableComponent
                                                       id={id}
                                                       tbody={item?.tbody}
                                                       thead={item?.thead}
                                                       valueFormTable={valueFormTable}
                                                       tableData={table}
                                                  />
                                                  <hr />
                                             </div>
                                        ))
                                   }
                                   {/* <GetTable type={id} /> */}
                              </Row>
                         </Form>
                         <Button.Ripple color="success" type="submit" className='mt-1' onClick={() => handleSubmit()}>
                              <Save size={14} />
                              <span className="align-middle ms-25">Submit</span>
                         </Button.Ripple>


                    </CardBody>
               </Card>
          </Fragment>
     )
}

export default DigitalizationForm