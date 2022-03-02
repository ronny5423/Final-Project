import React, {useState} from "react";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import ButtonWithSpinner from "../sharedComponents/ButtonWithSpinner";
import SavingSpinner from "../sharedComponents/SavingSpinner";

function CreateProjectPage(props){
    const[name,updateName]=useState("")
    const[description,updateDescription]=useState("")
    const[save,updateSave]=useState(false)
    let history=useNavigate()

   function createProject(event){
        event.preventDefault()
        let objToSend={name:name,Description:description}
        updateSave(true)
        axios.post(serverAddress+`/projects/saveProject`,objToSend).then(response=>{
            if(response.status===200){
                //remove previous editor's id from local storage
                if(localStorage.getItem("sqlId")){
                    localStorage.removeItem("sqlId")
                }
                if(localStorage.getItem("nfrId")){
                    localStorage.removeItem("nfrId")
                }
                history(`/editorsTabs/${response.data}`)
            }
        })


     }

    return(
        <Form>
            <h1>Project Creation</h1>
            <br/>
            <div id={"projectNameInput"}>
                <p>Please enter project name:</p>
                <input type={"text"} onChange={event=>updateName(event.target.value)}/>
            </div>
            <div>
                <p>Please enter project's description</p>
                <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
                    <Form.Control onChange={event=>updateDescription(event.target.value)} as="textarea" placeholder="Description" style={{height:"50px"}} />
                </FloatingLabel>
            </div>
            <div>
                <Button type={"submit"} onClick={createProject} variant={"success"}>Create Project</Button>
                <Button variant={"danger"} onClick={_=>history("/dashboard")}>Cancel</Button>
                {save && <SavingSpinner/>}
            </div>
        </Form>
    )
}

export default CreateProjectPage;