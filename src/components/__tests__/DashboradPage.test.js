import {fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {MemoryRouter} from "react-router-dom";
import Switches from "../../Utils/Switches";
import {deleteProject, getProjects, preapareTests} from "../../Utils/RoutersForTests";

async function renderComponent(){
    render(<MemoryRouter initialEntries={["/dashboard"]}><Switches/></MemoryRouter>)
    await screen.findByTestId("dashboard")
}

let server=setupServer(getProjects,deleteProject)
preapareTests(server)

it("test that all projects rendered",async()=>{
    await renderComponent()
    let rows=screen.getAllByTestId("projectRow")
    expect(rows.length).toBe(20)
})

it("test that search input rendered and input changed",async()=>{
    await renderComponent()
    expect(screen.getByTestId("searchDiv")).toBeInTheDocument()
    let searchInput=document.getElementsByTagName("input")
    fireEvent.change(searchInput[0],{target:{value:"abc"}})
    expect(searchInput[0].value).toBe("abc")
})

it("test hover on add project button",async()=>{
    await renderComponent()
    let addButton=document.getElementsByTagName("Button")[1]
    fireEvent.mouseOver(addButton)
    expect(screen.getByText(/Create new project/i)).toBeInTheDocument()
})

it("test that after click on add button, moving to create new project",async()=>{
    await renderComponent()
    let addButton=document.getElementsByTagName("Button")[1]
    fireEvent.click(addButton)
    expect(await screen.findByTestId("createProjectPage")).toBeInTheDocument()
})

it("test delete project from last page where there is only 1 project in last page",async ()=>{
    await renderComponent()
    fireEvent.click(screen.getByTestId("last"))
    await waitForElementToBeRemoved(screen.getByText(/Loading/i))
    expect(screen.getAllByTestId("projectRow").length).toBe(1)
    expect(screen.getAllByTestId("page").length).toBe(1)
    let deleteProjectButton=screen.getByTestId("DeleteProject")
    fireEvent.click(deleteProjectButton)
    fireEvent.click(screen.getByTestId("yesDeleteProject"))
    expect(screen.getByTestId("savingSpinner")).toBeInTheDocument()
    await waitForElementToBeRemoved(screen.getByTestId("savingSpinner"))
    await waitForElementToBeRemoved(screen.getByText(/Loading/i))
    expect(screen.getAllByTestId("projectRow").length).toBe(20)
    for(let i=1;i<=10;i++){
        expect(screen.getByText(i)).toBeInTheDocument()
    }
})

it("test delete project and fill from spare",async()=>{
    await renderComponent()
    let deleteProjectButton=screen.getAllByTestId("DeleteProject")
    fireEvent.click(deleteProjectButton[5])
    fireEvent.click(screen.getByTestId("yesDeleteProject"))
    await waitForElementToBeRemoved(screen.getByTestId("savingSpinner"))
    expect(screen.getAllByTestId("projectRow").length).toBe(20)
})