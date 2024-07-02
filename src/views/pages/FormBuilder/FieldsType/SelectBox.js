import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"

const SelectBox = (props) => {

     return (
          <Fragment>
               <Label>{properties?.data?.[0]?.label}</Label>
               <Input type='text' />
          </Fragment>
     )
}

export default SelectBox