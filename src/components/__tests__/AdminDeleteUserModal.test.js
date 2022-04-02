import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import AdminDeleteUserModal from "../sharedComponents/AdminDeleteUserModal";

function renderComponent(){
    render(<AdminDeleteUserModal show={true} checkUser={()=>{}} hide={()=>{}}/>)
}

it("test input change",()=>{
    renderComponent()
    let nameInput=screen.getByTestId("nameInput")
    fireEvent.change(nameInput,{target:{value:"abc"}})
    expect(nameInput.value).toBe("abc")
})

it("test show error modal",()=>{
    renderComponent()
    let nameInput=screen.getByTestId("nameInput")
    fireEvent.change(nameInput,{target:{value:"abc"}})
    let deleteButton=screen.getByTestId("deleteUserButton")
    fireEvent.click(deleteButton)
    expect(screen.getByText(/Are you sure you want to delete this user?/i)).toBeInTheDocument()
})