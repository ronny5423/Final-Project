import React from "react";
import {Col, Form, Row,Image,Button} from "react-bootstrap";
import {useState,useEffect} from "react";
import {useForm} from "react-hook-form";

function changePassword(){

}

function sendUpdatedDAtaToServer(event){
    // send to server updated data
}

function UserPage(){
    const [showEditButton,updateEdit]=useState(true);
    const [userDetails,updateUserDetails]=useState({});
    const { register, handleSubmit, formState: { errors },clearErrors,reset } = useForm();

    useEffect(()=>{
        // fetch user data from server
    },[]);

    return(
        <Form onSubmit={handleSubmit(sendUpdatedDAtaToServer)}>
            <Row>
                <Image src={""} fluid/>
            </Row>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
                <Form.Label column sm="2">
                    Username:
                </Form.Label>
                <Col sm="10">
                    <Form.Control name={"username"} plaintext readOnly defaultValue="ronny54" />
                </Col>
            </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="email">
                <Form.Label column sm="2">
                    Email:
                </Form.Label>
                <Col sm="10">
                    <Form.Control {...register("email",{required:true,pattern:/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/})}
                                  plaintext={showEditButton} type="email" placeholder={""} readOnly={showEditButton} defaultValue={"abc@gmail.com"} />
                    {errors?.email?.type==='required' && <p>Please enter email</p>}

                </Col>
            </Form.Group>

            /*
                Add weights
            */
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                    Weight 1:
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext={showEditButton} type="password" placeholder="********" readOnly={showEditButton} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                    Weight 2:
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext={showEditButton} type="password" placeholder="********" readOnly={showEditButton} />
                </Col>
            </Form.Group>

            <Row>
                {showEditButton ? <div>
                <Button variant="primary" onClick={()=>{
                    updateEdit(false);
                }}>Edit</Button>
                <Button variant="info" onClick={changePassword}>Change Password</Button>
            </div> :
                <div>
                    <Button variant="primary" onClick={() =>{
                        clearErrors();
                        reset({"email":"abc@gmail.com"});
                        updateEdit(true);
                    }}>Cancel</Button>
                    <Button variant="primary" type="submit" onClick={""}> Save</Button>
                </div>}
            </Row>
        </Form>
    )
}

export default UserPage;