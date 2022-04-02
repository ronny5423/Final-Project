import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import AddUserToProject from "../sharedComponents/AddUserToProject";
import {addUserToProject, preapareTests} from "../../Utils/RoutersForTests";
import {BrowserRouter} from "react-router-dom";

function renderComponent(){
    render(<BrowserRouter><AddUserToProject projectId={1} addUser={()=>{}} show={true} hide={()=>{}}/></BrowserRouter>)
}

let server=setupServer(addUserToProject)
preapareTests(server)

it("test input change",()=>{
    renderComponent()
    let input=document.getElementsByTagName("input")
    fireEvent.change(input[0],{target:{value:"abc"}})
    expect(input[0].value).toBe("abc")
})

it("test empty input",()=>{
    renderComponent()
    let button=screen.getByTestId("addButton")
    fireEvent.click(button)
    let modal=document.getElementsByClassName("errorModal")
    expect(modal.length).toBeGreaterThan(0)
})