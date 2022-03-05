import React, {useEffect, useRef, useState} from "react";
import {Button, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {faTrash} from "@fortawesome/fontawesome-free-solid";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import withFetchData from "../sharedComponents/WithFetchData";
import AdminDeleteUserModal from "../sharedComponents/AdminDeleteUserModal";
import DeleteConfirmationModal from "../sharedComponents/DeleteConfirmationModal";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";

function AdminAddRemoveUsers(props){
    let navigate=useNavigate()
    const [showDeleteModal,updateShowDeleteModal]=useState(false)
    const [showConfirmation,updateShowConfirmation]=useState(false)
    const [loading,updateLoading]=useState(true)
    const clickedUser=useRef([])

    useEffect(_=>{
        props.updateFetchDataRoute(`/admin/getUsers`,"Users")
        props.fetchDataFromServer(0).then(_=>updateLoading(false))
    },[])

    function deleteUser(){
        props.deleteData(clickedUser.current[0],`/admin/removeUsers/${clickedUser.current[1]}`)
    }
    function checkUser(user){
        for(let index in props.dataToShow){
            if(props.dataToShow[index]===user){
                deleteUser(index,user)
                return true
            }
        }
        return false
    }

    return(
        <div>
            {loading ? <LoadingSpinner /> :
                <div>
                    <Table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>
                                <div>
                                    <Button variant={"success"} onClick={_=>navigate(`/register`)}>Add user to system</Button>
                                    <Button variant={"danger"} onClick={_=>updateShowDeleteModal(true)}>Delete user</Button>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.dataToShow.map((user,index)=>
                                <tr key={index}>
                                    <td>{user}</td>
                                    <td><ProjectRowTooltip message={"Delete user"} icon={faTrash} onClick={_=>{
                                        clickedUser.current=[index, user]
                                        updateShowConfirmation(true)
                                    }}/></td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                    <AdminDeleteUserModal checkUser={checkUser} show={showDeleteModal} hide={_=>updateShowDeleteModal(false)}/>
                    <DeleteConfirmationModal show={showConfirmation} deleteUser={deleteUser} hide={updateShowConfirmation}/>
                </div>
            }
        </div>
    )
}

export default withFetchData(AdminAddRemoveUsers)