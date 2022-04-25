import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {BrowserRouter} from "react-router-dom";
import ChangeEditorsAhpAdmin from "../pageComponents/ChangeEditorsAhpAdmin";
import {getAHPAdmin, preapareTests, saveAHPAdmin} from "../../Utils/RoutersForTests";

async function renderComponent(){
    render(<BrowserRouter><ChangeEditorsAhpAdmin/></BrowserRouter>)
    return await screen.findByTestId("ahp")
}

function createServer(){
    let handlers=[getAHPAdmin,saveAHPAdmin]
    return new setupServer(...handlers)
}

describe("test component render",()=>{
    let server=createServer()
    preapareTests(server)

    it("test component render",async()=>{
        let component=await renderComponent()
        expect(component).toBeInTheDocument()
    })

    it("test number Of Rows",async()=>{
        await renderComponent()
        let rows=document.getElementsByTagName("input")
        expect(rows.length).toBe(3)
   })
})

describe("test input and button change",()=>{
    let server=createServer()
    preapareTests(server)

    it("test uml input change",async()=>{
        await renderComponent()
        let inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[0],{target:{value:0.3}})
        expect(inputs[0].value).toBe("0.3")
    })

    it("test sql input change",async()=>{
        await renderComponent()
        let inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[1],{target:{value:0.3}})
        expect(inputs[1].value).toBe("0.3")
    })

    it("test modal show",async()=>{
        await renderComponent()
        let inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[1],{target:{value:0.3}})
        let saveButton=screen.getByText(/Save/i)
        fireEvent.click(saveButton)
        expect(screen.getByTestId("modal")).toBeInTheDocument()
    })

    it("change save button to edit",async()=>{
        await renderComponent()
        let saveButton=screen.getByText(/Save/i)
        fireEvent.click(saveButton)
        let editButton=await screen.findByText(/Edit/i)
        expect(editButton).toBeInTheDocument()
    })

    it("test that the sum of weights is equal to 1",async()=>{
        await renderComponent()
        let inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[0],{target:{value:"0.5"}})
        fireEvent.change(inputs[1],{target:{value:"0.5"}})
        fireEvent.change(inputs[2],{target:{value:"0.2"}})
        fireEvent.click(screen.getByText(/Save/i))
        expect(screen.getByTestId("modal")).toBeInTheDocument()
    })
})