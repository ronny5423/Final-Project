import {cleanup, fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import '@testing-library/jest-dom'
import NFREditor from "../pageComponents/NFREditor";
import {setupServer} from "msw/node";
import {BrowserRouter} from "react-router-dom";
import {getNFRAndWeights, getWeights, preapareTests, saveNFR, updateNFR} from "../../Utils/RoutersForTests";

async function renderNFREditor(editable,renderWithEditorId=false){
    if(renderWithEditorId){
        render(<BrowserRouter><NFREditor editable={editable} id={1} projectId={1} classes={["Person","User"]} updateEditorId={()=>{}}/></BrowserRouter>)
    }
    else{
        render(<BrowserRouter><NFREditor editable={editable}  projectId={1} classes={["Person","User"]} updateEditorId={()=>{}}/></BrowserRouter>)
    }
    return await screen.findByTestId('NFREditor')
}

function createServer(){
    const handlers=[getWeights,getNFRAndWeights,saveNFR,updateNFR]
    return new setupServer(...handlers)
}

describe("test Nfr Component render",()=>{
    const server=createServer()
    preapareTests(server)

    it("test Nfr component render",async()=>{
        expect(await renderNFREditor(true)).toBeInTheDocument()
    })

    it("test disabled select box",async ()=>{
        await renderNFREditor(false)
        const selectElement=document.getElementsByTagName("select")
        for(let item of selectElement){
            expect(item).toBeDisabled()
        }
    })

    it("test read only input",async()=>{
        await renderNFREditor(false)
        const inputElement=document.getElementsByTagName("input")
        for(let item of inputElement){
            expect(item.readOnly).toBeTruthy()
        }
    })
    it("test all inputs change to disabled and read only after click on save button",async()=>{
        await renderNFREditor(true)
        const buttonElement=document.getElementsByTagName("button")[0]
        fireEvent.click(buttonElement)
        const inputElements=document.getElementsByTagName("input")
        for(let item of inputElements){
            expect(item.readOnly).toBeTruthy()

        }
    })

    it("test Button change to edit after click on save",async()=>{
        await renderNFREditor(true)
        const buttonElement=document.getElementsByTagName("button")[0]
        fireEvent.click(buttonElement)
        const editButton=screen.getByText("Edit")
        expect(editButton).toBeInTheDocument()
    })

})

describe("test input changing",()=>{
    const server=createServer()
    preapareTests(server)

    async function testInputChange(oldValue,newValue){
        await renderNFREditor(true)
        const elements=await screen.findAllByDisplayValue(oldValue)
        fireEvent.change(elements[0],{target:{value:newValue,innerText:"b"}})
        expect(elements[0].value).toBe(newValue)
    }

    async function testAfterClickSave(oldValue,newValue){
        await renderNFREditor(true)
        const inputElements=await screen.findAllByDisplayValue(oldValue)
        fireEvent.change(inputElements[0],{target:{value:newValue,innerText:"b"}})
        const buttonElement=await screen.findByText(/Save/i)
        fireEvent.click(buttonElement)
        await waitForElementToBeRemoved(screen.getByTestId("savingSpinner"))
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
        await renderNFREditor(true)
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
    const server=createServer()
    preapareTests(server)

    it("test cancel changes on input",async()=>{
        await renderNFREditor(false, true)
        const editButton= await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const inputElements=await screen.findAllByDisplayValue("0.65")
        fireEvent.change(inputElements[0],{target:{value:"0.2"}})
        const cancelButton=await screen.findByText(/cancel/i)
        fireEvent.click(cancelButton)
        expect(inputElements[0].value).toBe("0.65")
    })

    it("test cancel changes on select",async()=>{
        await renderNFREditor(false, true)
        const editButton=await screen.findByText(/edit/i)
        fireEvent.click(editButton)
        const selectElements=await screen.findAllByDisplayValue("a")
        fireEvent.change(selectElements[0],{target:{value:"4"}})
        const cancelButton=await screen.findByText(/cancel/i)
        fireEvent.click(cancelButton)
        expect(selectElements[0].value).toBe("1")
    })
  })
