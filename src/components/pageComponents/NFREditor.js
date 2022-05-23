import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button, Form, Modal, Table} from "react-bootstrap";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import SavingSpinner from "../sharedComponents/SavingSpinner";
import EditorMatrix from "./EditorMatrix";
import "../cssComponents/NFRcss.css"

export default function NFREditor(props){
    //console.log("nfr")
    const [weights,updateWeights]=useState(new Map());
    const [weightsValues,updateWeightsValues]=useState(new Map());
    const [editable,updateEditable]=useState(props.editable)
    const oldWeightsBeforeEdit=useRef(new Map())
    const createNfr=useRef(true)
    let navigate = useNavigate()
    const [id,updateId] = useState(props.id)
    const [loading,updateLoading]=useState(true)
    const [saving,updateSaving]=useState(false)
    const [modalIsOpen, setIsOpen] = React.useState(false);

    useEffect(()=>{
        async function getDataFromServer(){
            // const person={Integrity:0.65,Consistency:["c",3]}
            // const user={Integrity:0.9,Consistency:["a",1]}
            // const weightsAndClassesTemp={Person:person,User:user};
            // let weightsTemp=new Map();
            // weightsTemp.set("Integrity",{
            //     type:"range",
            //     values:[0,1],
            //     defaultValue:0.5
            // })
            // let labelsAndValues={a:1,b:2,c:3,d:4}
            // weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})

            if(id){
                // let response={data:{undecipheredJson: weightsAndClassesTemp,weights:Object.fromEntries(weightsTemp)}}
                let response= await axios.get(serverAddress+`/editors/loadEditor`,{params:{"ID":props.id}});
                if(response.status!==200){
                    navigate(`/error`)
                    return
                }
                createNfr.current=false
                let weightsValuesMap=new Map(Object.entries(response.data.undecipheredJson))
                weightsValuesMap.forEach((value,key,map)=>{
                    map.set(key,new Map(Object.entries(value)))
                })
                createPreviousState(weightsValuesMap)
                updateNFRWeights(response.data.attributes.Attributes)
                updateWeightsValues(weightsValuesMap);
             }
            else{
                // let getWeights={data:Object.fromEntries(weightsTemp)}
                let getWeights=await axios.get(serverAddress+`/editors/getNFRAttributes`)
                if(getWeights.status!==200){
                    navigate(`/error`)
                    return
                }
                let weightsMap=updateNFRWeights(getWeights.data.Attributes)
                let classesArray=props.classes
                let weightClassMap=new Map();
                for(let i=0;i<classesArray.length;i++){
                    weightClassMap.set(classesArray[i],new Map())
                    weightsMap.forEach((val,key) =>{
                        let value=weightsMap.get(key).defaultValue;
                        weightClassMap.get(classesArray[i]).set(key,value)
                    })
                }
                updateWeightsValues(weightClassMap);
             }
            updateLoading(false)
        }
        getDataFromServer();
    },[props.classes])

    function updateNFRWeights(weightsArr){
        weightsArr=new Map(Object.entries(weightsArr))
        updateWeights(weightsArr)
        return weightsArr
    }


    function editDetails(){
        createPreviousState(weightsValues)
        createNfr.current=false
        updateEditable(true)
    }


    function createPreviousState(map){
        oldWeightsBeforeEdit.current=new Map()
        for(const [className,value] of map.entries()){
            oldWeightsBeforeEdit.current.set(className,new Map())
            for(const [weightName,weightValue] of value.entries()){
                oldWeightsBeforeEdit.current.get(className).set(weightName,weightValue)
            }
        }
    }

    function onChange(value,className,weight,displayValue=""){//change value
        let newClassWeights=new Map(weightsValues);
        if(weights.get(weight).type==="range"){
            newClassWeights.get(className).set(weight,value)
        }
        else{
            newClassWeights.get(className).set(weight,[displayValue,value])
        }
        updateWeightsValues(newClassWeights);
    }

    function createWeightsRow(){
        let weightsNamesArr=[];
        weights.forEach((value,key)=> weightsNamesArr.push(<th key={key.toString()}>{key}</th>))
        return weightsNamesArr;
    }

    function createInputRow(key){//create input row
        let rowArr=[];
        weightsValues.get(key).forEach((value,weightName)=>{
            if(weights.get(weightName).type==="range"){//create range input
                rowArr.push(<td key={key+weightName}><div><input readOnly={!editable} type={"number"} min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}
                           step={0.01} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(parseFloat(e.target.value),key,weightName)}/>
                <br/>
                    <Form.Text> min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}</Form.Text></div>
                </td>)
            }
            else{
                rowArr.push(<td key={key+weightName}><select disabled={!editable} value={weightsValues.get(key).get(weightName)[1]} onChange={e=>onChange(parseFloat(e.target.value),key,weightName,e.target.options[e.target.selectedIndex].text)}>
                    {//create select for each value
                        //weights.get(weightName).values.map((value,index)=><option key={index} value={value[1]}>{value[0]}</option>)
                        createSelectRow(weights.get(weightName).values)
               }
                    </select></td>

                    )
            }
        })
        return rowArr;
    }

    function createSelectRow(weightObj){
        let arr=[]
        for(let key in weightObj){
            arr.push(<option key={key} value={weightObj[key]}>{key}</option>)
        }
        return arr
    }

    function createRestOfTable(){// create row with class and inputs
        let restOfTable=[];
        let mapAsc = new Map([...weightsValues.entries()].sort());
        mapAsc.forEach((value,key)=>{
            restOfTable.push(<tr key={key}>
                <td>{key}</td>
                {
                    createInputRow(key)
                }
            </tr>)
        })
        return restOfTable
    }

    function sendNFRToServer(e){
        e.preventDefault()
        if(createNfr.current){
            createNfr.current=false
          }
        updateEditable(false)
        let weightsValuesObject=Object.fromEntries(weightsValues)
        for(let key in weightsValuesObject){
            weightsValuesObject[key]=Object.fromEntries(weightsValuesObject[key])
        }
        let dataToSend={
            "jsonFile":weightsValuesObject,
            "projectID":props.projectId
        }
        updateSaving(true)
        if(id){
            dataToSend.EditorID=id
           axios.post(serverAddress+`/editors/updateNFREditor`,dataToSend).then(response=>{
               if(response.status!==200){
                   navigate(`/error`)
               }
               else
                   toast.success("NFR was saved successfully", {position: toast.POSITION.TOP_CENTER})
               updateSaving(false)
           })

        }
        else{
            axios.post(serverAddress+`/editors/saveNFREditor`,dataToSend).then(response=>{
                if(response.status===200){
                    props.updateEditorId(response.data,3)
                    updateId(response.data)
                    toast.success("NFR was saved successfully", {position: toast.POSITION.TOP_CENTER})
                }
                else{
                    navigate(`/error`)
                }
                updateSaving(false)
            })

        }

    }

    function cancelChanges(){
        updateWeightsValues(oldWeightsBeforeEdit.current)
        updateEditable(false)
    }

    async function getMatrixData(){
        // let data = {"convertedData": {
        //         "classes": [["Class B", 0], ["Class A", 1], ["Association Class", 2]],
        //         "matrix_classes": {"1": 1.0, "2": 0.8, "3": 0.35999999999999993, "4": 0.8, "5": 1.0, "6": 0.5599999999999999, "7": 0.35999999999999993, "8": 0.5599999999999999, "9": 1.0},
        //         "shape": 3
        //     }}
        // return data;
        try {
            let response = await axios.get(serverAddress+`/editors/matrix?ID=${id}`);
            if (response && response.data && response.data){
                return response.data;
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
            convertedData['matrix_classes'] = JSON.parse(convertedData['matrix_classes'])
            let matrixData = {'type': 'UML', 'convertedData': convertedData}
            localStorage.setItem("matrixData", JSON.stringify(matrixData))
            //window.open("/MatrixEditor", "_blank")
            //navigate("/MatrixEditor")
            setIsOpen(true)
        })

    }

    return(
        <div id={"NFR-DIV"}>
        {loading ? <LoadingSpinner/> :
                    <div>
                    <Form data-testid={"NFREditor"} onSubmit={sendNFRToServer}>
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>#</th>
                                {
                                    createWeightsRow()
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                createRestOfTable()
                            }
                            </tbody>
                        </Table>
                        <ToastContainer />
                        {editable ? <div id={"editButtons"}>
                                <Button variant={"success"} type={"submit"}>Save</Button>
                                { !createNfr.current && <Button variant={"danger"} onClick={cancelChanges}>Cancel</Button>}
                            </div>:
                            <Button id={"editButtons"} variant={"success"} onClick={editDetails}>Edit</Button>
                        }
                        <Button id="MatrixButton" disabled={!id || editable} variant={"success"} onClick={redirectToMatrixPage}>Show Matrix</Button>
                    </Form>
                        {saving && <SavingSpinner/>}


                        <Modal
                            show={modalIsOpen}
                            onHide={()=>{setIsOpen(false)}}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    NFR Matrix
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <EditorMatrix></EditorMatrix>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={()=>{setIsOpen(false)}}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
        }
        </div>
    )
}