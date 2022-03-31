import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import AddUserToProject from "../sharedComponents/AddUserToProject";
import withFetchData from "../sharedComponents/WithFetchData";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";

 function ManageProjectUsers(props){
    let {projectId,projectOwner}=useParams()
    const[showAddUser,updateAddUser]=useState(false)
     const[loading,updateLoading]=useState(true)

    useEffect(()=>{
        props.updateFetchDataRoute(`/projects/getMembers/${projectId}`,"Members")
        props.fetchDataFromServer(0)
    },[])

     function deleteUser(index,user){
        props.deleteData(index,`/projects/removeMembers/${projectId}/${user}`)
     }

    return(
        <div>
            {props.draw &&
                <div>
                    <Table data-testid={"manageProjectUsers"}>
                        <thead>
                        <tr>
                            <th>Username</th>
                            {(localStorage.getItem("username")===projectOwner || localStorage.getItem("isAdmin")==="true")?
                                <th><Button variant={"primary"} onClick={_=>updateAddUser(true)}>Add user to project</Button></th> :
                            <th/>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {props.dataToShow.length>0 ?
                            props.dataToShow.map((user,index) =>
                                <tr data-testid={"user"} key={index}>
                                    <td>{user}</td>
                                    {(localStorage.getItem("username")===projectOwner || localStorage.getItem("isAdmin")==="true")?
                                        <td><Button variant={"danger"} onClick={_=>deleteUser(index,user)}>Delete user from project</Button></td>
                                        : <td/>
                                    }
                                </tr>
                            ) :
                            <tr>No users in project. Press Add user to project button to add users</tr>
                        }
                        </tbody>
                    </Table>

                    <AddUserToProject projectId={projectId} addUser={props.increaseDataLength} show={showAddUser} hide={_=>updateAddUser(false)}/>
                </div>
            }
        </div>
    )
}

export default withFetchData(ManageProjectUsers)