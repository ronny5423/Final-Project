import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {rest} from "msw";
import {setupServer} from "msw/node";
import {serverAddress} from "../../Constants";
import {BrowserRouter} from "react-router-dom";
import ChangeNFRAdmin from "../pageComponents/ChangeNFRAdmin";

async function renderComponent(){
    render(<BrowserRouter><ChangeNFRAdmin/></BrowserRouter>)
    return await screen.findByTestId("nfrAdmin")
}

function createDummyData(){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    let weightsObj= Object.fromEntries(weightsTemp)
    let ahp={"Integrity":0.2,"Consistency":0.8}
    return {Attributes:weightsObj,Weights:ahp}
}

function preapareTests(server){
    beforeAll(()=>server.listen())
    afterEach(()=>{
        cleanup()
        server.resetHandlers()
    })
    afterAll(()=>server.close())
}

function createServer(){
    const getNFR=rest.get(serverAddress+`/admin/NFR`,(req,res,ctx)=>{
        return res(ctx.json(createDummyData()),ctx.status(200))
    })
    const updateNFR=rest.post(serverAddress+`/admin/updateNFR`,(req,res,ctx)=>{
        return res(ctx.status(200))
    })
    return setupServer(...[getNFR,updateNFR])
}

describe("test component render",()=>{
    const server=createServer()
    preapareTests(server)

    it("test that component renders",async ()=>{
        const nfr=await renderComponent()
        expect(nfr).toBeInTheDocument()
    })

    it("check add nfr and save buttons render",async()=>{
        await renderComponent()
        const addButton=screen.getByTestId("add")
        const saveButton=screen.getByTestId("save")
        expect(addButton).toBeInTheDocument()
        expect(saveButton).toBeInTheDocument()
    })

    it("test that table has 2 rows",async()=>{
        await renderComponent()
        const rows=document.getElementsByClassName("nfrRow")
        expect(rows.length).toBe(2)
    })

    it("test that range values table has 2 rows",async()=>{
        await renderComponent()
        const max=screen.getByTestId("max")
        const min=screen.getByTestId("min")
        expect(max).toBeInTheDocument()
        expect(min).toBeInTheDocument()
    })

    it("test that select table has 4 rows",async()=>{
        await renderComponent()
        const rows=document.getElementsByClassName("selectTableRow")
        expect(rows.length).toBe(4)
    })
})

describe("test input change",()=>{
    const server=createServer()
    preapareTests(server)

    it("test change input in input tag",async()=>{
        await renderComponent()
        const inputs=document.getElementsByTagName("input")
        fireEvent.change(inputs[0],{target:{value:"abcd"}})
        expect(inputs[0].value).toBe("abcd")
    })

    it("test select value change",async()=>{
        await renderComponent()
        const select=document.getElementsByTagName("select")
        fireEvent.change(select[0],{target:{value:3,innerText:"c"}})
        expect(select[0].innerText).toBe("c")
    })

    it("test wrong range input",async()=>{
        await renderComponent()
        const min=screen.getByTestId("min")
        fireEvent.change(min,{target:{value:2}})
        const save=screen.getByTestId("save")
        fireEvent.click(save)
        let modal=document.getElementsByClassName("modal-dialog")
        expect(modal.length).toBe(1)
        fireEvent.click(modal[0])
        fireEvent.change(min,{target:{value:0}})
        let defaultValue=screen.getByTestId("defaultValue")
        fireEvent.change(defaultValue,{target:{value:5}})
        fireEvent.click(save)
        modal=document.getElementsByClassName("modal-dialog")
        expect(modal.length).toBe(1)
        fireEvent.click(modal[0])
        fireEvent.change(defaultValue,{target:{value:""}})
        fireEvent.click(save)
        modal=document.getElementsByClassName("modal-dialog")
        expect(modal.length).toBe(1)
    })

    const deleteFunction=async (id)=>{
        await renderComponent()
        let deleteSelect=screen.getAllByTestId(id)
        for(let i=0;i<deleteSelect.length;i++){
            fireEvent.click(deleteSelect[i])
        }
        let save=screen.getByTestId("save")
        fireEvent.click(save)
        let modal=document.getElementsByClassName("modal-dialog")
        expect(modal.length).toBe(1)
    }

    it("test no select",async()=>{
        await deleteFunction("deleteSelect")
    })

    it("test no nfr",async()=>{
        await deleteFunction("deleteNFR")
    })

    it("test add select value",async()=>{
        await renderComponent()
        let addSelect=screen.getByTestId("addSelect")
        fireEvent.click(addSelect)
        let rows=document.getElementsByClassName("selectTableRow")
        expect(rows.length).toBe(5)
    })
})