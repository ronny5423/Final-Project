import React, {useState} from 'react';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Button from '@restart/ui/esm/Button';
import '../cssComponents/UserMenu.css';
import {Container, Dropdown, Nav, Navbar} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {serverAddress} from "../../Constants";
import ChangePasswordComponent from "./ChangePasswordComponent";

export default function UserMenu() {
    let navigate=useNavigate()
    const[showChangePassword,updateShowChangePassword]=useState(false)

    async function logout(){
        let response=await axios.post(serverAddress+`/auth/Logout`)
        if(response.status===200){
            localStorage.removeItem("username")
            localStorage.removeItem("isAdmin")
            navigate(`/login`)
        }
    }

    return (
        <div class='UserDiv'>
            { localStorage.getItem("username")!== null
                ?
                <Dropdown>
                    <Dropdown.Toggle className={"userButton"} variant="success" id="dropdown-basic">
                        {localStorage.getItem("username")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item  onClick={_=>updateShowChangePassword(true)}>Change Password</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>

                :

                <Navbar bg={"dark"} variant={"dark"}>
                    <Container>

                        <Nav className={"me-auto"}>
                            <Link className={"nav-link"} to={"/login"}>Login</Link>
                            <Link className={"nav-link"} to={"/register"}>Register</Link>

                        </Nav>
                    </Container>
                </Navbar>
            }
            <ChangePasswordComponent show={showChangePassword} hide={_=>updateShowChangePassword(false)}/>
        </div>
    );
}