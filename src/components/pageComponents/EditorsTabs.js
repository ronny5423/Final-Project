import React, {useRef, useState} from "react";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import UmlEditor from "./UmlEditor";
import SqlEditor from "./SqlEditor";
import NFREditor from "./NFREditor";
import {ChangeMatrixWeights} from "./ChangeMatrixWeights";
import {useParams} from "react-router-dom";

export default function EditorsTabs(props){
    const [key,setKey]=useState("Uml");
    const [showModal,updateShowModal]=useState(false)
    const moveToOtherTabs=useRef(false)
    let {umlEditorId,sqlEditorId,nfrEditorId,projectId}=useParams()
    let classes=useRef({})

    function changeMoveToOtherTabs(shouldMove){
        moveToOtherTabs.current=shouldMove
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

    function updateClasses(classesArr){
        classes.current=classesArr
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
                    <UmlEditor id={umlEditorId} changeUmlStatus={changeMoveToOtherTabs} projectId={projectId} updateClasses={updateClasses}/>
                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>
                    <SqlEditor id={sqlEditorId} projectId={projectId} classes={classes.current}/>
                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>
                    <NFREditor id={nfrEditorId} projectId={projectId} editibale={true} classes={Object.keys(classes.current)}/>
                </Tab>
                <Tab title={"changeWeights"} eventKey={"changeWeights"} id={"changeWeights"}>
                    <ChangeMatrixWeights id={props.ahpEditorId}/>
                </Tab>
            </Tabs>
            <Button variant={"success"} onClick={calculateAlgorithm}>Calculate</Button>
        </div>
    )
}