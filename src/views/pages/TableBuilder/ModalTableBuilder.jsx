import React, { Fragment } from 'react'
import { Plus } from 'react-feather';
import {
     Button,
     Modal,
     ModalHeader,
     ModalBody,
     ModalFooter,
     Form,
     Label,
     Input,
     Row,
     Col,
     InputGroup,
     InputGroupText
} from "reactstrap";

const ModalTableBuilder = ({ toggle, handleSaveModal, modal }) => {

     return (
          <Fragment>
               <Col className='d-flex justify-content-between'>
                    <Col className='mt-1'>
                         <Button.Ripple color="primary" onClick={() => toggle()}>
                              <Plus size={14} />
                              <span className="align-middle ms-25">Add Table</span>
                         </Button.Ripple>
                    </Col>
               </Col>

               <Modal
                    returnFocusAfterClose={true}
                    isOpen={modal}
                    size='lg'
               >
                    <ModalHeader toggle={() => toggle()}>Custom Table</ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>
                         <Button
                              color="primary"
                              //   disabled={loading}
                              onClick={() => handleSaveModal()}
                         >
                              Save
                         </Button>
                         <Button color="secondary" onClick={() => toggle()} >
                              Cancel
                         </Button>
                    </ModalFooter>
               </Modal>
          </Fragment>
     )
}

export default ModalTableBuilder