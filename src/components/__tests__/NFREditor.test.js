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
    weightsTemp.set("Consistency",{type:"select box",values:["a","b","c","d"],defaultValue:"a"})
    let umlTemp={nodeDataArray:[{type:"Class",name:"Person"},{type:"Class",name: "User"}]}

    const weightsAndClassesTemp=new Map();
    weightsAndClassesTemp["Person"]=new Map();
    weightsAndClassesTemp["Person"]["Integrity"]=0.65
    weightsAndClassesTemp["Person"]["Consistency"]="c"
    weightsAndClassesTemp["User"]=new Map()
    weightsAndClassesTemp["User"]["Integrity"]=0.9
    weightsAndClassesTemp["User"]["Consistency"]="a"

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

    it("test change input",async ()=>{
        renderNFREditor(true)
        const inputElements=await screen.findAllByDisplayValue("0.5")
        fireEvent.change(inputElements[0],{target:{value:"0.75"}})
        expect(inputElements[0].value).toBe("0.75")
    })

    it("test change select box value",async ()=>{
        renderNFREditor(true)
        const selectElements=await screen.findAllByDisplayValue("a")
        fireEvent.change(selectElements[0],{target:{value:"b"}})
        expect(selectElements[0].value).toBe("b")
    })

    it("test that input saved after click on save button",async()=>{
        renderNFREditor(true)
        const inputElements=await screen.findAllByDisplayValue("0.5")
        fireEvent.change(inputElements[0],{target:{value:"0.75"}})
        const buttonElement=await screen.findByText(/Save/i)
        fireEvent.click(buttonElement)
        expect(inputElements[0].value).toBe("0.75")
    })

    it("test that select saved after click on input",async()=>{
        renderNFREditor(true)
        const selectElements=await screen.findAllByDisplayValue("a")
        fireEvent.change(selectElements[0],{target:{value:"b"}})
        const buttonElement=await screen.findByText(/Save/i)
        fireEvent.click(buttonElement)
        expect(selectElements[0].value).toBe("b")
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
        fireEvent.change(selectElements[0],{target:{value:"d"}})
        const cancelButton=await screen.findByText(/cancel/i)
        fireEvent.click(cancelButton)
        expect(selectElements[0].value).toBe("a")
    })
  })

