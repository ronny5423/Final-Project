import React, {useRef, useState} from "react";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import UmlEditor from "./UmlEditor";
import SqlEditor from "./SqlEditor";
import NFREditor from "./NFREditor";
import {ChangeMatrixWeights} from "./ChangeMatrixWeights";

export default function EditorsTabs(props){
    const [key,setKey]=useState("Uml");
    const [showModal,updateShowModal]=useState(false)
    const moveToOtherTabs=useRef(false)

    function changeMoveToOtherTabs(){
        moveToOtherTabs.current=true
    }

    function shouldMoveToOtherTabs(key){
        if(!moveToOtherTabs.current){
            updateShowModal(true)
        }
        else{
            setKey(key)
        }
    }

    function calculateAlgorithm(){
        if(!moveToOtherTabs){
            updateShowModal(true)
        }
        else{
            //todo
        }
    }

    return(
        <div>
            <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <p>You must create and save Uml before moving to other editors or using the algorithm</p>
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
            <Button variant={"success"} onClick={calculateAlgorithm}>Calculate</Button>
        </div>
    )
}