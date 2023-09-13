import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Edit, Grid, Plus, Trash } from "react-feather"
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import Api from "../../../sevices/Api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal);

export default function PayrolIndex() {

    return (
        <>
        Ini Payroll Index
        </>
    )

}