import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {rest} from "msw";
import {setupServer} from "msw/node";
import {serverAddress} from "../../Constants";
import {BrowserRouter} from "react-router-dom";
import ChangeDBProfiles from "../pageComponents/ChangeDBProfiles";


function createDummyData(){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    let weights=Object.fromEntries(weightsTemp)

    const person={Integrity:0.65,Consistency:["c",3]}
    person["Query Complexity"]=2
    const user={Integrity:0.9,Consistency:["a",1]}
    user["Query Complexity"]=3
    let profiles={MongoDB:person,Oracle:user}

    return {NFRAttributes: weights, DBProfiles: profiles}
}

function createServer(){
    const getDBProfiles=rest.get(serverAddress+`/admin/DBProfiles`,(req,res,ctx)=>{
        let data=createDummyData()
        return res(ctx.json(data),ctx.status(200))
    })
    const saveDBProfiles=rest.post(serverAddress+`/admin/updateDBProfiles`,(req,res,ctx)=>{
        return res(ctx.status(200))
    })
    const handlers=[getDBProfiles,saveDBProfiles]
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

