import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import {faPlus} from "@fortawesome/fontawesome-free-solid";
import ProjectRow from "../sharedComponents/ProjectRow";
import withFetchData from "../sharedComponents/WithFetchData";

//tests
let description="The concat method creates a new array consisting of the\n elements in the object on which it is called, followed in order by, for each argument, the elements of that\n argument (if the argument is an array) or the argument itself (if the argument is not an array). It does not recurse into nested array arguments.\n" +
    "\n" +
    "The concat method does not alter this or any of the arrays provided as arguments but instead returns a shallow copy\n that contains copies of the same elements combined from\n the original arrays. Elements of the original arrays are copied into the new array as follows:\n" +
    "\n" +
    "Object references (and not the actual object): concat copies object\n references into the new array. Both the original and new array refer to the same object. That is, if a referenced object is modified, the changes are visible\n to both the new and original arrays. This includes elements of array arguments that are also arrays.\n" +
    "Data types such as strings, numbers and booleans (not String, Number, and Boolean objects): concat copies the values of strings and numbers into the new array."

let project={
    ProjectName:"FirstProject",
    ProjectID:1,
    Description:description,
    ProjectOwner:"ronny54",
    UMLEditorID:4,
    SQLEditorID:5,
    NFREditorID:11,
    Weights:[1,2,3]
}

let projectsArr=[]
for(let i=0;i<254;i++){
    projectsArr.push(project)
}

function DashboardPage(props){
    let history=useNavigate()
    const [searchQuery,updateSearchQuery]=useState("")
    //console.log(props.dataToShow)

    useEffect(()=>{
        let parametersToServer={
            searchQuery:searchQuery
          }
        let route
        if(props.isAdmin){
            route=`/admin`
        }
        else{
            route=`/users`
        }
        props.updateFetchDataRoute(route+`/getProjects`,"Projects")
        props.updateServerParameters(parametersToServer)
        props.fetchDataFromServer(0)
        },[])

    return(
            <div>
                <div id={"searchDiv"}>
                    <input disabled={props.dataLength===0} value={searchQuery} placeholder={"Filter projects by name"} onChange={event => updateSearchQuery(event.target.value)}/>
                    <Button disabled={props.dataToShow.length===0} variant={"primary"} onClick={_=>{
                        if(props.dataToShow.length>0){
                            props.updateServerParameters({searchQuery:searchQuery})
                            props.fetchDataFromServer(0)
                        }
                    }
                    }>Search</Button>
                </div>
                <Table >
                    <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Project Description</th>
                        <th>Project Owner</th>
                        <th><ProjectRowTooltip message={"Create new Project"} icon={faPlus} onClick={_ => history("/createProject")}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.dataToShow.length>0 ?
                        props.dataToShow.map((project,index)=><ProjectRow key={project.ProjectID} projectId={project.ProjectID} projectOwner={project.Owner}
                          umlEditor={project.UMLEditorID} sqlEditor={project.SQLEditorID} nfrEditor={project.NFREditorID} projectDescription={project.Description}
                          ahpWeights={project.Weights} projectName={project.name} deleteProject={props.deleteData} index={index}
                        />) :
                        <tr>No projects. To add new project press on + button</tr>
                        }

                    </tbody>
                </Table>
                </div>
       )
}

export default withFetchData(DashboardPage)