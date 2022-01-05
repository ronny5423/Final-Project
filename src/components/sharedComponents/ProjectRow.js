import React, {useState} from "react";
import ProjectRowTooltip from "./ProjectRowTooltip";
import {faEdit, faFilePdf, faTrash, faUserPlus} from "@fortawesome/fontawesome-free-solid";
import {useNavigate} from "react-router-dom"
import {faPen, faPoll} from "@fortawesome/free-solid-svg-icons";
import ShowMoreText from "react-show-more-text";
import axios from "axios";
import {Button, Form, Modal} from "react-bootstrap";
import {serverAddress} from "../../Constants";

export default function ProjectRow(props){
    let history=useNavigate()

    const [showDeleteProjectModal,updateDeleteModal]=useState(false)
    const [showEditNameAndDescriptionModal,updateEditModal]=useState(false)
    const [projectName,updateProjectName]=useState(props.projectName)
    const [projectDescription,updateProjectDescription]=useState(props.projectDescription)

    function generatePDF(){
    //todo
    }

    function moveToProjectsEditors(){
        let route=`/editorsTabs/${props.projectId}`
        if(props.umlEditor){
            route+=`/${props.umlEditor}`
        }
        if(props.sqlEditor){
            route+=`/${props.sqlEditor}`
        }
        if(props.nfrEditor){
            route+=`/${props.nfrEditor}`
        }
        if(props.ahpWeights){
            let umlAHP=props.ahpWeights.UML
            let sqlAHP=props.ahpWeights.SQL
            let nfrAHP=props.ahpWeights.NFR
            route+=`/${umlAHP}/${sqlAHP}/${nfrAHP}`
        }
        history(route)
    }

    function moveToAddRemoveUsers(){
        history(`/manageUsers/${props.projectId}`)
    }

    function moveToResults(){
        history(`/algorithmResults/${props.projectId}`)
    }

    async function deleteProject(){
        //send axios request
        // let response=await axios.delete(serverAddress+`/users/leaveProject/${props.projectId}`)
        // if(response.status===200){
        //     updateDeleteModal(false)
        //     props.deleteProject(props.index,props.projectId) //delete project from array
        // }
        // else{
        //     history(`/error`)
        // }
        let route=`/users/leaveProject/${props.projectId}`
        updateDeleteModal(false)
        props.deleteProject(props.index,route) //delete project from array
    }

   async function editNameAndDescription(){
        //send axios request
       let body={details:{name:projectName,Description:projectDescription},projectID:props.projectId}
        let response=await axios.post(serverAddress+`/projects/updateDetails`,body)
       if(response.status===200){
           updateEditModal(false)
       }
       else{
           history(`/error`)
       }
     }

    return(

        <tr>
            <td>{projectName}</td>
            <td style={{"width":400}}><ShowMoreText lines={2} more={"Show More"} less={"Show Less"} truncatedEndingComponent={"..."} expanded={false}>{projectDescription}</ShowMoreText></td>
            <td>{props.projectOwner}</td>
            <td>
                <div>
                    <ProjectRowTooltip message={"Get report on the project"} icon={faFilePdf} onClick={generatePDF}/>
                    <ProjectRowTooltip message={"Edit project"} icon={faEdit} onClick={moveToProjectsEditors}/>
                    {
                        <ProjectRowTooltip message={"Add/Remove users"} icon={faUserPlus} onClick={moveToAddRemoveUsers}/>
                    }
                    {(props.nfrEditor && props.sqlEditor && props.umlEditor) && <ProjectRowTooltip message={"View algorithm results"} icon={faPoll} onClick={moveToResults}/>}
                    <ProjectRowTooltip message={"Delete project"} icon={faTrash} onClick={()=>updateDeleteModal(true)}/>
                    <ProjectRowTooltip message={"Edit project's name and description"} icon={faPen} onClick={()=>updateEditModal(true)}/>
                </div>
            </td>

               <Modal show={showDeleteProjectModal} centered backdrop={"static"}>
                    <Modal.Body>
                        <p>Are you sure you want to delete the project?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={"success"} onClick={deleteProject}>Yes</Button>
                        <Button variant={"info"} onClick={_=>updateDeleteModal(false)}>No</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEditNameAndDescriptionModal} centered backdrop={"static"}>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" >
                                <Form.Label>Project's Name:</Form.Label>
                                <Form.Control type="text" placeholder="Project's Name" value={projectName} onChange={event => updateProjectName(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Project's Description</Form.Label>
                                <Form.Control as={"textarea"} type="text" placeholder="Project's Description" value={projectDescription} onChange={event => updateProjectDescription(event.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={"success"} onClick={editNameAndDescription}>Save</Button>
                        <Button variant={"danger"} onClick={_=>updateEditModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
           </tr>
   )
}