import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {rest} from "msw";
import {setupServer} from "msw/node";
import {serverAddress} from "../../Constants";
import {BrowserRouter} from "react-router-dom";
import ChangeEditorsAhpAdmin from "../pageComponents/ChangeEditorsAhpAdmin";

async function renderComponent(){
    render(<BrowserRouter><ChangeEditorsAhpAdmin/></BrowserRouter>)
    return await screen.findByTestId("ahp")
}

function createServer(){
    const getAHP=rest.get(serverAddress+`/admin/AHP`,(req,res,ctx)=>{
        let ahp={UML:0.5,SQL:0.2,NFR:0.3}
        return res(ctx.json(ahp),ctx.status(200))
    })
    const saveAHP=rest.post(serverAddress+`/admin/updateAHP`,(req,res,ctx)=>{
        return res(ctx.status(200))
    })
    let handlers=[getAHP,saveAHP]
    return new setupServer(...handlers)
}

function preapareTests(server){
    beforeAll(()=>server.listen())
    afterEach(()=>{
        cleanup()
        server.resetHandlers()
    })
    afterAll(()=>server.close())
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
})