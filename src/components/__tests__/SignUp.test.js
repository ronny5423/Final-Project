import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {preapareTests, register} from "../../Utils/RoutersForTests";
import Switches from "../../Utils/Switches";

function renderComponent(){
    render(<MemoryRouter initialEntries={["/register"]}><Switches/></MemoryRouter>)
}

describe("test input change",()=>{

    it("test username input",()=>{
        renderComponent()
        let userNameInput=document.querySelector("#username")
        fireEvent.change(userNameInput,{target:{value:"abc"}})
        expect(userNameInput.value).toBe("abc")
    })

    it("test password input",()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"abc"}})
        expect(passwordInput.value).toBe("abc")
    })

    it("test change password input",()=>{
        renderComponent()
        let confirmPassword=document.querySelector("#confirmPassword")
        fireEvent.change(confirmPassword,{target:{value:"abc"}})
        expect(confirmPassword.value).toBe("abc")
    })
})

describe("test wrong input",()=>{

    it("test missing elements",async()=>{
        renderComponent()
        let saveButton=screen.getByText(/Register/i)
        fireEvent.click(saveButton)
        await screen.findByTestId("userNameError")
        expect(document.getElementsByClassName("errors").length).toBe(3)

    })

    it("test minimum length password",async ()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"aBc12!"}})
        let saveButton=screen.getByText(/Register/i)
        fireEvent.click(saveButton)
        expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument()
    })

    it("test password pattern",async ()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"123456789"}})
        let saveButton=screen.getByText(/Register/i)
        fireEvent.click(saveButton)
        expect(await screen.findByText(/password must contain at least one digit, one lowercase character, one uppercase character and one special char/i)).toBeInTheDocument()
    })

    it("password and confirm password mismatch",async ()=>{
        renderComponent()
        let passwordInput=document.querySelector("#password")
        fireEvent.change(passwordInput,{target:{value:"12345678aB!"}})
        let confirmPassword=document.querySelector("#confirmPassword")
        fireEvent.change(confirmPassword,{target:{value:"123456"}})
        let saveButton=screen.getByText(/Register/i)
        fireEvent.click(saveButton)
        expect(await screen.findByText(/Passwords don't match/i)).toBeInTheDocument()
    })
})

function performTest(username){
    renderComponent()
    let userInput=document.querySelector("#username")
    fireEvent.change(userInput,{target:{value:username}})
    let passwordInput=document.querySelector("#password")
    fireEvent.change(passwordInput,{target:{value:"12345678aB!"}})
    let confirmPassword=document.querySelector("#confirmPassword")
    fireEvent.change(confirmPassword,{target:{value:"12345678aB!"}})
    let saveButton=screen.getByText(/Register/i)
    fireEvent.click(saveButton)
}

describe("test register with server",()=>{
   let server=new setupServer(register)
    preapareTests(server)
    it("test register with taken userName",async ()=>{
        performTest("ronny54")
        expect(await screen.findByText(/Username already taken!/i)).toBeInTheDocument()
    })

    it("test successful register",async()=>{
        performTest("abc")
        expect(await screen.findByTestId("login")).toBeInTheDocument()
    })
})
