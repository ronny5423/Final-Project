import React from "react";
import {Button, Form} from "react-bootstrap";
import {useRef} from "react";
import {useForm} from "react-hook-form";

function submit(userDetails){
    //send username, password and email to server
}

function SignUp(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = useRef({});
    password.current = watch("password", "");

    return(
        <Form onSubmit={handleSubmit(submit)}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" {...register("username",{required:true, validate:{freeUsername:value=>value==="Ron" || "Username isn't free"}})} type="text" placeholder="Enter username"  />
                {errors?.username?.type==='required' && <p>Please enter username</p>}
                {errors.username && <p>{errors.username.message}</p>}
                </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control {...register("password",{required: true, pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,minLength:6})} type="password" placeholder="Enter password" />
                <Form.Text className="text-muted">
                    Password must contain at least one letter and one digit and it's length should be at least 8 characters
                </Form.Text>
                {errors?.password?.type==='pattern' && <p>password must contain at least one digit and one character</p>}
                {errors?.password?.type==='required' && <p>Please enter password</p>}
                </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>confirm password</Form.Label>
                <Form.Control name="confirmPassword" {...register("confirmPassword",{required:"Please enter your password again",validate:{matchPassword:value=>value===password.current || "Passwords don't match"}})} type="password" placeholder="Confirm password" />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control {...register("email",{required:true,pattern:/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/})} type="email" placeholder="Enter Email" />
                {errors?.email?.type==='required' && <p>Please enter email</p>}
                {errors?.email?.type==='pattern' && <p>email is invalid</p>}
            </Form.Group>
            <Button type="submit" variant="primary">Register</Button>
        </Form>
    )
}

export default SignUp;