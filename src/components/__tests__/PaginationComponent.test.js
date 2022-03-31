import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import PaginationComponent from "../sharedComponents/PaginationComponent";

function renderComponent(){
    render(<PaginationComponent draw={true} fetchData={()=>{}} numberOfElements={500}/>)
}

it("test that show 10 pages",()=>{
    renderComponent()
    for(let i=1;i<=10;i++){
        expect(screen.getByText(i)).toBeInTheDocument()
    }
})

it("test click on next",async()=>{
    renderComponent()
    let next=screen.getByTestId("next")
    fireEvent.click(next)
    for(let i=11;i<=20;i++){
        expect(await screen.findByText(i)).toBeInTheDocument()
    }
})

it("test click on next and previous",async ()=>{
    renderComponent()
    let next=screen.getByTestId("next")
    fireEvent.click(next)
    await screen.findByText(11)
    let previous=screen.getByTestId("prev")
    fireEvent.click(previous)
    for(let i=1;i<=10;i++){
        expect(await screen.findByText(i)).toBeInTheDocument()
    }
})

it("click on last",async ()=>{
    renderComponent()
    let last=screen.getByTestId("last")
    fireEvent.click(last)
    for(let i=21;i<=25;i++){
        expect(await screen.findByText(i)).toBeInTheDocument()
    }
})

it("click on first",async()=>{
    renderComponent()
    let next=screen.getByTestId("next")
    fireEvent.click(next)
    await screen.findByText(11)
    let first=screen.getByTestId("first")
    fireEvent.click(first)
    for(let i=1;i<=10;i++){
        expect(await screen.findByText(i)).toBeInTheDocument()
    }
})