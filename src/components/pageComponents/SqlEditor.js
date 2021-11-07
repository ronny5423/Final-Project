import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button, Form, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import "../cssComponents/SqlEditor.css"

export default function SqlEditor(props){
    const[queries,updateQueries]=useState(new Map().set(0,["",35,false,""]))
    const[currentRowIndex,updateRowIndex]=useState(0)
    const classes=useRef({})
    const edit=useRef(true)
    const[disabled,updateDisabled]=useState(false)
    const previousState=useRef(new Map())

    useEffect(()=>{
        async function fetchSQLQueriesFromServer() {
            // let response = await axios.get(`server path`)
            // classes.current = response.data.classes
            let map=new Map()
            map.set(0,["abc",45,true,"abc"])
            map.set(1,["def",15,false,"def"])
            let response={
                data:{
                    queries:map
                }
            }
            if (response.data.queries) {
                edit.current=false
                previousState.current=response.data.queries
                updateDisabled(true)
                updateQueries(response.data.queries)
            }
        }
        fetchSQLQueriesFromServer()
    },[])

    function createQuery(index){
        let query=queries.get(index)
        return(
            <tr>
                <td><OverlayTrigger placement={"bottom"} overlay={<Tooltip placement={"bottom"}>Click on index to view the query</Tooltip> }><span id={"index"} onClick={_=>updateRowIndex(index)}><u>{index +1}</u></span></OverlayTrigger></td>
                <td><input disabled={disabled} value={query[0]} onChange={e=>changeValue(index,0,e.target.value)}/></td>
                <td><div>
                    <Form.Range disabled={disabled} value={query[1]} min={0} max={60} step={1} onChange={e=>changeValue(index,1,e.target.value)}></Form.Range>
                    {query[1]}
                </div></td>
                <td><Form.Check disabled={disabled} checked={query[2]} onChange={e=>changeValue(index,2,e.target.value)}></Form.Check></td>
                <td><Button disabled={disabled} variant={"danger"} onClick={_=>deleteRow(index)}>Delete</Button></td>
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
            newQueriesMap.set(0,["",35,false,""])
        }
        if(currentRowIndex===rowIndex && currentRowIndex===newQueriesMap.size){
            updateRowIndex(currentRowIndex-1)
        }
    }

    function createTable(){
        let arr=[]
        for(let i=0;i<queries.size;i++){
            arr.push(createQuery(i))
        }
        return arr
    }

    function changeValue(key,indexOfValueToChange,newValue){
        let newQueriesMap= new Map(queries)
        let values={...queries.get(key)}
        switch (indexOfValueToChange) {
            case 0:
                values[0]=newValue
                break
            case 1:
                values[1]=parseInt(newValue,10)
                break
            case 2:
                values[2]=!values[2]
                break
            case 3:
                values[3]=newValue
                break
        }
        newQueriesMap.delete(key)
        newQueriesMap.set(key,values)
        updateQueries(newQueriesMap)
    }

    function addQuery(){
        let newQueriesMap=new Map(queries)
        newQueriesMap.set(newQueriesMap.size,["",35,false,""])
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
        //check all sql queries
        event.preventDefault()
        previousState.current=new Map(queries)
        edit.current=false
        updateDisabled(true)
    }


    return (
        <Form style={{width:"100%"}} onSubmit={handleSubmit}>
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
            <textarea disabled={disabled} cols={40} placeholder={"Enter your query here"} value={queries.get(currentRowIndex)[3]} onChange={e=>changeValue(currentRowIndex,3,e.target.value)}></textarea>
        </div>
            {
                disabled ? <Button variant={"success"} onClick={editDetails}>Edit</Button> :
                <div>
                    <Button variant={"info"} onClick={addQuery}>Add Query</Button>
                    <Button type={"submit"} variant={"success"} >Save</Button>
                    {edit.current && <Button variant={"danger"} onClick={cancelChanges}>Cancel</Button> }
                </div>
            }
        </Form>
    )
}