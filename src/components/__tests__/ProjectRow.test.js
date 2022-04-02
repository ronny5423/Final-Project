import {cleanup, fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import '@testing-library/jest-dom'
import ProjectRow from "../sharedComponents/ProjectRow";
import {BrowserRouter} from "react-router-dom";
import {setupServer} from "msw/node";
import {editProjectNameAndDescription, preapareTests} from "../../Utils/RoutersForTests";

function renderComponent(){
    render(<BrowserRouter><ProjectRow projectId={1} projectOwner={""} umlEditor={1} sqlEditor={2} nfrEditor={3} projectDescription={""}
    ahpWeights={[]} projectName={"abc"} deleteProject={() => {
}} index={1} /></BrowserRouter>)
}

let server=setupServer(editProjectNameAndDescription)
preapareTests(server)

it("test that component has 5 buttons",()=>{
    renderComponent()
    let buttons=document.getElementsByTagName("Button")
    expect(buttons.length).toBe(6)
})

it("test delete modal show",()=>{
    renderComponent()
    let deleteButton=screen.getByTestId("DeleteProject")
    fireEvent.click(deleteButton)
    expect(screen.getByText(/Are you sure you want to delete the project?/i)).toBeInTheDocument()
})

it("test edit project name and description",async()=>{
    renderComponent()
    let editButton=screen.getByTestId("editProjectDescription")
    fireEvent.click(editButton)
    let projectNameInput=document.querySelector("#projectName")
    fireEvent.change(projectNameInput,{target:{value:"name"}})
    expect(projectNameInput.value).toBe("name")
    let projectDescriptionInput=document.querySelector("#projectDescription")
    fireEvent.change(projectDescriptionInput,{target:{value:"descriptionDescription"}})
    expect(projectDescriptionInput.value).toBe("descriptionDescription")
    let saveButton=screen.getByText(/Save/i)
    fireEvent.click(saveButton)
    await waitForElementToBeRemoved(screen.getByTestId("savingSpinner"))
    await waitForElementToBeRemoved(screen.getByTestId("editForm"))
    expect(screen.getByText(/descriptionDescription/i)).toBeInTheDocument()
})