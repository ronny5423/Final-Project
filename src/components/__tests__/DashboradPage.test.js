import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {MemoryRouter} from "react-router-dom";
import Switches from "../../Utils/Switches";
import {getProjects, preapareTests} from "../../Utils/RoutersForTests";

async function renderComponent(){
    render(<MemoryRouter initialEntries={["/dashboard"]}><Switches/></MemoryRouter>)
    await screen.findByTestId("dashboard")
}

let server=setupServer(getProjects)
preapareTests(server)

it("test that all projects rendered",async()=>{
    await renderComponent()
    let rows=screen.getAllByTestId("projectRow")
    expect(rows.length).toBe(10)
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