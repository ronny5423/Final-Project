import React, {useRef, useState} from "react";
import {Button, Form, Modal, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip"
import {faTrash} from "@fortawesome/fontawesome-free-solid";

export default function AddNFRAdmin(props){
    const [nfrName,updateNFRName]=useState("")
    const [nfrType,updateNFRType]=useState("range")
    const [rangeData,updateRangeData]=useState([NaN,NaN,NaN])
    const [selectData,updateSelectData]=useState({values:{},defaultValue:[]})
    const [selectDataName,updateSelectDataName]=useState("")
    const [selectDataValue,updateSelectValue]=useState("")
    const [ahp,updateAhp]=useState("")
    const [showErrorModal,updateShowErrorModal]=useState(false)
    const errorMessage=useRef([])

    function changeRangeData(newValue,index){
        let arr=[...rangeData]
        arr[index]=newValue
        updateRangeData(arr)
    }

    function addSelect(event){
        event.preventDefault()
        errorMessage.current=[]
        for(let selectName in selectData.values){
            if(selectName===selectDataName){
                errorMessage.current.push("Select Data Names must be unique")
                updateShowErrorModal(true)
                return
            }
        }
        if(selectDataName==="" || selectDataValue===""){
            errorMessage.current.push("Select name and values must be non empty")
            updateShowErrorModal(true)
            return;
        }
        let obj={...selectData}
        obj.values[selectDataName]=parseFloat(selectDataValue)
        updateSelectDataName("")
        updateSelectValue("")
        updateSelectData(obj)
    }

    function deleteValue(selectName){
        let obj={...selectData}
        delete obj.values[selectName]
        updateSelectData(obj)
    }

    function changeSelectDefaultValue(displayText,value){
        let obj={...selectData}
        obj.defaultValue[0]=displayText
        obj.defaultValue[1]=value
        updateSelectData(obj)
    }

    function save(event){
        event.preventDefault()
        errorMessage.current=[]
        if(nfrName===""){
            errorMessage.current.push("Nfr name cannot be empty")
            updateShowErrorModal(true)
            return;
        }
        if(props.names.has(nfrName)){
            errorMessage.current.push("Nfr Name must be unique")
            updateShowErrorModal(true)
            return
        }
        let copiedData={}
        if(nfrType==="range"){
            checkRangeNFR()
            copiedData.defaultValue=rangeData[2]
            copiedData.values=rangeData.slice(0,2)
            }
        else {
            if(Object.keys(selectData.values).length===0){
                errorMessage.current.push("Select NFR must have at least one value")
                }
            else{
                let clonedData={...selectData}
                if(clonedData.defaultValue.length===0){
                    clonedData.defaultValue.push(Object.keys(clonedData.values)[0])
                    clonedData.defaultValue.push(Object.values(clonedData.values)[0])
                }
                let newValues=[]
                for(let selectName in selectData.values){
                    let obj={}
                    obj[selectName]=selectData.values[selectName]
                    newValues.push(obj)
                }
                clonedData.values= newValues
                copiedData=clonedData
            }

        }
        checkAHP()
        if(errorMessage.current.length>0){
            updateShowErrorModal(true)
        }
        else{
            let newNFR={}
            copiedData.type=nfrType
            copiedData.ahp=parseFloat(ahp)
            newNFR[nfrName]=copiedData
            props.addNewNFR(newNFR)
            props.hide()
            resetStates()
        }
    }

    function checkAHP(){
        if(isNaN(ahp)){
            errorMessage.current.push("AHP value cannot be empty")
        }
        if(parseFloat(ahp)<=0){
            errorMessage.current.push("AHP value must be greater than 0")
        }
    }

    function resetStates(){
       updateNFRName("")
        updateNFRType("range")
        updateRangeData([NaN,NaN,NaN])
        updateSelectData({values:{},defaultValue:[]})
        updateSelectDataName("")
        updateSelectValue("")
        updateAhp("")
        errorMessage.current=[]
    }

    function checkRangeNFR(){
        if(isNaN(rangeData[0]) || isNaN(rangeData[1]) || isNaN(rangeData[2])){
            errorMessage.current.push("all values must be filled")
        }
        else if(rangeData[0]>rangeData[1]){
            errorMessage.current.push("maximum value must be greater than minimum")
        }
        else if(rangeData[2]<rangeData[0] || rangeData[2]>rangeData[1]){
            errorMessage.current.push("default value must be within range")
        }
        else if(rangeData[0]<0 || rangeData[1]<0 || rangeData[2]<0){
            errorMessage.current.push("Values cannot be less than 0")
        }
    }


    function createSelectDefaultValue(){
        let options=[]
        for(let option in selectData.values){
            options.push(<option value={selectData.values[option]}>{option}</option>)
        }
        return options
    }

    function createSelectValuesTable(){
        let rows=[]
        for(let selectName in selectData.values){
            rows.push(<tr>
                <td>{selectName}</td>
                <td>{selectData.values[selectName]}</td>
                <td><ProjectRowTooltip message={"delete value"} icon={faTrash} onClick={_=>deleteValue(selectName)}/></td>
            </tr>)
        }
        return rows
    }

    return(
        <div>
        <Modal show={props.show} centered onHide={props.hide}>
            <Modal.Header closeButton>Add New NFR</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>NFR Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter NFR name" value={nfrName} onChange={e=>updateNFRName(e.target.value)} />
                     </Form.Group>
                    <Form.Group>
                    <Form.Label>NFR Type</Form.Label> <br/>
                    <Form.Check type={"radio"} label={"Range"} checked={nfrType==="range"} onChange={e=>updateNFRType("range")} inline/>
                    <Form.Check type={"radio"} label={"Select Box"} checked={nfrType==="select box"} onChange={e=>updateNFRType("select box")} inline/>
                    </Form.Group>
                    {(nfrType==="range") ?
                        <Form.Group>
                        <Form.Group>
                            <Form.Label>Minimum Value:</Form.Label>
                            <Form.Control type={"number"} value={rangeData[0]} onChange={e=>changeRangeData(parseFloat(e.target.value),0)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Maximum Value:</Form.Label>
                            <Form.Control type={"number"} value={rangeData[1]} onChange={e=>changeRangeData(parseFloat(e.target.value),1)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Default Value</Form.Label>
                            <Form.Control type={"number"} value={rangeData[2]} onChange={e=>changeRangeData(parseFloat(e.target.value),2)}/>
                        </Form.Group>
                        </Form.Group>
                        :
                        <div>
                            <Form.Group>
                                <Form.Label>Select Value Name:</Form.Label>
                                <Form.Control type={"text"} value={selectDataName} onChange={e=>updateSelectDataName(e.target.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Value:</Form.Label>
                                <Form.Control type={"number"} value={selectDataValue} onChange={e=>updateSelectValue(e.target.value)}/>
                            </Form.Group>
                            <Button type={"info"} onClick={addSelect} disabled={selectDataName==="" || selectDataValue===""}>Add Select Choice</Button>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                 createSelectValuesTable()
                                }
                                </tbody>
                            </Table>
                            <Form.Group>
                                <Form.Label>Default Value</Form.Label>
                            <select value={selectData.defaultValue[1]} onChange={e=>changeSelectDefaultValue(e.target.options[e.target.selectedIndex].text,parseFloat(e.target.value))}>
                                {createSelectDefaultValue()}
                            </select>
                            </Form.Group>
                        </div>
                    }
                    <Form.Group>
                        <Form.Label>AHP Value</Form.Label>
                        <Form.Control type={"number"} value={ahp} onChange={e=>updateAhp(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <Button variant={"success"} onClick={save}>Add</Button>
                    <Button variant={"info"} onClick={props.hide}>Cancel</Button>
                </div>
            </Modal.Footer>
        </Modal>
        <Modal show={showErrorModal}   onHide={_=>updateShowErrorModal(false)} centered>
            <Modal.Header closeButton>Errors</Modal.Header>
            <Modal.Body>
                {errorMessage.current.map((message,index)=><p key={index}>{message}</p>)}
            </Modal.Body>
        </Modal>
        </div>
    )
}