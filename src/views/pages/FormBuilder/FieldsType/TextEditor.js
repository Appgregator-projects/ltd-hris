import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"
import { Editor } from "react-draft-wysiwyg";
// ** Styles
import "@styles/react/libs/editor/editor.scss";
const TextEditor = ({ properties }) => {
     return (
          <Fragment>
               <Label>{properties?.data?.label}</Label>
               <Editor
                    toolbar={{
                         inline: { inDropdown: true },
                         list: { inDropdown: true },
                         textAlign: { inDropdown: true },
                         link: { inDropdown: true },
                         history: { inDropdown: true },
                    }}

               />
          </Fragment>
     )
}

export default TextEditor