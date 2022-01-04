import React, {useEffect, useRef, useState} from "react";
import {Modal, Table} from "react-bootstrap";
import ProjectRowTooltip from "../sharedComponents/ProjectRowTooltip";
import {faPlus, faSave, faTrash} from "@fortawesome/fontawesome-free-solid";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import AddNFRAdmin from "../sharedComponents/AddNFRAdmin";

export default function ChangeNFRAdmin(){
    const [nfr,updateNfr]=useState([])
    const [showError,updateShowError]=useState(false)
    const errorMessage=useRef([])
    const [showAddNFR,updateShowAddNFR]=useState(false)
    const nfrNamesSet=useRef(new Set())
    let navigate=useNavigate()

    useEffect(_=>{
        async function fetchNFRFromServer(){
            let weightsTemp=new Map();
            weightsTemp.set("Integrity",{
                type:"range",
                values:[0,1],
                defaultValue:0.5
            })
            let labelsAndValues={a:1,b:2,c:3,d:4}
            weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
            let weightsObj= Object.fromEntries(weightsTemp)
            let ahp={"Integrity":0.2,"Consistency":0.8}
            let response={data:{nfrWeights:weightsObj,nfrAHP:ahp}}
            // let response=await axios.get(serverAddress+`/admin/getNFRWeights`)
            // if(response.status!==200){
            //     navigate(`/error`)
            //     return
            // }
            let nfrWeights=response.data.nfrWeights
            let arr=[]
            for(let nfrName in response.data.nfrAHP){
                nfrNamesSet.current.add(nfrName)
                nfrWeights[nfrName].ahp=response.data.nfrAHP[nfrName]
                let obj={}
                obj[nfrName]=nfrWeights[nfrName]
                arr.push(obj)
                if(nfrWeights[nfrName].type==="select box"){
                    let selectArr=updateSelectMapping(nfrWeights[nfrName].values)
                    nfrWeights[nfrName].values=selectArr
                }
            }
           updateNfr(arr)
        }
        fetchNFRFromServer()
    },[])

    function updateSelectMapping(data){
        let arr=[]
        for(let value in data){
            let obj={}
            obj[value]=data[value]
            arr.push(obj)
        }
        return arr
    }

    function changeNFRName(oldName,newName,index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        nfrNamesSet.current.delete(oldName)
        nfrNamesSet.current.add(newName)
        let value=clonedNfrObject[index][oldName]
        let obj={}
        obj[newName]=value
        clonedNfrObject.splice(index,1,obj)
        updateNfr(clonedNfrObject)
    }

    function changeSelectValueName(nfrName,oldName,newName,index,indexInSelect){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        let value=clonedNfrObject[index][nfrName].values[indexInSelect][oldName]
        let obj={}
        obj[newName]=value
        clonedNfrObject[index][nfrName].values.splice(indexInSelect,1,obj)
        if(clonedNfrObject[index][nfrName].defaultValue[0]===oldName){
            clonedNfrObject[index][nfrName].defaultValue[0]=newName
        }
        updateNfr(clonedNfrObject)
    }

    function changeSelectValue(nfrName,selectName,newValue,index,indexInSelect){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[index][nfrName].values[indexInSelect][selectName]=parseFloat(newValue)
        if(clonedNfrObject[index][nfrName].defaultValue[0]===selectName){
            clonedNfrObject[index][nfrName].defaultValue[1]=parseFloat(newValue)
        }
        updateNfr(clonedNfrObject)
    }

    function deleteValue(nfrName,index,indexInSelect,selectName){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[index][nfrName].values.splice(indexInSelect,1)
        if(clonedNfrObject[index][nfrName].defaultValue[0]===selectName){
            if(clonedNfrObject[index][nfrName].values.length>0){
                clonedNfrObject[index][nfrName].defaultValue[0]=Object.keys(clonedNfrObject[index][nfrName].values[0])[0]
                clonedNfrObject.defaultValue[1]=Object.values(clonedNfrObject[index][nfrName].values[0])[0]
            }
            else{
                clonedNfrObject[index][nfrName].defaultValue=[]
            }
        }
        updateNfr(clonedNfrObject)
    }

    function addValue(nfrName,index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        let obj={"":""}
        clonedNfrObject[index][nfrName].values.push(obj)
        updateNfr(clonedNfrObject)
    }

    function changeSelectDefaultValue(nfrName,newValue,displayText,index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[index][nfrName].defaultValue[0]=displayText
        clonedNfrObject[index][nfrName].defaultValue[1]=newValue
        updateNfr(clonedNfrObject)
    }

    function deleteNFR(index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject.splice(index,1)
        nfrNamesSet.current.delete(Object.keys(clonedNfrObject[index])[0])
        updateNfr(clonedNfrObject)
    }

    function changeRangeValue(nfrName,value,index,indexInMainArr){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[indexInMainArr][nfrName].values[index]=value
        updateNfr(clonedNfrObject)
    }

    function changeRangeDefaultValue(nfrName,value,index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[index][nfrName].defaultValue=value
        updateNfr(clonedNfrObject)
    }

    function changeAHP(nfrName,value,index){
        let clonedNfrObject=JSON.parse(JSON.stringify(nfr))
        clonedNfrObject[index][nfrName].ahp=value
        updateNfr(clonedNfrObject)
    }

    function createTableRow(){
        let rows=[]
        for(let index in nfr){
            let key=Object.keys(nfr[index])[0]
            let value=Object.values(nfr[index])[0]
            if(value.type==="range"){
                // rows[nfrMapping.current[nfrName]]=createRangeRow(nfrName,nfr[nfrName],index)
                rows.push(createRangeRow(key,value,parseInt(index)))
            }
            else{
                // rows[nfrMapping.current[nfrName]]=createSelectBoxRow(nfrName,nfr[nfrName],index)
                rows.push(createSelectBoxRow(key,value,parseInt(index)))
            }
           }
        return rows
    }

    function createSelectBoxRow(nfrName,data,index){
       return <tr key={index}>
           <td>{index+1}</td>
           <td><input value={nfrName} type={"text"} onChange={e=>changeNFRName(nfrName,e.target.value,index)}/></td>
           <td>select box</td>
           <td>
               <Table>
                   <thead>
                        <tr>
                            <th/>
                            <th/>
                            <th><ProjectRowTooltip message={"add new value"} icon={faPlus} onClick={_=>addValue(nfrName,index)}/></th>
                        </tr>
                   </thead>
                   <tbody>
                   {/*{createSelectBoxValuesTable(data.values,nfrName,index)}*/}
                   {
                       data.values.map((obj,indexInSelect)=><tr>
                           <td><input value={Object.keys(obj)[0]} type={"text"} onChange={e=>changeSelectValueName(nfrName,Object.keys(obj)[0],e.target.value,index,indexInSelect)}/></td>
                            <td><input value={Object.values(obj)[0]} type={"number"} onChange={e=>changeSelectValue(nfrName,Object.keys(obj)[0],e.target.value,index,indexInSelect)}/> </td>
                           <td><ProjectRowTooltip icon={faTrash} message={"delete value"} onClick={_=>deleteValue(nfrName,index,indexInSelect,Object.keys(obj)[0])}/></td>
                       </tr>)
                   }
                   </tbody>
               </Table>
           </td>
           <td><select value={data.defaultValue[1]} onChange={e=>changeSelectDefaultValue(nfrName,parseFloat(e.target.value),e.target.options[e.target.selectedIndex].text,index)}>
               {
                  data.values.map((obj,index)=>
                      <option value={Object.values(obj)[0]} key={index}>{Object.keys(obj)[0]}</option>
                  )
               }
           </select></td>
           <td><input value={data.ahp} type={"number"} step={0.01} onChange={e=>changeAHP(nfrName,parseFloat(e.target.value),index)}/> </td>
           <td><ProjectRowTooltip message={"delete nfr"} icon={faTrash} onClick={_=>deleteNFR(index)}/> </td>
       </tr>
    }

    function createRangeRow(nfrName,data,index){
        return <tr>
            <td>{index+1}</td>
            <td><input value={nfrName} type={"text"} onChange={e=>changeNFRName(nfrName,e.target.value,index)}/></td>
            <td>range</td>
            <td>
                <Table>
                    <tbody>
                        <tr>
                            <td>Maximum</td>
                            <td><input value={data.values[1]} type={"number"} step={0.01} onChange={e=>changeRangeValue(nfrName,parseFloat(e.target.value),1,index)}/></td>
                        </tr>
                        <tr>
                            <td>Minimum</td>
                            <td><input value={data.values[0]} type={"number"} step={0.01} onChange={e=>changeRangeValue(nfrName,parseFloat(e.target.value),0,index)}/> </td>
                        </tr>
                    </tbody>
                </Table>
            </td>
            <td><input value={data.ahp} type={"number"} step={0.01} onChange={e=>changeAHP(nfrName,parseFloat(e.target.value),index)}/> </td>
            <td><input value={data.defaultValue} type={"number"} step={0.01} onChange={e=>changeRangeDefaultValue(nfrName,parseFloat(e.target.value),index)}/> </td>
            <td><ProjectRowTooltip message={"delete nfr"} icon={faTrash} onClick={_=>deleteNFR(index)}/> </td>
        </tr>
    }
    async function saveChanges(){
        let nfrNamesSet=new Set()
        errorMessage.current=[]
        let wasError=false
        for(let index in nfr){
            let key=Object.keys(nfr[index])[0]
            let value=Object.values(nfr[index])[0]
            if(value.type==="select box"){
               if(checkSelectBoxNFR(value.values,key)){
                   wasError=true
                   }
               else if(value.defaultValue===[]){
                   value.defaultValue.push(Object.keys(value.values[0])[0])
                   value.defaultValue.push(Object.values(value.values[0])[0])
               }
            }
            else{
                if(checkRangeNFR(value,key)){
                    wasError=true
                    }
            }
            if(isNaN(value.ahp)){
                errorMessage.current.push(`ahp value must be a number in ${key} NFR`)
                wasError=true
            }
            if(value.ahp<=0){
                errorMessage.current.push(`ahp value cannot be less or equal to 0 in ${key} NFR`)
            }
            if(nfrNamesSet.has(key)){
                errorMessage.current.push(`nfr names must be unique in ${key} NFR`)
                wasError=true
            }
            nfrNamesSet.add(key)
        }
        if(nfr.length===0){
            errorMessage.current.push("There must be at least one nfr")
            wasError=true
          }
        if(!wasError){
            errorMessage.current=[]
           let response=await axios.post(serverAddress+`/admin/updateNFR`,nfr)
            //check for response status
        }
        else{
            updateShowError(true)
        }
    }

    function addNewNFR(newNFR){
        let clonedNfrs=JSON.parse(JSON.stringify(nfr))
        clonedNfrs.push(newNFR)
        nfrNamesSet.current.add(Object.keys(newNFR)[0])
        updateNfr(clonedNfrs)
    }

    function checkSelectBoxNFR(data,nfrName){
        let selectNamesSet=new Set()
        for(let index in data){
            let key=Object.keys(data[index])[0]
            let value=Object.values(data[index])[0]
            if(key==="" || isNaN(value)){
                errorMessage.current.push(`Please fill all values of ${nfrName} nfr`)
                return true
            }
            if(selectNamesSet.has(key)){
                errorMessage.current.push(`Select names must be unique in ${nfrName} nfr`)
                return true
            }
            if(value<0){
                errorMessage.current.push(`Value cannot be negative in ${nfrName} nfr`)
                return true
            }
            selectNamesSet.add(key)
        }
        if(data.length===0){
            errorMessage.current.push(`NFR select Weights must have at least one value in ${nfrName}`)
            return true;
        }
        return false
    }

    function checkRangeNFR(data,nfrName){
        if(isNaN(data.values[0]) || isNaN(data.values[1]) || isNaN(data.defaultValue)){
            errorMessage.current.push(`numeric values cannot be empty in ${nfrName}`)
            return true
        }
        if(data.values[0]>=data.values[1]){
            errorMessage.current.push(`Minimum value must be less than maximum in ${nfrName}`)
            return true
        }
        if(data.defaultValue<data.values[0] || data.defaultValue>data.values[1]){
            errorMessage.current.push(`default value must be in range in ${nfrName}`)
            return true
        }
        if(data.values[0]<0 || data.values[1]<0 || data.defaultValue<0){
            errorMessage.current.push(`Values cannot be negative in ${nfrName}`)
            return true
        }
        return false
    }

    return(
        <div>
        <Table>
            <thead>
            <tr>
                <th>Index</th>
                <th>NFR</th>
                <th>Type</th>
                <th>Values</th>
                <th>Default Value</th>
                <th>AHP Value</th>
                <th>
                    <div>
                        <ProjectRowTooltip message={"save changes"} icon={faSave} onClick={saveChanges}/>
                        <ProjectRowTooltip message={"add new nfr"} icon={faPlus} onClick={_=>updateShowAddNFR(true)}/>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            {createTableRow()}
            </tbody>
        </Table>
            <AddNFRAdmin show={showAddNFR} addNewNFR={addNewNFR} hide={_=>updateShowAddNFR(false)} names={nfrNamesSet.current}/>
            <Modal show={showError} centered onHide={_=>updateShowError(false)}>
                <Modal.Header closeButton/>
                <Modal.Body>{errorMessage.current.map((message,index)=><p key={index}>{message}</p>)}</Modal.Body>
            </Modal>
        </div>
    )
}