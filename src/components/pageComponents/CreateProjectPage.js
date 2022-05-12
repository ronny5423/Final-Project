import React, {useEffect, useState} from "react";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import ButtonWithSpinner from "../sharedComponents/ButtonWithSpinner";
import SavingSpinner from "../sharedComponents/SavingSpinner";
import "../cssComponents/CreateProject.css"

function CreateProjectPage(props){
    const[name,updateName]=useState("")
    const[description,updateDescription]=useState("")
    const[save,updateSave]=useState(false)
    let history=useNavigate()

    useEffect(()=>{
        if(localStorage.getItem("username")===null){
            history(`/login`)
        }
    },[])

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
        <Form id ={"createProject"} data-testid={"createProjectPage"}>
            <h1>Create new project</h1>
            <div id={"projectNameInput"}>
                <p>Please enter project name:</p>
                <input required type={"text"} onChange={event=>updateName(event.target.value)}/>
            </div>
            <div id={"projectDescriptionInput"}>
                <p>Please enter project's description:</p>
                <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
                    <Form.Control data-testid={"textarea"} onChange={event=>updateDescription(event.target.value)} as="textarea" placeholder="Description" />
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