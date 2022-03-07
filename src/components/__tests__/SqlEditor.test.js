import {fireEvent, render, screen,cleanup} from "@testing-library/react";
import '@testing-library/jest-dom'
import SqlEditor from "../pageComponents/SqlEditor";


import {rest} from "msw";
import {setupServer} from "msw/node";
import {serverAddress} from "../../Constants";
import ValidateAllQueries from "../../Utils/SqlValidationUtils";
import addUmlClasses from "../../Utils/SqlValidationUtils";


// jest.mock("../../Utils/SqlValidationUtils", ()=>({ValidateAllQueries: jest.fn(),
// addUmlClasses: jest.fn(),
// }));


function renderSqlEditor(){
    render(<SqlEditor />)
}
jest.setTimeout(15000);
function mockData(addThirdAttribute){
    let map=new Map();
    map.set(0,{"name":"abc","tpm": 45, "selectable": true, "query": ""});
    map.set(1,{"name":"def","tpm": 45, "selectable": false, "query": ""});
    map.set(2,{"name":"quer","tpm": 45, "selectable": false, "query": ""});
    let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};


    let data={}
    if(addThirdAttribute){
        data={queries:Object.fromEntries(map),classes:classesDict}
    }
    else{
        data={queries:Object.fromEntries(map),classes:classesDict}
    }
    return data
}

function createServer(addThirdAttribute){
    const getSql = rest.get(serverAddress+`/getSql`,(req,res,ctx)=>{
        let data = mockData(addThirdAttribute)
        return res(ctx.json(data),)
    })
    const sendSql = rest.post(serverAddress+`/sendSql`,(req,res,ctx)=>{
        return res(ctx.json({}))
    })
    const handlers=[getSql,sendSql]
    return new setupServer(...handlers)
}

function prepareTests(server){
    beforeAll(()=>{server.listen()})
    //beforeEach(async ()=>{await renderSqlEditor()})
    afterEach(()=>{
        cleanup()
        server.resetHandlers()
    })
    afterAll(()=>server.close())
}


describe("test SqlEditor Component render",()=>{
    const server=createServer(false)
    prepareTests(server)

    it("test Sql component render",()=>{
        renderSqlEditor()
        const sqlComponent = screen.getByTestId('SqlEditor')
        expect(sqlComponent).toBeInTheDocument()
    })

    it("test disabled select box",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        const selectElement=document.getElementsByTagName("Form.Check")
        for(let item of selectElement){
            expect(item).toBeDisabled()
        }
    })

    it("test disabled input",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        const inputElement=document.getElementsByTagName("input")
        for(let item of inputElement){
            expect(item).toBeDisabled()
        }
    })
    it("test all inputs change to not disabled and read write after click on edit button",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const inputElements=document.getElementsByTagName("input")
        for(let item of inputElements){
            expect(item.disabled).toBe(false)

        }
    })

    it("test Button save exist after click on edit",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const saveButton = screen.getByText("Save")
        expect(saveButton).toBeInTheDocument()
    })

    it("test Button cancel exist after click on edit",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const cancelButton = screen.getByText("Cancel")
        expect(cancelButton).toBeInTheDocument()
    })

    it("test Button Add query exist after click on edit",async ()=>{
        renderSqlEditor()
        const editButton = await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const addButton = screen.getByText("Add Query")
        expect(addButton).toBeInTheDocument()
    })

})


describe("test data operations",()=>{

    const server=createServer(false)
    prepareTests(server)

    async function testDataLoaded(){
        renderSqlEditor()
        const editButton=await screen.findByText(/edit/i)
        const trs = await screen.findAllByDisplayValue("45");
        expect(trs.length).toBe(3)
    }


    it("test initial data load", async ()=>{
        await testDataLoaded()
    })

    it("test add query and save", async ()=>{
        renderSqlEditor()
        const editButton=await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const addQueryButton = await screen.findByText(/Add Query/i)
        fireEvent.click(addQueryButton)
        const queries = await screen.findAllByDisplayValue("45");
        expect(queries.length).toBe(4)
        const saveButton = await screen.findByText(/Save/i)
        fireEvent.click(saveButton)
        const inputElement=document.getElementsByTagName("input")
        for(let item of inputElement){
            expect(item).toBeDisabled()
        }
    })

    // it("test cancel button and save buttons exist", async ()=>{
    //     renderSqlEditor()
    //     const editButton=await screen.findByText(/edit/i)
    //     fireEvent.click(editButton)
    //     const addQueryButton = await screen.findByText(/Add Query/i)
    //     fireEvent.click(addQueryButton)
    //     const cancelButton = await screen.findByText(/Cancel/i)
    //     await fireEvent.click(cancelButton)
    //     const queries = await screen.findAllByDisplayValue("45");
    //     expect(queries.length).toBe(3)
    // })
})


