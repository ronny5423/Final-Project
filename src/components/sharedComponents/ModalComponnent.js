import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function ModalComponnent(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.text}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}