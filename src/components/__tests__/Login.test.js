import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {preapareTests, login, getProjects} from "../../Utils/RoutersForTests";
import Switches from "../../Utils/Switches";

function renderComponent(){
    render(<MemoryRouter initialEntries={["/login"]}><Switches/></MemoryRouter>)
}

describe("test input change",()=>{
    it("test username change",()=>{
        renderComponent()
        let usernameInput=document.querySelector("#username")
        fireEvent.change(usernameInput,{target:{value:"abc"}})
        expect(usernameInput.value).toBe("abc")
    })

    it("test password input change",()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"1234"}})
        expect(passwordInput.value).toBe("1234")
    })

    it("test empty password",async()=>{
        renderComponent()
        let usernameInput=document.querySelector("#username")
        fireEvent.change(usernameInput,{target:{value:"abc"}})
        let saveButton=screen.getByText(/Login/i)
        fireEvent.click(saveButton)
        expect(await screen.findByText(/Please enter password/i)).toBeInTheDocument()
    })

    it("test empty username",async()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"1234"}})
        let saveButton=screen.getByText(/Login/i)
        fireEvent.click(saveButton)
        expect(await screen.findByText(/Please enter username/i)).toBeInTheDocument()
    })

    it("test navigate to register",()=>{
        renderComponent()
        let link=screen.getByText("Sign Up")
        fireEvent.click(link)
        expect(screen.getByTestId("register")).toBeInTheDocument()
    })
})

describe("test login with server",()=>{
    let server=setupServer(...[login,getProjects])
    preapareTests(server)

    function performTest(username){
        renderComponent()
        let userNameInput=document.querySelector("#username")
        fireEvent.change(userNameInput,{target:{value:username}})
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"1234"}})
        let loginButton=screen.getByText(/Login/i)
        fireEvent.click(loginButton)
    }

    it("test wrong username or password",async()=>{
        performTest("abc")
        expect(await screen.findByText(/Username or password is incorrect/i)).toBeInTheDocument()
    })

    it("test successful login",async()=>{
       performTest("ronny54")
       expect(await screen.findByTestId("dashboard")).toBeInTheDocument()
    })
})