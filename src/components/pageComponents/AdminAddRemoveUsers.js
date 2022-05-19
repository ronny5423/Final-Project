import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, ModalBody, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {faTrash} from "@fortawesome/fontawesome-free-solid";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import withFetchData from "../sharedComponents/WithFetchData";
import AdminDeleteUserModal from "../sharedComponents/AdminDeleteUserModal";
import DeleteConfirmationModal from "../sharedComponents/DeleteConfirmationModal";
import ModalHeader from "react-bootstrap/ModalHeader";

function AdminAddRemoveUsers(props){
    let navigate=useNavigate()
    const [showDeleteModal,updateShowDeleteModal]=useState(false)
    const [showConfirmation,updateShowConfirmation]=useState(false)
    const clickedUser=useRef([])

    useEffect(_=>{
        props.updateFetchDataRoute(`/admin/getUsers`,"Users")
        props.fetchDataFromServer(0)
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
            {props.draw &&
                <div data-testid={"adminAddRemoveUsers"}>
                    <h1>All Users</h1>
                    <Table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>
                                <div>
                                    <Button variant={"success"} onClick={_=>navigate(`/register`)}>Add user to system</Button>
                                    {/*<Button data-testid={"deleteModalButton"} variant={"danger"} onClick={_=>updateShowDeleteModal(true)}>Delete user</Button>*/}
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.dataToShow.map((user,index)=>
                                <tr data-testid={"userRow"} key={index}>
                                    <td>{user}</td>
                                    <td>
                                    {/*    <ProjectRowTooltip message={"Delete user"} testId={"deleteUser"} icon={faTrash} onClick={_=>{*/}
                                    {/*    clickedUser.current=[index, user]*/}
                                    {/*    updateShowConfirmation(true)*/}
                                    {/*}}/>*/}
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                    {/*<AdminDeleteUserModal checkUser={checkUser} show={showDeleteModal} hide={_=>updateShowDeleteModal(false)}/>*/}
                    {/*<DeleteConfirmationModal show={showConfirmation} deleteUser={deleteUser} hide={updateShowConfirmation}/>*/}
                </div>
            }
            </div>
    )
}

export default withFetchData(AdminAddRemoveUsers)