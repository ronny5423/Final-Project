import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {numberOfItemsInPage, serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import {faPlus} from "@fortawesome/fontawesome-free-solid";
import ProjectRow from "../sharedComponents/ProjectRow";
import PaginationComponent from "../sharedComponents/PaginationComponent";

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
    UMLEditorID:1,
    SQLEditorID:1,
    NFREditorID:1,
    AHPEditorID:1
}

let projectsArr=[]
for(let i=0;i<254;i++){
    projectsArr.push(project)
}

const spareProjectsNumber=5

export default function DashboardPage(){
    let numberOfProjects=useRef(projectsArr.length)
    let history=useNavigate()
    const [searchQuery,updateSearchQuery]=useState("")
    const [projectsToShow,updateProjects]=useState([])
    const spareProjects=useRef([])
    const projectEndIndex=useRef(0)

    async function fetchProjectsFromServer(startIndex){
        let end
        let numberOfSpare=0
        if(startIndex+numberOfItemsInPage+spareProjectsNumber<=numberOfProjects.current){
            end=startIndex+numberOfItemsInPage+spareProjectsNumber-1
            numberOfSpare=spareProjectsNumber
        }
        else{
            end=numberOfProjects.current-1
            if(end-startIndex+1>numberOfItemsInPage){
                numberOfSpare=end-startIndex+1-numberOfItemsInPage
            }
        }

        // let response= await axios.get(serverAddress+`/projects`,{params:{username:localStorage.cookie.username,startIndex:startIndex,endIndex:end,searchQuery:searchQuery}})
        // if(response.status===200){
        //     let endIndex=response.data.projects.length-1
        //     if(numberOfSpare>0){
        //         endIndex=numberOfItemsInPage-1
        //         spareProjects.current=response.data.projects.slice(response.data.projects.length-numberOfSpare,response.data.projects.length)
        //     }
        // else{
        //         spareProjects.current=[]
        //     }
        //     updateProjects(response.data.slice(0,endIndex+1))
        //     numberOfProjects.current=response.data.numberOfProjects
        //     projectEndIndex.current=end-numberOfSpare
        // }
        // else{
        //     history("/error")
        // }

        let newProjects=projectsArr.slice(startIndex,end+1)
        let endIndex=newProjects.length-1
            if(numberOfSpare>0){
                endIndex=numberOfItemsInPage-1
                spareProjects.current=newProjects.slice(newProjects.length-numberOfSpare,newProjects.length)
            }
            else{
                spareProjects.current=[]
            }
            updateProjects(newProjects.slice(0,endIndex+1))
            numberOfProjects.current=projectsArr.length
            projectEndIndex.current=end

      }

      function fetchSpareProjects(startIndex){
            let end
          if(startIndex+spareProjectsNumber<=numberOfProjects.current){
              end=startIndex+spareProjectsNumber-1
          }
          else{
              end=numberOfProjects.current-1
          }
          // axios.get(serverAddress+`/projects`,{params:{username:localStorage.cookie.username,startIndex:startIndex,endIndex:end,searchQuery:searchQuery}}).then(res=>{
          //     if(res.status===200){
          //         spareProjects.current=res.data.projects.slice(0,res.data.projects.length)
          //     }
          //     else{
          //         history("/error")
          //     }
          // })
          spareProjects.current=projectsArr.slice(startIndex,end+1)
      }


    useEffect(()=>{
        fetchProjectsFromServer(0)
    },[])

    function deleteProjectFromArray(index){
        let newProjectsArr=[...projectsToShow]
        projectsArr.splice(0,1)
        numberOfProjects.current--
        newProjectsArr.splice(index,1)
        if(spareProjects.current.length>0){
            newProjectsArr.push(spareProjects.current[0])
            spareProjects.current.splice(0,1)
        }
        if(spareProjects.current.length===0 && projectEndIndex.current<numberOfProjects.current){
            fetchSpareProjects(projectEndIndex.current+1)
        }
        if(numberOfProjects.current===numberOfItemsInPage && newProjectsArr.length===0){
            fetchProjectsFromServer(0)
        }
        else{
            updateProjects(newProjectsArr)
        }
    }

    return(
            <div>
                <div id={"searchDiv"}>
                    <input disabled={projectsToShow.length===0} value={searchQuery} placeholder={"Filter projects by name"} onChange={event => updateSearchQuery(event.target.value)}/>
                    <Button disabled={projectsToShow.length===0} variant={"primary"} onClick={_=>{
                        if(projectsToShow.length>0){
                            fetchProjectsFromServer(0)
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
                    {projectsToShow.length>0 ?
                        projectsToShow.map((project,index)=><ProjectRow key={index} projectId={project.ProjectID} projectOwner={project.ProjectOwner}
                          umlEditor={project.UMLEditorID} sqlEditor={project.SQLEditorID} nfrEditor={project.NFREditorID} projectDescription={project.Description}
                          ahpEditor={project.AHPEditorID} projectName={project.ProjectName} deleteProject={index=>deleteProjectFromArray(index)} index={index}
                        />) :
                        <tr>No projects. To add new project press on + button</tr>
                        }

                    </tbody>
                </Table>
                {
                    numberOfItemsInPage<numberOfProjects.current && <PaginationComponent fetchData={fetchProjectsFromServer} numberOfElements={numberOfProjects.current}/>
                }
            </div>
       )
}