import React from "react";
import {Modal} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

export default function SavingSpinner(){
    return(
        <Modal  show backdrop={"static"} centered>
            <Modal.Body>
                <div data-testid={"savingSpinner"}>
                    <span>Saving </span>
                    <Spinner animation={"border"}/>
                </div>
            </Modal.Body>
        </Modal>
    )
}