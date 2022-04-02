import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {MemoryRouter} from "react-router-dom";
import Switches from "../../Utils/Switches";
import {createProject, preapareTests} from "../../Utils/RoutersForTests";

 function renderComponent(){
     render(<MemoryRouter initialEntries={["/createProject"]}><Switches/></MemoryRouter>)
    return screen.getByTestId("createProjectPage")
}

const server=setupServer(createProject)
preapareTests(server)

it("test that component render",()=>{
    const component=renderComponent()
    expect(component).toBeInTheDocument()
})

it("test input change",()=>{
    renderComponent()
    let projectName=document.getElementsByTagName("input")
    fireEvent.change(projectName[0],{target:{value:"abc"}})
    expect(projectName[0].value).toBe("abc")
    let description=screen.getByTestId("textarea")
    fireEvent.change(description,{target:{value:"abcd"}})
    expect(description.value).toBe("abcd")
})

// it("test successful project creation",async ()=>{
//     renderComponent()
//     let projectName=document.getElementsByTagName("input")
//     fireEvent.change(projectName[0],{target:{value:"abc"}})
//     let buttons=document.getElementsByTagName("Button")
//     fireEvent.click(buttons[0])
//     await waitForElement(()=>screen.getByText(`/editorsTabs/1`))
// })
