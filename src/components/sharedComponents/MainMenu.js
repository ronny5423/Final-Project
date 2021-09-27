// import React, { useState, useCallback } from 'react'
// import Menu, { MenuList } from 'react-animation-menu'
// const { Group, Item } = MenuList
 
// const elements = (
//   <Group>
//     <Item onClick={() => console.log('Hello')}>Home</Item>
//     <Item onClick={() => console.log('Hello')}>Examples</Item>
//     <Item onClick={() => console.log('Hello')}>ContactUs</Item>
//     <Item onClick={() => console.log('Hello')}>About</Item>
//   </Group>
// )
 
// export function MainMenu() {
//   const [open, setOpen] = useState(false);
 
//   const handleClick = useCallback(() => {
//     setOpen(!open);
//   }, [open]);
 
//   return (
//     <Menu
//       color="black"
//       elements={elements}
//       duration={400}
//       width={100}
//       xOffset={40}
//       onClick={handleClick}
//     />
//   )
// }

// import React, { useState, useCallback } from 'react'
// import Hamburger from 'hamburger-react'

// export function MainMenu() {
//   const [isOpen, setOpen] = useState(false)

//   return (
//     <div>
//       <Hamburger onToggle={toggled => {
//         if (toggled) {
          
//         } else {

//         }
//       }} toggle={setOpen} />
//     </div>
    
//   )
// }

import React from 'react'
import { scaleRotate as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfo, faEnvelope } from '@fortawesome/fontawesome-free-solid'
import SignUp from '../pageComponents/SignUp';

import '../cssComponents/MainMenu.css'


export default function MainMenu() {
  function showSettings (event) {
    event.preventDefault();
  }

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