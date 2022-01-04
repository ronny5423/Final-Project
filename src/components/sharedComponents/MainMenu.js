import React, {useState} from 'react'
import { scaleRotate as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfo, faEnvelope } from '@fortawesome/fontawesome-free-solid'
import '../cssComponents/MainMenu.css'
import {Link} from "react-router-dom";

export default function MainMenu() {
    const[isOpen,setOpen]=useState(false);

  return (
    <Menu isOpen={isOpen} onOpen={()=>setOpen(true)} onClose={_=>setOpen(false)} >
            <Link id="home" className="bm-item" to="/home" onClick={()=>setOpen(false)}>
                <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
                <span>Home</span>
            </Link>
            <Link id="about" className="bm-item" to="/about" onClick={()=>setOpen(false)}>
                <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
                <span>About</span>
            </Link>
            <Link id="contact" className="bm-item" to="/contact" onClick={()=>setOpen(false)}>
                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                <span>Contact Us</span>
            </Link>
            {/*<Link id="umlEditor" className="bm-item" to="/UmlEditor" onClick={()=>setOpen(false)}>*/}
            {/*    <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>*/}
            {/*    <span>UML</span>*/}
            {/*</Link>*/}
            {/*<Link id="SqlEditor" className="bm-item" to="/SqlEditor" onClick={()=>setOpen(false)}>*/}
            {/*    <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>*/}
            {/*    <span>SQL</span>*/}
            {/*</Link>*/}
        { JSON.parse(localStorage.getItem("isAdmin")) &&
            <Link to={"/admin"} onClick={()=>setOpen(false)} className="bm-item">
                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                <span>Admin</span>
            </Link>
        }
        {
            localStorage.getItem("username")!==null && <Link to={"/dashboard"} onClick={()=>setOpen(false)} className="bm-item">
                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                <span>Dashboard</span>
            </Link>
        }
        {/*<Link to={"/login"} onClick={()=>setOpen(false)} className="bm-item">*/}
        {/*    <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>*/}
        {/*    <span>Login</span>*/}
        {/*</Link>*/}
    </Menu>
  )
}