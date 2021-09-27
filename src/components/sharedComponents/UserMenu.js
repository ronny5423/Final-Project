import React from 'react';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Button from '@restart/ui/esm/Button';
import '../cssComponents/UserMenu.css';

export default function UserMenu() {
    let isLoggedIn = false;
    let Username = 'Username';
    return (
        <div class='UserDiv'>
            { isLoggedIn 
                ?
                <div class='LoggedInDisplay'>
                    <p class='UsernameDisplay'>Welcome {Username}</p>
                    <Menu menuButton={<MenuButton class='button1'>User Menu</MenuButton>}>
                        <MenuItem>1</MenuItem>
                        <SubMenu label="Open">
                            <MenuItem>1.1</MenuItem>
                            <MenuItem>1.2</MenuItem>
                            <MenuItem>1.3</MenuItem>
                        </SubMenu>
                        <MenuItem>2</MenuItem>
                    </Menu>
                </div>
                :
                
                <div>
                    <Button class='button1'>Login</Button>
                    <Button class='button1'>Sign Up</Button>
                </div>
            }
        </div>
    );
}