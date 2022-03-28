import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {BrowserRouter} from "react-router-dom";
import ChangeDBProfiles from "../pageComponents/ChangeDBProfiles";
import {getDBProfiles, preapareTests, saveDBProfiles} from "../../Utils/RoutersForTests";

function createServer(){
    const handlers=[getDBProfiles,saveDBProfiles]
    return new setupServer(...handlers)
}

async function renderComponent(){
    render(<BrowserRouter><ChangeDBProfiles/></BrowserRouter>)
    return await screen.findByTestId("change-db-profiles")
}

describe("test component render",()=>{
    const server=createServer()
    preapareTests(server)

it("test if component render",async ()=>{
    const changeDBProfilesComponent=await renderComponent()
     expect(changeDBProfilesComponent).toBeInTheDocument()
})

    it("test add new dbms button",async ()=>{
        await renderComponent()
        const buttons=document.getElementsByTagName("Button")
        fireEvent.click(buttons[0])
        const rows=document.getElementsByTagName("tr")
        expect(rows.length).toBe(4)
    })

    it("test delete row",async ()=>{
        await renderComponent()
        const deleteButton=document.getElementsByTagName("Button")
        fireEvent.click(deleteButton[1])
        const rows=document.getElementsByTagName("tr")
        expect(rows.length).toBe(2)
    })
})

describe("test change input",()=>{
    const server=createServer()
    preapareTests(server)

    it("test change range input",async()=>{
        await renderComponent()
        const inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[0],{target:{value:0.4}})
        expect(inputs[0].value).toBe("0.4")
    })

    it("test change select input",async()=>{
        await renderComponent()
        const select=document.getElementsByTagName("select")
        fireEvent.change(select[0],{target:{value:3,innerText:"c"}})
        expect(select[0].value).toBe("3")
    })

    it("test input change after adding new row",async()=>{
        await renderComponent()
        const add=document.getElementsByTagName("Button")
        fireEvent.click(add[0])
        let nameInput=screen.getByDisplayValue("")
        fireEvent.change(nameInput,{target:{value:"new db"}})
        expect(nameInput.value).toBe("new db")
    })

    it("test unique db names",async()=>{
        await renderComponent()
        const add=document.getElementsByTagName("Button")
        fireEvent.click(add[0])
        let nameInput=screen.getByDisplayValue("")
        fireEvent.change(nameInput,{target:{value:"Oracle"}})
        const saveButton=screen.getByText(/Save/i)
        fireEvent.click(saveButton)
        let modals=screen.getByTestId("modal")
        expect(modals).toBeInTheDocument()
    })
})

