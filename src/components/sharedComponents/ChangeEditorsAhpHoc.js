import React, {useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import ButtonWithSpinner from "./ButtonWithSpinner";
import SavingSpinner from "./SavingSpinner";

 const changeEditorsAhpHoc=(WrappedComponent)=>{
    function ChangeEditorsAhpHoc(props){
        const[weights,updateWeights]=useState({})
        const[disabled,updateDisabled]=useState(false)
        const[showModal,updateShowModal]=useState(false)
        const [saveRoute,changeRoute]=useState("")
        const projectId=useRef(undefined)
        const[saving,updateSaving]=useState(false)

        function updateState(state){
            updateWeights(state)
        }
        function updateSaveRoute(route,projectID=undefined){
            changeRoute(route)
            projectId.current=projectID
        }

        function changeValue(newValue,indexOfAttribute){
            let newWeights={...weights}
            newValue=parseFloat(newValue)
            switch (indexOfAttribute){
                case 1:
                    newWeights.UML=newValue
                    break
                case 2:
                    newWeights.SQL=newValue
                    break
                case 3:
                    newWeights.NFR=newValue
                    break
            }
            updateWeights(newWeights)
        }

        function submit(event){
            event.preventDefault()
            if(weights.UML+weights.SQL+weights.NFR===1){
                let objToSend={}
                if(projectId.current===undefined){
                    objToSend.AHP=weights
                }
                else{
                    objToSend.ProjectID=projectId.current
                    objToSend.Weights=weights
                }
                updateSaving(true)
                axios.post(saveRoute,objToSend).then(res=>{
                    if(res.status===200){
                        updateDisabled(true)
                        if(showModal){
                            updateShowModal(false)
                        }
                    }
                    updateSaving(false)
                })

            }
            else{
                updateShowModal(true)
            }
        }

        return(
            <div>
                <WrappedComponent updateWeights={updateState} {...props} updateSaveRoute={updateSaveRoute}/>
                {saveRoute==="" ? <LoadingSpinner /> :
                    <div data-testid={"ahp"}>
                        <h1>AHP</h1>
                        <Modal data-testid={"modal"} show={showModal} onHide={_=>updateShowModal(false)} centered>
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>
                                <p>sum of weights must be equal to 1</p>
                            </Modal.Body>
                        </Modal>
                        <Form>
                            <Row>
                                <Col sm={2}>UML Weight:</Col>
                                <Col sm={4}><input required readOnly={disabled} type={"number"} min={0} max={1} value={weights.UML} step={0.001} onChange={e=>changeValue(e.target.value,1)}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm={2}>Queries Weight:</Col>
                                <Col sm={4}><input required readOnly={disabled} type={"number"} min={0} max={1} step={0.001} value={weights.SQL} onChange={e=>changeValue(e.target.value,2)}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm={2}>NFR Weight:</Col>
                                <Col sm={4}><input required readOnly={disabled} type={"number"} min={0} max={1} value={weights.NFR} step={0.001} onChange={e=>changeValue(e.target.value,3)}/> </Col>
                            </Row>
                            {
                                !disabled ? <Button onClick={submit} variant={"success"}>Save</Button> :
                                    <Button variant={"info"} onClick={_=>updateDisabled(false)}>Edit</Button>
                            }
                        </Form>
                        {saving && <SavingSpinner/>}
                    </div>
                }
            </div>
        )
    }

    return ChangeEditorsAhpHoc
}

export default changeEditorsAhpHoc