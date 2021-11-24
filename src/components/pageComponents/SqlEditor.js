import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button, Form, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import { faTrash} from '@fortawesome/fontawesome-free-solid'
import "../cssComponents/SqlEditor.css";
import * as SqlHelper from "../../Utils/SqlValidationUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {serverAddress} from "../../Constants";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function SqlEditor(props){
    let initMap = new Map();
    initMap.set(0,{"name":"query","tpm": 45, "selectable": true, "query": ""});
    const[queries,updateQueries] = useState(initMap)
    const[currentRowIndex,updateRowIndex]=useState(0)
    const classes=useRef({})
    const edit=useRef(true)
    const[disabled,updateDisabled]=useState(false)
    const previousState=useRef(new Map());

    useEffect(()=>{
        async function fetchSQLQueriesFromServer() {
            let response = undefined;
            try {
                response = await axios.get(serverAddress+`/getSql`);
            }catch (e){
                let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
                let map=new Map();
                map.set(0,{"name":"abc","tpm": 45, "selectable": true, "query": ""});
                map.set(1,{"name":"def","tpm": 15, "selectable": false, "query": ""});
                response={
                    data:{
                        queries: Object.fromEntries(map),
                        classes: classesDict
                    }
                };
            }
            //response = await axios.get(serverAddress+`/getSql`);
            if (response.data.queries) {
                edit.current=false
                previousState.current = response.data.queries
                updateDisabled(true)
                response.data.queries = new Map(Object.entries(response.data.queries))
                let convertMapKeys = new Map();
                for (let [key, value] of response.data.queries){
                    let newKey = parseInt(key, 10);
                    convertMapKeys.set(newKey, value)
                }
                updateQueries(convertMapKeys)
            }
            if (response.data.classes) {
                SqlHelper.addUmlClasses(response.data.classes);
            }
        }
        fetchSQLQueriesFromServer()
    },[])



    function createQuery(index){
        let query = queries.get(index);
        return(
            <tr>
                <td><OverlayTrigger placement={"bottom"} overlay={<Tooltip placement={"bottom"}>Click on index to view the query</Tooltip> }><span id={"index"} onClick={_=>updateRowIndex(index)}><u>{index +1}</u></span></OverlayTrigger></td>
                <td><input required disabled={disabled} value={query["name"] ? query["name"] : "query"} onChange={e=>changeValue(index,"name",e.target.value)}/></td>
                <td><div>
                    <Form.Range disabled={disabled} value={query["tpm"]} min={0} max={60} step={1} onChange={e=>changeValue(index,"tpm",e.target.value)}></Form.Range>
                    {query["tpm"]}
                </div></td>
                <td><Form.Check disabled={disabled} checked={query["selectable"]} onChange={e=>changeValue(index,"selectable",e.target.value)}></Form.Check></td>
                <td><Button disabled={disabled} variant={"danger"} onClick={_=>deleteRow(index)}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button></td>
            </tr>
        )
    }

    function deleteRow(rowIndex){
        let sizeOfQueriesMap=queries.size
        let newQueriesMap=new Map(queries)
        newQueriesMap.delete(rowIndex)
        for(let i=rowIndex+1;i<sizeOfQueriesMap;i++){
            let values=newQueriesMap.get(i)
            newQueriesMap.delete(i)
            newQueriesMap.set(i-1,values)
        }
        updateQueries(newQueriesMap)
        if(newQueriesMap.size===0){
            newQueriesMap.set(0,{"name":"query","tpm": 45, "selectable": true, "query": ""})
        }
        if(currentRowIndex===rowIndex && currentRowIndex===newQueriesMap.size){
            updateRowIndex(currentRowIndex-1)
        }
    }

    function createTable(){
        //console.log(queries.size);
        let arr=[]
        for(let i=0; i<queries.size; i++){
            arr.push(createQuery(i))
        }
        return arr
    }

    function changeValue(key,indexOfValueToChange,newValue){
        let newQueriesMap= new Map(queries)
        let values={...queries.get(key)}
        switch (indexOfValueToChange) {
            case "name":
                values["name"]=newValue;
                break
            case "tpm":
                values["tpm"]=parseInt(newValue,10);
                break
            case "selectable":
                values["selectable"]=!values["selectable"];
                break
            case "query":
                values["query"]=newValue;
                break
        }
        newQueriesMap.delete(key)
        newQueriesMap.set(key,values)
        updateQueries(newQueriesMap)
    }

    function addQuery(){
        let newQueriesMap=new Map(queries)
        newQueriesMap.set(newQueriesMap.size,{"name":"query","tpm": 45, "selectable": true, "query": ""})
        updateQueries(newQueriesMap)
    }

    function cancelChanges(){
        edit.current=false
        updateDisabled(true)
        updateQueries(previousState.current)
    }

    function editDetails(){
        edit.current=true
        updateDisabled(false)
    }

    function handleSubmit(event){
        event.preventDefault()
        //check all sql queries
        let problems = SqlHelper.ValidateAllQueries(queries);
        if (Object.keys(problems).length > 0){
            for(let key in problems){
                let queryName = queries.get(parseInt(key, 10))["name"];
                for(let problemIdx in problems[key]){
                    toast.error("In query: " + queryName + ", error: " + problems[key][problemIdx], { position: toast.POSITION.TOP_CENTER })
                }
            }
            return;
        }

        previousState.current=new Map(queries)
        edit.current=false
        updateDisabled(true)
    }


    return (
        <Form data-testid={"SqlEditor"} style={{width:"100%"}} onSubmit={handleSubmit}>
        <div id={"tableAndTextAreaDiv"}>
            <Table responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Query name</th>
                    <th>Query tpm</th>
                    <th>Select</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {
                    createTable()
                }
                </tbody>
            </Table>
            <textarea disabled={disabled} cols={40} placeholder={"Enter your query here"} value={queries.get(currentRowIndex)["query"]} onChange={e=>changeValue(currentRowIndex,"query",e.target.value)}></textarea>
            <ToastContainer />
        </div>
            {
                disabled ? <Button variant={"success"} onClick={editDetails}>Edit</Button> :
                <div id={"buttonsDiv"}>
                    <Button variant={"info"} onClick={addQuery}>Add Query</Button>
                    <Button type={"submit"} variant={"success"} >Save</Button>
                    {edit.current && <Button variant={"danger"} onClick={cancelChanges}>Cancel</Button> }
                </div>
            }
        </Form>
    )
}