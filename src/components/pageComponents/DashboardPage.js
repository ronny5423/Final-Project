import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import {faPlus} from "@fortawesome/fontawesome-free-solid";
import ProjectRow from "../sharedComponents/ProjectRow";
import withFetchData from "../sharedComponents/WithFetchData";

function DashboardPage(props){
    let history=useNavigate()
    const [searchQuery,updateSearchQuery]=useState("")

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
                {props.draw &&
                    <div data-testid={"dashboard"}>
                        <h1>Dashboard</h1>
                        <div id={"searchDiv"} data-testid={"searchDiv"}>
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
                            <tbody id={"body"}>
                            {props.dataToShow.length>0 ?
                                props.dataToShow.map((project,index)=><ProjectRow key={project.ProjectID} projectId={project.ProjectID} projectOwner={project.Owner}
                                                                                  umlEditor={project.UMLEditorID} sqlEditor={project.SQLEditorID} nfrEditor={project.NFREditorID} projectDescription={project.Description}
                                                                                  ahpWeights={project.Weights} projectName={project.name} deleteProject={props.deleteData} index={index} adminPage={props.isAdmin}
                                />) :
                                <tr>No projects. To add new project press on + button</tr>
                            }

                            </tbody>
                        </Table>
                    </div>
                }
            </div>
       )
}

export default withFetchData(DashboardPage)