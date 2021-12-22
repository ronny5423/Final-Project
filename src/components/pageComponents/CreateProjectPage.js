import React, {useState} from "react";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";

function CreateProjectPage(props){
    const[name,updateName]=useState("")
    const[description,updateDescription]=useState("")
    let history=useNavigate()

   async function createProject(event){
        event.preventDefault()
        let objToSend={projectName:name,projectDescription:description}
        // let response=await axios.post(serverAddress+`/createProject`,objToSend)
        // if(response.status===201){
        //  //   localStorage.setItem("currentProjectIndex",response.data.index)
        //     history(`/editorsTabs/${response.data.index}`)
        // }
       history(`/editorsTabs/1`)
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
            <Button type={"submit"} onClick={createProject} variant={"success"}>Create Project</Button>
        </Form>
    )
}

export default CreateProjectPage;