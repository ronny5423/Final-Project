import React, {useRef, useState} from "react";
import {Tabs, Tab, Button, Modal} from "react-bootstrap";
import NFREditor from "./NFREditor";
import {ChangeMatrixWeights} from "./ChangeMatrixWeights";
import UmlEditor from "./UmlEditor";
import SqlEditor from "./SqlEditor";

function CreateProjectPage(){
    const [key,setKey]=useState("Uml");
    const [showModal,updateShowModal]=useState(false)
    const moveToOtherTabs=useRef(false)

    function changeMoveToOtherTabs(){
        moveToOtherTabs.current=true
    }

    function createProject(){
    //todo
    }

    function shouldMoveToOtherTabs(key){
        if(!moveToOtherTabs.current){
            updateShowModal(true)
        }
        else{
            setKey(key)
        }
    }

    return(
        <div>
            <h1>Project Creation</h1>
            <br/>
            <div id={"projectNAmeInput"}>
                <p>Please enter project name:</p>
                <input type={"text"}/>
            </div>
            <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <p>You must create and save Uml before moving to other editors</p>
                </Modal.Body>
            </Modal>
            <Tabs defaultActiveKey={"Uml"}  activeKey={key} onSelect={(key)=>shouldMoveToOtherTabs(key)}>
                <Tab title={"Uml"} id={"uml"} eventKey={"Uml"}>
                    <UmlEditor changeUmlStatus={changeMoveToOtherTabs}/>
                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>
                   <SqlEditor/>
                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>
                    <NFREditor editibale={true}/>
                </Tab>
                <Tab title={"changeWeights"} eventKey={"changeWeights"} id={"changeWeights"}>
                    <ChangeMatrixWeights/>
                </Tab>
            </Tabs>
            <Button onClick={createProject} variant={"success"}>Create Project</Button>
        </div>
    )
}

export default CreateProjectPage;