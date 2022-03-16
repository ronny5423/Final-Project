import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import {Button, Form, Modal, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip"
import {faPlus, faTrash} from "@fortawesome/fontawesome-free-solid";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import SavingSpinner from "../sharedComponents/SavingSpinner";

export default function ChangeDBProfiles(){
    const [nfrWeights,updateNFRWeights]=useState({})
    const [dbProfiles,updateDBProfiles]=useState([])
    const [showErrorModal,updateShowErrorModal]=useState(false)
    let navigate=useNavigate()
    const nfrMapping=useRef(new Map())
    const[loading,updateLoading]=useState(true)
    const[saving,updateSaving]=useState(false)

    useEffect(()=>{
        async function fetchDataFromServer(){
            // let weightsTemp=new Map();
            // weightsTemp.set("Integrity",{
            //     type:"range",
            //     values:[0,1],
            //     defaultValue:0.5
            // })
            // let labelsAndValues={a:1,b:2,c:3,d:4}
            // weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
            // let weights=Object.fromEntries(weightsTemp)
            //
            // const person={Integrity:0.65,Consistency:["c",3],queryComplexity:2}
            // const user={Integrity:0.9,Consistency:["a",1],queryComplexity:3}
            // let profiles={MongoDB:person,Oracle:user}
            //
            //
            // let response={data:{NFRWeights:weights,DBProfiles:profiles}}


            let response=await axios.get(serverAddress+`/admin/DBProfiles`)
            if(response.status!==200){
                navigate(`/error`)
                return
            }
            let dbProfilesArr=[]
            for(let key in response.data.DBProfiles){
                dbProfilesArr.push([key,response.data.DBProfiles[key],false])
            }
            response.data.NFRAttributes["Query Complexity"]={type:"range",values:[1,5],defaultValue:3}
            updateNFRWeights(response.data.NFRAttributes)
            updateDBProfiles(dbProfilesArr)
            updateLoading(false)
        }
        fetchDataFromServer()
    },[])

    function addEmptyRow(){
        let clonedDBProfiles=[...dbProfiles]
        let row=[""]
        let nfrValues={}
        for(let nfr in nfrWeights){
            nfrValues[nfr]=nfrWeights[nfr].defaultValue
        }
        row.push(nfrValues)
        row.push(true)
        clonedDBProfiles.push(row)
        updateDBProfiles(clonedDBProfiles)
    }

    function changeDBName(index,newName){
        let clonedDBProfiles=[...dbProfiles]
        clonedDBProfiles[index][0]=newName
        updateDBProfiles(clonedDBProfiles)
    }

    function createNFRWeightsRow(){
        let weightsRow=[]
        let index=0
        let mapping=new Map()
        for(let nfr in nfrWeights){
            weightsRow.push(<th>{nfr}</th>)
            mapping.set(nfr,index)
            index++
        }
        nfrMapping.current=mapping
        //weightsRow.push(<th>Query Complexity</th>)
        weightsRow.push(<th><ProjectRowTooltip  message={"Add new DB profile"} icon={faPlus} onClick={addEmptyRow}/></th>)
        return weightsRow
    }

    function changeRangeValue(index,nfrName,value){
        let clonedDBProfiles=[...dbProfiles]
        clonedDBProfiles[index][1][nfrName]=value
        updateDBProfiles(clonedDBProfiles)
    }

    function createSelect(nfrName,index){
        return(
            <td><select value={dbProfiles[index][1][nfrName][1]} onChange={e=>changeSelectValue(e.target.options[e.target.selectedIndex].text,index,nfrName,e.target.value)}>
                {createOptions(nfrName)}
            </select></td>
        )
    }

    function changeSelectValue(displayText,index,nfrName,value){
        let clonedDBProfiles=[...dbProfiles]
        clonedDBProfiles[index][1][nfrName][0]=displayText
        clonedDBProfiles[index][1][nfrName][1]=value
        updateDBProfiles(clonedDBProfiles)
    }

    function createOptions(nfrName){
        let options=[]
        for(let select in nfrWeights[nfrName].values){
            options.push(<option value={nfrWeights[nfrName].values[select]}>{select}</option>)
        }
        return options
    }

    function createRestOfRow(index){
        let nfrs=dbProfiles[index][1]
        let row=new Array(nfrMapping.current.size)
        for(let nfr in nfrs){
            if(nfrWeights[nfr].type==="select box"){
                row[nfrMapping.current.get(nfr)]=createSelect(nfr,index)
            }
            else{
                row[nfrMapping.current.get(nfr)]=(<td><div>
                        <input required type={"number"} min={nfrWeights[nfr].values[0]} max={nfrWeights[nfr].values[1]} step={0.01} value={dbProfiles[index][1][nfr]} onChange={e=>changeRangeValue(index,nfr,parseFloat(e.target.value))}/>
                        <br/>
                        <Form.Text>min={nfrWeights[nfr].values[0]} max={nfrWeights[nfr].values[1]}</Form.Text>
                    </div></td>
                )
            }
        }
        return row
    }

    function deleteDB(index){
        let clonedDBProfiles=[...dbProfiles]
        clonedDBProfiles.splice(index,1)
        updateDBProfiles(clonedDBProfiles)
    }

    function createTableBody(){
        let rows=[]
        for(let index in dbProfiles){
            rows.push(<tr>
                {/*<td><input required type={"text"} value={dbProfiles[index][0]} onChange={e=>changeDBName(index,e.target.value)}/></td>*/}
                <td>{!dbProfiles[index][2] ? dbProfiles[index][0] :<input required type={"text"} value={dbProfiles[index][0]} onChange={e=>changeDBName(index,e.target.value)}/> }</td>
                {createRestOfRow(index)}
                <td><ProjectRowTooltip data-test-id={"deleteButton"} message={"delete db"} icon={faTrash} onClick={_=>deleteDB(parseInt(index))}/></td>
            </tr>)
        }
        return rows
    }

    function sendDbProfilesToServer(event){
        //add spinner
        event.preventDefault()
        let set=new Set()
        let objToSend={}
        for(let index in dbProfiles){
            if(set.has(dbProfiles[index][0])){
                updateShowErrorModal(true)
                return
            }
            objToSend[dbProfiles[index][0]]=dbProfiles[index][1]
            set.add(dbProfiles[index][0])
        }
        updateSaving(true)
        axios.post(serverAddress+`/admin/updateDBProfiles`,objToSend).then(response=>{
            updateSaving(false)
        })
    }

    return(
        <div>
            {loading ? <LoadingSpinner /> :
                <div data-testid={"change-db-profiles"}>
                    <Form  onSubmit={sendDbProfilesToServer}>
                        <Table>
                            <thead>
                            <tr>
                                <th>DB Name</th>
                                {createNFRWeightsRow()}
                            </tr>
                            </thead>
                            <tbody>
                            {createTableBody()}
                            </tbody>
                        </Table>
                        <Button type={"submit"} variant={"success"}>Save</Button>
                        {saving && <SavingSpinner/>}
                    </Form>
                    <Modal data-testid={"modal"} show={showErrorModal} onHide={_=>updateShowErrorModal(false)} centered>
                        <Modal.Header closeButton/>
                        <Modal.Body>DB names must be unique</Modal.Body>
                    </Modal>
                </div>
            }
        </div>
    )
}