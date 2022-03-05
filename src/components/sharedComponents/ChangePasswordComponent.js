import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import ButtonWithSpinner from "./ButtonWithSpinner";
import axios from "axios";
import {serverAddress} from "../../Constants";

export default function ChangePasswordComponent(props){
    const { register,getValues, handleSubmit, watch, formState: { errors } } = useForm();
    const[updating,changeUpdating]=useState(false)

    function submit(){
        let newPassword=getValues("newPassword")
        let passwordToSendToServer={password:newPassword}
        changeUpdating(true)
        try{
            axios.post(serverAddress+`/users/updatePassword`,passwordToSendToServer).then(response=>{
                changeUpdating(false)
                props.hide()
            })
        }
        catch(error){

        }
    }

    return(
        <Modal centered show={props.show} onHide={props.hide}>
            <Modal.Header closeButton/>
            <Modal.Body>
                <Form onSubmit={handleSubmit(submit)}>
                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control {...register("newPassword",{required: true, pattern:/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=])(?=.*[0-9]).*$/,minLength:8})} type="password" placeholder="Enter password" />
                        <Form.Text className="text-muted">
                            Password must contain at least one small letter, one uppercase letter, one special char and one digit and it's length should be at least 8 characters
                        </Form.Text>
                        {errors?.password?.type==='pattern' && <p className={"errors"}>password must contain at least one digit, one lowercase character, one uppercase character and one special char</p>}
                        {errors?.password?.type==='required' && <p className={"errors"}>Please enter password</p>}
                        {errors?.password?.type==="minLength" && <p className={"errors"}>Password must be at least 8 characters long</p>}
                    </Form.Group>
                    {updating ? <ButtonWithSpinner variant={"primary"} label={"Update"}/> : <Button type="submit" variant="primary">Update</Button>}
                </Form>
            </Modal.Body>
        </Modal>
    )
}