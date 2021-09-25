import React, { useState, useCallback } from 'react'
import Menu, { MenuList } from 'react-animation-menu'
import { Group, Item } = MenuList
import 
 
const elements = (
  <Group>
    <Item onClick={() => console.log('Hello')}>Hello</Item>
    <Item>Menu2</Item>
    <Item>Menu3</Item>
  </Group>
)
 
export default function App() {
  const [open, setOpen] = useState(false);
 
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);
 
  return (
    <Menu
      color="green"
      elements={elements}
      duration={400}
      width={70}
      xOffset={40}
      onClick={handleClick}
    />
  )
}