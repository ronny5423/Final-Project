import React, { useState } from "react";
import {Form, Modal} from "react-bootstrap";
import { Button } from "react-bootstrap";
import "../cssComponents/Login.css";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import {serverAddress} from "../../Constants";
import ButtonWithSpinner from "./ButtonWithSpinner";

export default function Login() {
  const { register,getValues, handleSubmit, watch, formState: { errors } } = useForm();
  const [showErrorModal,updateShowErrorModal]=useState(false)
  let navigate=useNavigate()
  const[loggingIn,updateLogIn]=useState(false)

  async function submit(){
    updateLogIn(true)
    try{
      let response=await axios.post(serverAddress+`/auth/Login`,getValues())
      localStorage.setItem("username",getValues("Username"))
      localStorage.setItem("isAdmin",JSON.stringify(response.data))
      updateLogIn(false)
      navigate(`/dashboard`)
    }
    catch (error){
      updateLogIn(false)
      updateShowErrorModal(true)
    }
  }

  return (
    <div data-testid={"login"} className="Login">
      <Modal show={showErrorModal} centered onHide={_=>updateShowErrorModal(false)}>
        <Modal.Header closeButton/>
        <Modal.Body>
          Username or password is incorrect
        </Modal.Body>
      </Modal>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit(submit)}>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control name="Username" {...register("Username",{required:true})} type="text" placeholder="Enter username"  />
          {errors?.Username?.type==='required' && <p>Please enter username</p>}
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
              {...register("password",{required: true})} type="password" placeholder="Enter password"
          />
          {errors?.password?.type==='required' && <p className={"errors"}>Please enter password</p>}
        </Form.Group>
        {loggingIn ? <ButtonWithSpinner variant={"primary"} label={"Login"}/> : <Button block size="lg" type="submit">Login</Button>}
      </Form>
      <p style={{margin: '0px'}}>Don't have an account ?</p>
      <Link to={"/register"}>Sign Up</Link>
    </div>
  );
}