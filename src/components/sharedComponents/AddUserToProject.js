import React, {useState} from "react";
import { Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";

export default function AddUserToProject(props){
    const [user,updateUser]=useState("")
    const [showErrorModal,updateShowErrorModal]=useState(false)
    let history=useNavigate()

   async function addUser(){
        //send axios
        let response=await axios.post(serverAddress+`/addUserToProject`,{params:{projectId:props.projectId,username:user}})
        if(response.status===201){
            props.addUser()
        }
        else if(response.status===409){
            updateShowErrorModal(true)
        }
        else{
            history("/error")
        }
    }

    return(
        <div>
        <Modal show={props.show} centered backdrop={"static"} onHide={props.hide}>
            <Modal.Header closeButton>
                Add user to project
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Please type username to add to project</Form.Label>
                    <Form.Control as={"text"} value={user} onChange={event => updateUser(event.target.value)} placeholder={"username to add to project"}/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={addUser} variant={"success"}>Add User</Button>
            </Modal.Footer>
        </Modal>
        <Modal show={showErrorModal} centered backdrop={"static"} onHide={_=>updateShowErrorModal(false)}>
            <Modal.Header closeButton/>
            <Modal.Body>Username already in project!</Modal.Body>
        </Modal>
        </div>
    )
}