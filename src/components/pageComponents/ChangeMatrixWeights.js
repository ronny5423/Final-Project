import React,{useState,useEffect} from "react";
import axios from "axios"
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {serverAddress} from "../../Constants";

const weightsObj={
    uml:0.4,
    queries:0.3,
    nfr:0.3
}

export function ChangeMatrixWeights(props){
    const[weights,updateWeights]=useState(weightsObj)
    const[disabled,updateDisabled]=useState(false)
    const[showModal,updateShowModal]=useState(false)

    useEffect(_=>{
        async function getWeightsFromServer(){
            let response=await axios.get(serverAddress+`/ahp`)
            if(response.status===200){
                updateWeights(response.data)
            }
          }
        getWeightsFromServer()
    },[])

    function changeValue(newValue,indexOfAttribute){
        let newWeights={...weights}
        switch (indexOfAttribute){
            case 1:
                newWeights.uml=newValue
                break
            case 2:
                newWeights.queries=newValue
                break
            case 3:
                newWeights.nfr=newValue
                break
        }
        updateWeights(newWeights)
    }

    function submit(event){
        event.preventDefault()
        if(weights.uml+weights.queries+weights.nfr===1){
            axios.put(`server address`,weights).then(res=>{
                if(res.status===201){
                    updateDisabled(true)
                    if(showModal){
                        updateShowModal(false)
                    }
                }
            })
        }
        else{
            updateShowModal(true)
        }
    }

    return(
        <div>
            <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <p>sum of weights must be equal to 1</p>
                </Modal.Body>
            </Modal>
            <Form onSubmit={submit}>
                <Row>
                    <Col sm={2}>UML Weight:</Col>
                    <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} value={weights.uml} step={0.001} onChange={e=>changeValue(e.target.value,1)}/></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={2}>Queries Weight:</Col>
                    <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} step={0.001} value={weights.queries} onChange={e=>changeValue(e.target.value,2)}/></Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={2}>NFR Weight:</Col>
                    <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} value={weights.nfr} step={0.001} onChange={e=>changeValue(e.target.value,3)}/> </Col>
                </Row>
                {
                    !disabled ? <Button type={"submit"} variant={"success"}>Save</Button> :
                        <Button variant={"info"} onClick={_=>updateDisabled(false)}>Edit</Button>
                }
            </Form>
        </div>
    )
}
