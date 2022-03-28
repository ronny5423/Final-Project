import React, {useState} from "react";
import { Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import SavingSpinner from "./SavingSpinner";

export default function AddUserToProject(props){
    const [user,updateUser]=useState("")
    const [showErrorModal,updateShowErrorModal]=useState(false)
    let history=useNavigate()
    const[saving,updateSaving]=useState(false)

  function addUser(){
        if(user.length>0){
            //send axios
            updateSaving(true)
            axios.post(serverAddress+`/projects/addMember`,{ProjectID:parseInt(props.projectId),Member:user}).then(response=>{
                if(response.status===200){
                    props.addUser(user)
                    updateUser("")
                    props.hide()
                }
                else if(response.status===400){
                    updateShowErrorModal(true)
                }
                else{
                    history("/error")
                }
                updateSaving(false)
            })
          }
        else{
            updateShowErrorModal(true)
        }

    }

    return(
        <div>
        <Modal show={props.show} centered backdrop={"static"} onHide={props.hide}>
            <Modal.Header closeButton>
                Add user to project
            </Modal.Header>
            <Modal.Body>
                <div style={{"display":"flex","flex-direction":"column"}}>
                    <Form.Label>Please type username to add to project</Form.Label>
                    <input type={"text"} value={user} onChange={event => updateUser(event.target.value)} placeholder={"username to add to project"}/>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button data-testid={"addButton"} onClick={addUser} variant={"success"}>Add User</Button>
            </Modal.Footer>
        </Modal>
        <Modal className={"errorModal"} show={showErrorModal} centered backdrop={"static"} onHide={_=>updateShowErrorModal(false)}>
            <Modal.Header closeButton/>
            <Modal.Body>{user.length>0 ?"Username doesn't exist or already in project!" : "Please enter username"}</Modal.Body>
        </Modal>
            {saving && <SavingSpinner/>}
        </div>
    )
}