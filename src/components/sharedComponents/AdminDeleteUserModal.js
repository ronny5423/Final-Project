import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function AdminDeleteUserModal(props){
    const[user,updateUser]=useState("")
    const [showErrorModal,updateShowErrorModal]=useState(false)
    const [showConfirmationModal,updateShowConfirmationModal]=useState(false)

    function deleteUser(){
        updateShowConfirmationModal(false)
        let existInArray=props.checkUser(user)
        if(!existInArray){
            let response=axios.delete(serverAddress+`/admin/deleteUser`,{data:{username:user}}).then(res=>{
                //check if username is invalid, show error modal and if not so delete is successful
            })
        }
    }

    return(
        <div>
        <Modal show={props.show} centered backdrop={"static"} onHide={props.hide}>
            <Modal.Header closeButton>
                Delete user from system
            </Modal.Header>
            <Modal.Body>
                <div style={{"display":"flex","flexDirection":"column"}}>
                    <Form.Label>Please type username to delete from system</Form.Label>
                    <input data-testid={"nameInput"} type={"text"} value={user} onChange={event => updateUser(event.target.value)} placeholder={"username to delete from system"}/>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button data-testid={"deleteUserButton"} onClick={_=>user.length>0 ? updateShowConfirmationModal(true) : updateShowErrorModal(true)} variant={"danger"}>Delete User</Button>
            </Modal.Footer>
        </Modal>
    <DeleteConfirmationModal show={showConfirmationModal} deleteUser={deleteUser} hide={updateShowConfirmationModal}/>

    <Modal show={showErrorModal} centered backdrop={"static"} onHide={_=>updateShowErrorModal(false)}>
        <Modal.Header closeButton/>
        <Modal.Body>{user.length>0 ? "Invalid Username" :"Please enter user to delete"}</Modal.Body>
    </Modal>
        </div>
    )
}

export default AdminDeleteUserModal