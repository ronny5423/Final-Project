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
    </Menu>
  )
}