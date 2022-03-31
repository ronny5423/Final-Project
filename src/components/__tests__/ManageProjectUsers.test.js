import {fireEvent, render, screen,waitForElementToBeRemoved} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {MemoryRouter} from "react-router-dom";
import Switches from "../../Utils/Switches";
import {addUserToProject, getProjectUsers, preapareTests, removeUser} from "../../Utils/RoutersForTests";

async function renderComponent(){
    render(<MemoryRouter initialEntries={["/manageUsers/1/ronny54"]}><Switches/></MemoryRouter>)
    await screen.findByTestId("manageProjectUsers")
}

let server=setupServer(...[getProjectUsers,removeUser,addUserToProject])
preapareTests(server)

it("test that 20 users shown",async ()=>{
    await renderComponent()
    let rows=screen.getAllByTestId("user")
    expect(rows.length).toBe(20)
})

it("test that there are 21 buttons",async ()=>{
    localStorage.setItem("username","ronny54")
    await renderComponent()
    let buttons=document.getElementsByTagName("Button")
    expect(buttons.length).toBe(21)
    localStorage.removeItem("username")
})

it("test that there are no buttons if logged in user is not owner or admin",async()=>{
    await renderComponent()
    let buttons=document.getElementsByTagName("Button")
    expect(buttons.length).toBe(0)
})

it("test that delete button works",async()=>{
    localStorage.setItem("username","ronny54")
    await renderComponent()
    let buttons=document.getElementsByTagName("Button")
    expect(buttons.length).toBe(21)
    fireEvent.click(buttons[1])
    let savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    let rows=screen.getAllByTestId("user")
    expect(rows.length).toBe(20)
    fireEvent.click(buttons[2])
    savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    rows=screen.getAllByTestId("user")
    expect(rows.length).toBe(19)
    localStorage.removeItem("username")
})

it("test add user to project",async()=>{
    localStorage.setItem("username","ronny54")
    await renderComponent()
    expect(screen.getByText(2)).toBeInTheDocument()
    expect(screen.getByText(1)).toBeInTheDocument()
    let buttons=document.getElementsByTagName("Button")
    fireEvent.click(buttons[1])
    let savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    expect(screen.queryByText(2)).toBeNull()
    buttons=document.getElementsByTagName("Button")
    fireEvent.click(buttons[1])
    savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    buttons=document.getElementsByTagName("Button")
    fireEvent.click(buttons[0])
    let input=document.getElementsByTagName("input")[0]
    fireEvent.change(input,{target:{value:"eran german"}})
    let addButton=screen.getByTestId("addButton")
    fireEvent.click(addButton)
    savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    expect(screen.getAllByTestId("user").length).toBe(20)
    localStorage.removeItem("username")
})

it("test page adds when adding user",async()=>{
    localStorage.setItem("username","ronny54")
    await renderComponent()
    let buttons=document.getElementsByTagName("Button")
    fireEvent.click(buttons[1])
    let savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    expect(screen.queryByText(2)).toBeNull()
    buttons=document.getElementsByTagName("Button")
    fireEvent.click(buttons[0])
    let input=document.getElementsByTagName("input")[0]
    fireEvent.change(input,{target:{value:"eran german"}})
    let addButton=screen.getByTestId("addButton")
    fireEvent.click(addButton)
    savingSpinner=screen.getByTestId("savingSpinner")
    await waitForElementToBeRemoved(savingSpinner)
    expect(screen.getByText(2)).toBeInTheDocument()
})