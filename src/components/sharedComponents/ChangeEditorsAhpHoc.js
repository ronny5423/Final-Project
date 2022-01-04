import React, {useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";


 const changeEditorsAhpHoc=(WrappedComponent)=>{
    function ChangeEditorsAhpHoc(props){
        const[weights,updateWeights]=useState({})
        const[disabled,updateDisabled]=useState(false)
        const[showModal,updateShowModal]=useState(false)
        const saveRoute=useRef("")

        function updateState(state){
            updateWeights(state)
        }
        function updateSaveRoute(route){
            saveRoute.current=route
        }

        function changeValue(newValue,indexOfAttribute){
            let newWeights={...weights}
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
                axios.post(saveRoute.current,weights).then(res=>{
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
                <WrappedComponent updateWeights={updateState} {...props} updateSaveRoute={updateSaveRoute}/>
                <Modal show={showModal} onHide={_=>updateShowModal(false)} centered>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <p>sum of weights must be equal to 1</p>
                    </Modal.Body>
                </Modal>
                <Form onSubmit={submit}>
                    <Row>
                        <Col sm={2}>UML Weight:</Col>
                        <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} value={weights.UML} step={0.001} onChange={e=>changeValue(e.target.value,1)}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={2}>Queries Weight:</Col>
                        <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} step={0.001} value={weights.SQL} onChange={e=>changeValue(e.target.value,2)}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={2}>NFR Weight:</Col>
                        <Col sm={4}><input readOnly={disabled} type={"number"} min={0} max={1} value={weights.NFR} step={0.001} onChange={e=>changeValue(e.target.value,3)}/> </Col>
                    </Row>
                    {
                        !disabled ? <Button type={"submit"} variant={"success"}>Save</Button> :
                            <Button variant={"info"} onClick={_=>updateDisabled(false)}>Edit</Button>
                    }
                </Form>
            </div>
        )
    }

    return ChangeEditorsAhpHoc
}

export default changeEditorsAhpHoc