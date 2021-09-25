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

import React, { useState, useCallback } from 'react'
import Hamburger from 'hamburger-react'

export function MainMenu() {
  const [isOpen, setOpen] = useState(false)

  return (
    <div>
      <Hamburger onToggle={toggled => {
        if (toggled) {
          
        } else {

        }
      }} toggle={setOpen} />
    </div>
    
  )
}