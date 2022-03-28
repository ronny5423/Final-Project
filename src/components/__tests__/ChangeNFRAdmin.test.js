import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {setupServer} from "msw/node";
import {BrowserRouter} from "react-router-dom";
import ChangeNFRAdmin from "../pageComponents/ChangeNFRAdmin";
import {getNFRAdmin, preapareTests, updateNFRAdmin} from "../../Utils/RoutersForTests";

async function renderComponent(){
    render(<BrowserRouter><ChangeNFRAdmin/></BrowserRouter>)
    return await screen.findByTestId("nfrAdmin")
}

describe("test component render",()=>{
    const server=setupServer(...[getNFRAdmin,updateNFRAdmin])
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
    const server=setupServer(...[getNFRAdmin,updateNFRAdmin])
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

const server=setupServer(...[getNFRAdmin,updateNFRAdmin])
preapareTests(server)

it("test add new NFR",async()=>{
    await renderComponent()
    let addButton=screen.getByTestId("add")
    fireEvent.click(addButton)
    let nfrName=document.querySelector("#nfrName")
    fireEvent.change(nfrName,{target:{value:"abc"}})
    let maximumInput=document.querySelector("#maximum")
    fireEvent.change(maximumInput,{target:{value:"1"}})
    let minimum=document.querySelector("#minimum")
    fireEvent.change(minimum,{target:{value:"0"}})
    let defaultValue=document.querySelector("#defaultValue")
    fireEvent.change(defaultValue,{target:{value:"0.5"}})
    let ahp=document.querySelector("#ahp")
    fireEvent.change(ahp,{target:{value:"0.3"}})
    let saveButton=screen.getByTestId("addButton")
    fireEvent.click(saveButton)
    expect(document.getElementsByClassName("nfrRow").length).toBe(3)
})