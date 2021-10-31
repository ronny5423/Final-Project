import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button,Form, Table} from "react-bootstrap";

export default function SqlEditor(props){
    const[queries,updateQueries]=useState(new Map())
    const[currentRowIndex,updateRowIndex]=useState(0)

    useEffect(()=>{
        async function fetchSQLQueriesFromServer(){
            let response = await axios.get(`server path`)
            if(response.status===200){
                updateQueries(response.data)
            }
            else{
                let queriesMap=new Map()
                queriesMap.set(1,["",35,false,""])
                updateQueries(queriesMap)
            }
        }
        fetchSQLQueriesFromServer()
    },[])

    function createQuery(index){
        let query=queries.get(index)
        return(
            <tr>
                <td>{index}</td>
                <td><input value={query[0]} onChange={e=>changeValue(index,0,e.target.value)}/></td>
                <td><div>
                    <Form.Range value={query[1]} min={0} max={60} step={1} onChange={e=>changeValue(index,1,e.target.value)}></Form.Range>
                    {query[1]}
                </div></td>
                <td><Form.Check checked={query[2]} onChange={e=>changeValue(index,2,e.target.value)}></Form.Check></td>
                <td><Button variant={"danger"} onClick={_=>deleteRow(index)}>Delete</Button></td>
            </tr>
        )
    }

    function deleteRow(rowIndex){
        let sizeOfQueriesMap=queries.size
        let newQueriesMap={...queries}
        newQueriesMap.delete(rowIndex)
        for(let i=rowIndex+1;i<sizeOfQueriesMap;i++){
            let values=newQueriesMap.get(i)
            newQueriesMap.delete(i)
            newQueriesMap.set(i-1,values)
        }
        updateQueries(newQueriesMap)
    }

    function createTable(){
        let arr=[]
        queries.forEach((value,key,map)=>{
            arr.push(createQuery(key))
        })
        return arr
    }

    function changeValue(key,indexOfValueToChange,newValue){
        let newQueriesMap={...queries}
        let values={...queries.get(key)}
        switch (indexOfValueToChange) {
            case 0:
                values[0]=newValue
                break
            case 1:
                values[1]=newValue
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

    function handleSubmit(){
        //check all sql queries
    }

    return (
        <Form onSubmit={handleSubmit}>
        <div>
            <Table responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Query name <button>+</button></th>
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
            <textarea placeholder={"Enter your query here"} value={queries.get(currentRowIndex)[3]} onChange={e=>changeValue(currentRowIndex,3,e.target.value)}></textarea>
        </div>
            <Button type={"submit"} variant={"success"} >Save</Button>
        </Form>
    )
}