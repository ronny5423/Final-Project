import React, {useRef, useState} from "react";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import UmlEditor from "./UmlEditor";
import SqlEditor from "./SqlEditor";
import NFREditor from "./NFREditor";
import ChangeMatrixWeights from "./ChangeMatrixWeights";
import {useNavigate, useParams} from "react-router-dom";

export default function EditorsTabs(props){
    const [key,setKey]=useState("Uml");
    const [showModal,updateShowModal]=useState(false)
    const moveToOtherTabs=useRef(false)
    let {umlEditorId,sqlEditorId,nfrEditorId,umlAHP,sqlAHP,nfrAHP,projectId}=useParams()
    let classes=useRef({})
    let missingEditorsError=useRef(true)
    let navigate=useNavigate()

    function updateEditorId(id,editor){
        switch (editor){
            case 1:
                umlEditorId=id
                break
            case 2:
                sqlEditorId=id
                break
            case 3:
                nfrEditorId=id
                break

        }
    }

    function changeMoveToOtherTabs(shouldMove){
        moveToOtherTabs.current=shouldMove
    }

    function shouldMoveToOtherTabs(key){
        if(!moveToOtherTabs.current){
            missingEditorsError.current=false
            updateShowModal(true)
        }
        else{
            setKey(key)
        }
    }

    function calculateAlgorithm(){
        if(umlEditorId && sqlEditorId && nfrEditorId){
            navigate('/algorithmResults/'+ projectId)
          }
        else{
            missingEditorsError.current=true
            updateShowModal(true)
        }
    }

    function updateClasses(classesArr){
        classes.current=classesArr
    }

    return(
        <div>
            <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                <Modal.Header closeButton/>
                <Modal.Body>
                    {missingEditorsError.current ? <p> You must fill all editors before calculating the algorithm</p>
                        :<p>You must create and save Uml before moving to other editors or using the algorithm</p>}
                </Modal.Body>
            </Modal>
            <Tabs defaultActiveKey={"Uml"}  activeKey={key} onSelect={(key)=>shouldMoveToOtherTabs(key)}>
                <Tab title={"Uml"} id={"uml"} eventKey={"Uml"}>


                    <UmlEditor id={umlEditorId} changeUmlStatus={changeMoveToOtherTabs} projectId={projectId} updateClasses={updateClasses} updateEditorId={updateEditorId}/>
                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>
                    <SqlEditor id={sqlEditorId} projectId={projectId} classes={classes.current} updateEditorId={updateEditorId}/>
                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>
                    <NFREditor id={nfrEditorId} projectId={projectId} editable={true} classes={Object.keys(classes.current)} updateEditorId={updateEditorId}/>

                </Tab>
                <Tab title={"changeWeights"} eventKey={"changeWeights"} id={"changeWeights"}>
                    <ChangeMatrixWeights id={projectId} umlAhp={umlAHP} sqlAhp={sqlAHP} nfrAhp={nfrAHP} />
                    <Button variant={"success"} onClick={calculateAlgorithm}>Calculate</Button>
                </Tab>
            </Tabs>

        </div>
    )
}