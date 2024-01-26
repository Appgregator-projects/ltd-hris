import React, { Fragment, useEffect, useState } from 'react'
import { Cascader } from "antd";
import Api from "../../../../sevices/Api";
import { Row, Col, Label, FormFeedback, Input, Button, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Dropdown, ButtonDropdown, InputGroup } from "reactstrap";

const Cascaders = () => {
     const [department, setDepartment] = useState([]);
     const [nestedDepartement, setNestedDept] = useState([]);

     const fetchDepartment = async () => {
          try {
               const { status, data } = await Api.get(`/hris/departement`);

               if (status) {
                    setDepartment(data)
               }
          } catch (error) {

               toast.error(`Error : ${error.message}`, {
                    position: "top-center",
               });
          }
     };

     useEffect(() => {
          fetchDepartment()
     }, [])

     useEffect(() => {

          function buildTree(data, parentId = null) {
               const tree = [];

               for (const item of data) {
                    if (item.parent == parentId) {
                         const children = buildTree(data, item.id);

                         if (children.length) {
                              item.children = children;
                         }

                         tree.push({ ...item, label: item.label, value: item.id })
                    }
               }

               return tree;
          }


          if (nestedDepartement) {
               const tree = buildTree(department)

               setNestedDept(tree)
          }

          return () => {
               setNestedDept([])

          }

     }, [department]);

     const departementOptions = nestedDepartement.map((x) => {
          return {
               value: x.id,
               label: x.label,
               children: x.children
          }
     })

     return (
          <Fragment>
               <Row>
                    <Label>Department</Label>
                    <Col className=''>
                         <Cascader
                              options={departementOptions} changeOnSelect />
                    </Col>
               </Row>
          </Fragment>
     )
}

export default Cascaders