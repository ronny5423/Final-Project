import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import AddUserToProject from "../sharedComponents/AddUserToProject";

const numberOfUsersToFetch=20
export default function ManageProjectUsers(){
    const [projectUsers,updateProjectUsers]=useState([])

    let {projectId}=useParams()
    let history=useNavigate()

    useEffect(()=>{
        fetchProjectUsers()
    },[])

    async function fetchProjectUsers(){
        let response=await axios.get(serverAddress+`/projectUsers`)
        if(response.status===200){
            let usersArr=[...projectUsers]
            let contactedUsers=usersArr.concat(response.data)
            updateProjectUsers(contactedUsers)
            }

        else{
            history("/error")
        }
    }

    function deleteUser(index){
        let user=projectUsers[index]
        //send axios request to delete user

        let newArr=[...projectUsers]
        newArr.splice(index,1)
        updateProjectUsers(newArr)
    }

    function addUser(user){

    }

    return(
        <div>


            <Table>
               <thead>
                <tr>
                    <th>Username</th>
                    <th><Button variant={"primary"} onClick={addUser}>Add user to project</Button></th>
                </tr>
               </thead>
               <tbody>
            {projectUsers.length>0 ?
                projectUsers.map((user,index) =>
                    <tr key={index}>
                        <td>{user}</td>
                        <td><Button variant={"danger"} onClick={index=>deleteUser(index)}>Delete user from project</Button></td>
                    </tr>
                ) :
                <h3>No users in project. Press Add user to project button to add users</h3>
            }
               </tbody>
            </Table>

        <AddUserToProject projectId={projectId} addUser={addUser}/>
        </div>
    )
}