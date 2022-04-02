import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import AddNFRAdmin from "../sharedComponents/AddNFRAdmin";

const nfrNamesSet=new Set()
nfrNamesSet.add("Integrity")
nfrNamesSet.add("Consistency")

function renderComponent(){
    render(<AddNFRAdmin show={true} addNewNFR={()=>{}} hide={_=>{}} names={nfrNamesSet} />)
}

function addSelectValue(name,value){
    let selectRadio=document.querySelector("#selectRadio")
    fireEvent.click(selectRadio)
    let selectName=document.querySelector("#selectName")
    fireEvent.change(selectName,{target:{value:name}})
    let selectValue=document.querySelector("#selectValue")
    fireEvent.change(selectValue,{target:{value:value}})
    let addButton=screen.getByText(/Add Select Choice/i)
    fireEvent.click(addButton)
}

describe("test input change",()=>{
    it("change nfr name",()=>{
        renderComponent()
        let nfrNameInput=document.querySelector("#nfrName")
        fireEvent.change(nfrNameInput,{target:{value:"abc"}})
        expect(nfrNameInput.value).toBe("abc")
    })

    it("change radio value",async()=>{
        renderComponent()
        let selectRadio=document.querySelector("#selectRadio")
        fireEvent.click(selectRadio)
        expect(await screen.findByTestId("selectDiv")).toBeInTheDocument()
    })

    it("test change range inputs(Max value, Min value, default value)",()=>{
        renderComponent()
        let minValue=document.querySelector("#minimum")
        fireEvent.change(minValue,{target:{value:"0"}})
        expect(minValue.value).toBe("0")
        let maxValue=document.querySelector("#maximum")
        fireEvent.change(maxValue,{target:{value:"1"}})
        expect(maxValue.value).toBe("1")
        let defaultValue=document.querySelector("#defaultValue")
        fireEvent.change(defaultValue,{target:{value:"0.75"}})
        expect(defaultValue.value).toBe("0.75")
    })

    it("test ahp change",()=>{
        renderComponent()
        let ahpInput=document.querySelector("#ahp")
        fireEvent.change(ahpInput,{target:{value:"0.3"}})
        expect(ahpInput.value).toBe("0.3")
    })



    it("test select input change",()=>{
        renderComponent()
        addSelectValue("a","1")
        expect(screen.getByTestId("selectValuesRows")).toBeInTheDocument()
    })

    it("test add 2 select, change default value and delete one of them",async()=>{
        renderComponent()
        addSelectValue("a","1")
        addSelectValue("b","2")
        expect(screen.getAllByTestId("selectValuesRows").length).toBe(2)
        let select=screen.getByTestId("defaultSelect")
        fireEvent.change(select,{target:{value:"2",innerText:"b"}})
        expect(select.innerText).toBe("b")
        let deleteButtons=screen.getAllByTestId("deleteSelect")
        fireEvent.click(deleteButtons[1])
        expect(screen.getAllByTestId("selectValuesRows").length).toBe(1)
    })
})

describe("test errors",()=>{
    it("test add same select names",()=>{
        renderComponent()
        addSelectValue("a","1")
        addSelectValue("a","1")
        expect(screen.getByText(/Select Data Names must be unique/i)).toBeInTheDocument()
    })

    it("test add same select values",()=>{
        renderComponent()
        addSelectValue("a","1")
        addSelectValue("b","1")
        expect(screen.getByText(/Select data values must be unique/i)).toBeInTheDocument()
    })

    it("test negative select value",()=>{
        renderComponent()
        addSelectValue("a","-4")
        expect(screen.getByText(/Select value must be 0 or greater/i)).toBeInTheDocument()
    })

    function findAndClickOnErrorModal(){
        let errorModal=screen.getByText(/Errors/i)
        expect(errorModal).toBeInTheDocument()
        fireEvent.click(errorModal)
    }

    it("test missing values",()=>{
        renderComponent()
        let addButton=screen.getByTestId("addButton")
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        let nfrName=document.querySelector("#nfrName")
        fireEvent.change(nfrName,{target:{value:"newNFR"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        let maximum=document.querySelector("#maximum")
        fireEvent.change(maximum,{target:{value:"1"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        let minimun=document.querySelector("#minimum")
        fireEvent.change(minimun,{target:{value:"0"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        let defaultValue=document.querySelector("#defaultValue")
        fireEvent.change(defaultValue,{target:{value:"0.5"}})
        findAndClickOnErrorModal()
        let ahp=document.querySelector("#ahp")
        fireEvent.change(ahp,{target:{value:"-0.5"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
    })

    it("test range NFR errors",()=>{
        renderComponent()
        let nfrName=document.querySelector("#nfrName")
        fireEvent.change(nfrName,{target:{value:"abc"}})
        let minimum=document.querySelector("#minimum")
        fireEvent.change(minimum,{target:{value:"1"}})
        let maximum=document.querySelector("#maximum")
        fireEvent.change(maximum,{target:{value:"0"}})
        let addButton=screen.getByTestId("addButton")
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        fireEvent.change(maximum,{target:{value:"2"}})
        let defaultValue=document.querySelector("#defaultValue")
        fireEvent.change(defaultValue,{target:{value:"3"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
        fireEvent.change(defaultValue,{target:{value:"-2"}})
        fireEvent.click(addButton)
        findAndClickOnErrorModal()
    })

    it("test existing nfr name",()=>{
        renderComponent()
        let nfrName=document.querySelector("#nfrName")
        fireEvent.change(nfrName,{target:{value:"Integrity"}})
        let addButton=screen.getByTestId("addButton")
        fireEvent.click(addButton)
        expect(screen.getByText(/Nfr Name must be unique/i)).toBeInTheDocument()
    })

    it("test missing select values",()=>{
        renderComponent()
        let nfrName=document.querySelector("#nfrName")
        fireEvent.change(nfrName,{target:{value:"abc"}})
        let selectRadio=document.querySelector("#selectRadio")
        fireEvent.click(selectRadio)
        let ahp=document.querySelector("#ahp")
        fireEvent.change(ahp,{target:{value:"0.3"}})
        let addButton=screen.getByTestId("addButton")
        fireEvent.click(addButton)
        expect(screen.getByText(/Select NFR must have at least one value/i)).toBeInTheDocument()
    })
})