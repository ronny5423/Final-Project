import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useRef} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../cssComponents/SignUp.css"
import {serverAddress} from "../../Constants";



function SignUp(){
    const { register,getValues, handleSubmit, watch, formState: { errors } } = useForm();
    const password = useRef({});
    const[modalText,updateModalText]=useState("")
    const history=useNavigate()
    password.current = watch("password", "");

    return(
        <div>
           <Modal show={modalText!==""} onHide={_=>updateModalText("")} centered>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        <p>{modalText}</p>
                    </Modal.Body>
                </Modal>

        <Form onSubmit={handleSubmit(()=>{
            let detailsArr=getValues(["Username","password"])
            let userDetails={
                Username:detailsArr[0],
                password:detailsArr[1]
            }
            axios.post(serverAddress+`/auth/Signup`,userDetails).then(response=>{
                switch (response.status){
                    case 200:
                        history(`/login`)
                        break
                    case 409:
                        updateModalText("Username already taken!")
                        break
                    default:
                       updateModalText("Something went wrong. Please try again")
                }
            })
        })}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control name="Username" {...register("Username",{required:true})} type="text" placeholder="Enter username"  />
                {errors?.Username?.type==='required' && <p>Please enter username</p>}
                </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control {...register("password",{required: true, pattern:/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=])(?=.*[0-9]).*$/,minLength:8})} type="password" placeholder="Enter password" />
                <Form.Text className="text-muted">
                    Password must contain at least one small letter, one uppercase letter, one special char and one digit and it's length should be at least 8 characters
                </Form.Text>
                {errors?.password?.type==='pattern' && <p className={"errors"}>password must contain at least one digit, one lowercase character, one uppercase character and one special char</p>}
                {errors?.password?.type==='required' && <p className={"errors"}>Please enter password</p>}
                {errors?.password?.type==="minLength" && <p className={"errors"}>Password must be at least 8 characters long</p>}
                </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>confirm password</Form.Label>
                <Form.Control name="confirmPassword" {...register("confirmPassword",{required:"Please enter your password again",validate:{matchPassword:value=>value===password.current || "Passwords don't match"}})} type="password" placeholder="Confirm password" />
                {errors.confirmPassword && <p className={"errors"}>{errors.confirmPassword.message}</p>}
            </Form.Group>

            {/*<Form.Group className="mb-3" controlId="email">*/}
            {/*    <Form.Label>Email</Form.Label>*/}
            {/*    <Form.Control {...register("email",{required:true,pattern:/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/})} type="email" placeholder="Enter Email" />*/}
            {/*    {errors?.email?.type==='required' && <p className={"errors"}>Please enter email</p>}*/}
            {/*    {errors?.email?.type==='pattern' && <p className={"errors"}>email is invalid</p>}*/}
            {/*</Form.Group>*/}
            <Button type="submit" variant="primary">Register</Button>
        </Form>
        </div>
    )
}

export default SignUp;