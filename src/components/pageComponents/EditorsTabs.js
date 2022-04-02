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
    let {umlEditorId,umlAHP,sqlAHP,nfrAHP,projectId}=useParams()
    const editorsID=useRef({umlID: umlEditorId, sqlID: localStorage.getItem("sqlId"), nfrID: localStorage.getItem("nfrId")})
    let classes=useRef({})
    let missingEditorsError=useRef(true)
    let navigate=useNavigate()

    function updateEditorId(id,editor){
        switch (editor){
            case 1:
                editorsID.current.umlID=id
                break
            case 2:
                editorsID.current.sqlID=id
                break
            case 3:
                editorsID.current.nfrID=id
                break
            default:
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
        if(editorsID.current.umlID && editorsID.current.sqlID && editorsID.current.nfrID){
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
        <div data-testid={"editorsTabs"}>
            <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                <Modal.Header closeButton/>
                <Modal.Body>
                    {missingEditorsError.current ? <p> You must fill all editors before calculating the algorithm</p>
                        :<p>You must create and save Uml before moving to other editors or using the algorithm</p>}
                </Modal.Body>
            </Modal>
            <Tabs defaultActiveKey={"Uml"}  activeKey={key} onSelect={(key)=>shouldMoveToOtherTabs(key)}>
                <Tab title={"Uml"} id={"uml"} eventKey={"Uml"}>


                    <UmlEditor id={(umlEditorId===undefined || umlEditorId===null) ? undefined : parseInt(umlEditorId)} changeUmlStatus={changeMoveToOtherTabs} projectId={parseInt(projectId)} updateClasses={updateClasses} updateEditorId={updateEditorId}/>
                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>
                    <SqlEditor id={(editorsID.current.sqlID===undefined || editorsID.current.sqlID===null) ? undefined : parseInt(editorsID.current.sqlID)} projectId={parseInt(projectId)} classes={classes.current} updateEditorId={updateEditorId}/>
                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>
                    <NFREditor id={(editorsID.current.nfrID===undefined || editorsID.current.nfrID===null) ? undefined : parseInt(editorsID.current.nfrID)} projectId={parseInt(projectId)} editable={(editorsID.current.nfrID===undefined || editorsID.current.nfrID===null)} classes={Object.keys(classes.current)} updateEditorId={updateEditorId}/>

                </Tab>
                <Tab title={"changeWeights"} eventKey={"changeWeights"} id={"changeWeights"}>
                    <ChangeMatrixWeights id={parseInt(projectId)} umlAhp={umlAHP===undefined ? umlAHP : parseFloat(umlAHP)} sqlAhp={sqlAHP===undefined ? sqlAHP : parseFloat(sqlAHP)} nfrAhp={nfrAHP===undefined ? nfrAHP : parseFloat(nfrAHP)} />
                    <Button variant={"success"} onClick={calculateAlgorithm}>Calculate</Button>
                </Tab>
            </Tabs>

        </div>
    )
}