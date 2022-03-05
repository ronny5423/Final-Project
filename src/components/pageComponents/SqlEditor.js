import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button, Form, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import { faTrash, faBookmark,faQuestion} from '@fortawesome/fontawesome-free-solid'
import "../cssComponents/SqlEditor.css";
import * as SqlHelper from "../../Utils/SqlValidationUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {serverAddress} from "../../Constants";
import ModalComponnent from "../sharedComponents/ModalComponnent";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let modalBody = <div>
    <p>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Click the edit button to edit your sql editor
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Click on the index number in the table in order to choose the query you want to edit
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> On the rigth side of the screen in the textbox you can edit the query of the highligted row
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> The "selected" column is for desiding whether or not you want to include the query in your project
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> You can also delete the query completly through the delete button
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> In the "name" column you can change the name of the query
    </p>
</div>

let modalHeader = <h3>How to use SQL EDITOR?</h3>




export default function SqlEditor(props){
    //console.log("sql")
    let initMap = new Map();
    initMap.set(0,{"name":"query","tpm": 45, "selectable": true, "query": ""});
    const[queries,updateQueries] = useState(initMap)
    const[currentRowIndex,updateRowIndex]=useState(0)
    const edit=useRef(true)
    const[disabled,updateDisabled]=useState(false)
    const previousState = useRef(new Map());
    const[id,updateId]=useState(props.id)
    const [modalShow, setModalShow] = React.useState(false);

    useEffect(()=>{
        async function fetchSQLQueriesFromServer() {
            let response = undefined;
            console.log(id)
            //let classesDict = {"Class": ["Name"], "Class1": ["UserName", "Password"], "NamedModelElement": ["name"]};
            try {
                if(id){
                    response = await axios.get(serverAddress+`/editors/loadEditor?ID=${id}`);
                    console.log(response);
                }
            }catch (e){
                let map=new Map();
                map.set(0,{"name":"abc","tpm": 45, "selectable": true, "query": ""});
                map.set(1,{"name":"def","tpm": 15, "selectable": false, "query": ""});
                response={
                    data:{
                        undecipheredJson: Object.fromEntries(map),
                    }
                };
            }
            //response = await axios.get(serverAddress+`/getSql`);
            if ( response && response.data.undecipheredJson) {
                edit.current=false
                updateDisabled(true)
                response.data.undecipheredJson = new Map(Object.entries(response.data.undecipheredJson))
                let convertMapKeys = new Map();
                for (let [key, value] of response.data.undecipheredJson){
                    let newKey = parseInt(key, 10);
                    convertMapKeys.set(newKey, value)
                }
                updateQueries(convertMapKeys)
                previousState.current = new Map(convertMapKeys)
            }
            SqlHelper.addUmlClasses(props.classes);
        }
        fetchSQLQueriesFromServer()
    },[props.classes])



    function createQuery(index){
        let query = queries.get(index);
        return(
            <tr className={index === currentRowIndex ? 'selected' : ''}>
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
            updateQueries(newQueriesMap)
        }
        // if(currentRowIndex===rowIndex && currentRowIndex===newQueriesMap.size){
        //     updateRowIndex(currentRowIndex-1)
        // }
        if(currentRowIndex >= newQueriesMap.size){
            updateRowIndex(newQueriesMap.size-1)
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
        if(currentRowIndex >= previousState.current.size){
            console.log(currentRowIndex)
            console.log(previousState.current.size)
            updateRowIndex(previousState.current.size - 1);
        }
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

        saveSqlToServer();
    }


    async function saveSqlToServer(){
        const obj = Object.fromEntries(queries);
        console.log(obj);
        let url = undefined;
        try {
            if(id !== undefined){
                url = serverAddress+`/editors/updateSQLEditor`;
                let response = await axios.post(url, {'jsonFile': obj, 'EditorID': id, 'projectID': props.projectId});
                console.log(response);
                if(response.status !== 400){
                    toast.success("SQL was saved successfully", {position: toast.POSITION.TOP_CENTER})
                }
            }
            else{
                url = serverAddress+`/editors/saveSQLEditor`;
                let response = await axios.post(url, {'jsonFile': obj, 'projectID': props.projectId});
                console.log(response);
                if(response.status !== 400){
                    props.updateEditorId(response.data,2)
                    updateId(response.data)
                    toast.success("SQL was saved successfully", {position: toast.POSITION.TOP_CENTER})
                }
            }
            
        }catch (e){
            console.log(e);
            console.trace();
        }
    }


    async function getMatrixData(){
        // let data = {"convertedData": {
        //         "classes": {"-1": ["Class B", 0], "-2": ["Class A", 1], "-4": ["Association Class", 2]},
        //         "matrix_classes": {"1": 1.0, "2": 0.8, "3": 0.35999999999999993, "4": 0.8, "5": 1.0, "6": 0.5599999999999999, "7": 0.35999999999999993, "8": 0.5599999999999999, "9": 1.0},
        //         "shape": 3
        //     }}
        // return data;
        try {
            let response = await axios.get(`/editors/matrix?ID=${id}`);
            if (response && response.data && response.data.convertedData){
                return response.data.convertedData;
            }
            else {
                toast.error("Matrix isn't available at the moment", {position: toast.POSITION.TOP_CENTER})
            }
        }
        catch (e){
            toast.error("Matrix isn't available at the moment", {position: toast.POSITION.TOP_CENTER})
            console.log(e);
            console.trace();
        }

        return null;
    }


    function redirectToMatrixPage(){
        if(!id){
            toast.error("Editor wasn't yet saved to the server", {position: toast.POSITION.TOP_CENTER})
            return
        }

        getMatrixData().then((convertedData) => {
            let matrixData = {'type': 'SQL', 'convertedData': convertedData['convertedData']}
            localStorage.setItem("matrixData", JSON.stringify(matrixData))
            window.open("/MatrixEditor", "_blank")
        })

    }


    return (
        <Form data-testid={"SqlEditor"} style={{width:"100%"}} onSubmit={handleSubmit}>
        <div id={"tableAndTextAreaDiv"}>
            <Table selectable responsive>
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
            <ModalComponnent
                show={modalShow}
                onHide={() => setModalShow(false)}
                text= {modalBody}
                header = {modalHeader}
            />
        </div>
            {
                disabled ? <Button variant={"success"} onClick={editDetails}>Edit</Button> :
                <div id={"buttonsDiv"}>
                    <Button variant={"info"} onClick={addQuery}>Add Query</Button>
                    <Button type={"submit"} variant={"success"} >Save</Button>
                    {edit.current && <Button variant={"danger"} onClick={cancelChanges}>Cancel</Button> }
                </div>
            }
            <Button id="MatrixButton" disabled={!id} variant={"success"} onClick={redirectToMatrixPage}>Show Matrix</Button>
            <Button id="helpButton" onClick={() => setModalShow(true)} variant='warning'><FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon></Button>
        </Form>
    )
}