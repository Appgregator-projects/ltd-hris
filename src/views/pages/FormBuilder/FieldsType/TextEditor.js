import React, { Fragment } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Input, Label, Modal, FormFeedback, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip, Form } from "reactstrap"
import { Editor } from "react-draft-wysiwyg";
// ** Styles
import "@styles/react/libs/editor/editor.scss";
const TextEditor = (props) => {
     const { properties, edited, setEdited } = props

     const submit = (data) => {
          const valueProperti = props["properties"]["data"][1];
          return valueProperti({
               label: props["properties"]["data"][0]["label"],
               value: data,
               id: props["properties"]["data"][0]["id"],
          });
     };

     const afterEdit = async (data) => {
          const result = props["properties"]["editIsActive"];
          return result({ data, props });
     };

     return (
          <Fragment>
               <Label>{properties?.data?.[0]?.label}</Label>
               <Editor
                    toolbar={{
                         inline: { inDropdown: true },
                         list: { inDropdown: true },
                         textAlign: { inDropdown: true },
                         link: { inDropdown: true },
                         history: { inDropdown: true },
                    }}
                    onChange={(e) =>
                         props["properties"]["editMode"] === true
                              ? afterEdit(e.blocks[0].text)
                              : submit(e.blocks[0].text)
                    }
               />
          </Fragment>
     )
}

export default TextEditor