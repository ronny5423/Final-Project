import React from "react";
import {Button, Modal} from "react-bootstrap";

export default function DeleteConfirmationModal(props){

    return(
        <Modal show={props.show} centered backdrop={"static"} onHide={_=>props.hide(false)}>
            <Modal.Header>Are you sure you want to delete this user?</Modal.Header>
            <Modal.Footer>
                <div>
                    <Button variant={"success"} onClick={props.deleteUser}>Yes</Button>
                    <Button variant={"danger"} onClick={_=>props.hide(false)}>No</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}