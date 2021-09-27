import React from 'react'
import { scaleRotate as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfo, faEnvelope } from '@fortawesome/fontawesome-free-solid'
import '../cssComponents/MainMenu.css'

export default function MainMenu() {
  return (
    <Menu>
      <a id="home" class="bm-item" href="/">
        <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
        <span>Home</span>
      </a>
      <a id="about" class="bm-item" href="/about">
        <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
        <span>About</span>
      </a>
      <a id="contact" class="bm-item" href="/contact">
        <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
        <span>Contact Us</span>
      </a>
    </Menu>
  )
}