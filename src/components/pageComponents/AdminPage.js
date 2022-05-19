import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link,Outlet} from "react-router-dom";
import "../cssComponents/AdminPage.css"

export default function AdminPage(){
    return(
        <div>
        <Navbar className={'adminNavbar'}>
            <Container>
                <Navbar.Brand>Admin</Navbar.Brand>
                <Nav className={"me-auto"}>
                <Link className={"nav-link"} to={"/admin/addRemoveUsers"}>Users</Link>
                <Link className={"nav-link"} to={"/admin/changeNFR"}>NFR</Link>
                <Link  className={"nav-link"} to={"/admin/dbProfiles"}>DB Profiles</Link>
                <Link  className={"nav-link"} to={"/admin/editAHP"}>Editors AHP</Link>
                <Link  className={"nav-link"} to={"/admin/projects"}>Projects</Link>
                </Nav>
            </Container>
        </Navbar>
            <Outlet />
        </div>
    )
}