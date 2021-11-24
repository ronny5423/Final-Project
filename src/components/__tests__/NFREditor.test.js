import {fireEvent, render, screen,cleanup} from "@testing-library/react";
import '@testing-library/jest-dom'
import NFREditor from "../pageComponents/NFREditor";
import {rest} from "msw";
import {setupServer} from "msw/node";
import {serverAddress} from "../../Constants";

function renderNFREditor(editable){
    render(<NFREditor editable={editable}/>)
}
function mockData(addThirdAttribute){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    let umlTemp={nodeDataArray:[{type:"Class",name:"Person"},{type:"Class",name: "User"}]}

    const weightsAndClassesTemp=new Map();
    weightsAndClassesTemp["Person"]=new Map();
    weightsAndClassesTemp["Person"]["Integrity"]=0.65
    weightsAndClassesTemp["Person"]["Consistency"]=["c",3]
    weightsAndClassesTemp["User"]=new Map()
    weightsAndClassesTemp["User"]["Integrity"]=0.9
    weightsAndClassesTemp["User"]["Consistency"]=["a",1]

    let data={}
    if(addThirdAttribute){
        data={weightsArr:Object.fromEntries(weightsTemp),uml:umlTemp,valueOfWeightAndClass:weightsAndClassesTemp}
    }
    else{
        data={weightsArr:Object.fromEntries(weightsTemp),uml:umlTemp}
    }
    return data
}

function createServer(addThirdAttribute){
    const getNFR=rest.get(serverAddress+`/getNFR`,(req,res,ctx)=>{
        let data=mockData(addThirdAttribute)
        return res(ctx.json(data),)
    })
    const sendNFR=rest.post(serverAddress+`/sendNFR`,(req,res,ctx)=>{
        return res(ctx.json({}))
    })
    const handlers=[getNFR,sendNFR]
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


describe("test Nfr Component render",()=>{
    const server=createServer(false)
    preapareTests(server)

    it("test Nfr component render",()=>{
        renderNFREditor(true)
        const nfrComponent=screen.getByTestId('NFREditor')
        expect(nfrComponent).toBeInTheDocument()
    })

    it("test disabled select box",()=>{
        renderNFREditor(false)
        const selectElement=document.getElementsByTagName("select")
        for(let item of selectElement){
            expect(item).toBeDisabled()
        }
    })

    it("test read only input",()=>{
        renderNFREditor(false)
        const inputElement=document.getElementsByTagName("input")
        for(let item of inputElement){
            expect(item.readOnly).toBeTruthy()
        }
    })
    it("test all inputs change to disabled and read only after click on save button",()=>{
        renderNFREditor(true)
        const buttonElement=document.getElementsByTagName("button")[0]
        fireEvent.click(buttonElement)
        const inputElements=document.getElementsByTagName("input")
        for(let item of inputElements){
            expect(item.readOnly).toBeTruthy()

        }
    })

    it("test Button change to edit after click on save",()=>{
        renderNFREditor(true)
        const buttonElement=document.getElementsByTagName("button")[0]
        fireEvent.click(buttonElement)
        const editButton=screen.getByText("Edit")
        expect(editButton).toBeInTheDocument()
    })

})

describe("test input changing",()=>{
    const server=createServer(false)
    preapareTests(server)

    async function testInputChange(oldValue,newValue){
        renderNFREditor(true)
        const elements=await screen.findAllByDisplayValue(oldValue)
        fireEvent.change(elements[0],{target:{value:newValue,innerText:"b"}})
        expect(elements[0].value).toBe(newValue)
    }

    async function testAfterClickSave(oldValue,newValue){
        renderNFREditor(true)
        const inputElements=await screen.findAllByDisplayValue(oldValue)
        fireEvent.change(inputElements[0],{target:{value:newValue,innerText:"b"}})
        const buttonElement=await screen.findByText(/Save/i)
        fireEvent.click(buttonElement)
        expect(inputElements[0].value).toBe(newValue)
    }
    it("test change input",async ()=>{
        await testInputChange("0.5","0.75")
    })

    it("test change select box value",async ()=>{
        await testInputChange("a","2")
    })

    it("test that input saved after click on save button",async()=>{
        await testAfterClickSave("0.5","0.75")
    })

    it("test that select saved after click on input",async()=>{
        await testAfterClickSave("a","2")
    })

    it("test change input value after click on save and edit",async ()=>{
        renderNFREditor(true)
        const inputElements=await screen.findAllByDisplayValue("0.5")
        fireEvent.change(inputElements[0],{target:{value:"0.75"}})
        const saveButton=await screen.findByText(/save/i)
        fireEvent.click(saveButton)
        const editButton=await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        fireEvent.change(inputElements[0],{target:{value:"0.2"}})
        const newSaveButton=await screen.findByText(/save/i)
        fireEvent.click(newSaveButton)
        expect(inputElements[0].value).toBe("0.2")
    })
})

describe("test previous states",()=>{
    const server=createServer(true)
    preapareTests(server)

    it("test cancel changes on input",async()=>{
        renderNFREditor(false)
        const editButton= await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const inputElements=await screen.findAllByDisplayValue("0.65")
        fireEvent.change(inputElements[0],{target:{value:"0.2"}})
        const cancelButton=await screen.findByText(/cancel/i)
        fireEvent.click(cancelButton)
        expect(inputElements[0].value).toBe("0.65")
    })

    it("test cancel changes on select",async()=>{
        renderNFREditor(false)
        const editButton=await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const selectElements=await screen.findAllByDisplayValue("a")
        fireEvent.change(selectElements[0],{target:{value:"4"}})
        const cancelButton=await screen.findByText(/cancel/i)
        fireEvent.click(cancelButton)
        expect(selectElements[0].value).toBe("1")
    })
  })
