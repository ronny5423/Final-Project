import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button,Form, Table} from "react-bootstrap";
import {serverAddress} from "../../Constants";

export default function NFREditor(props){
    const [weights,updateWeights]=useState(new Map());
    const [weightsValues,updateWeightsValues]=useState(new Map());
    const [editable,updateEditable]=useState(props.editable)
    const oldWeightsBeforeEdit=useRef(new Map())
    const createNfr=useRef(true)

    useEffect(()=>{
        async function getDataFromServer(){
            let response= await axios.get(serverAddress+`/getNFR`);
            response.data.weightsArr=new Map(Object.entries(response.data.weightsArr))
            updateWeights(response.data.weightsArr);
            if(!response.data.valueOfWeightAndClass){//create a map of class and weight as keys and their value
                let classesArray=response.data.uml.nodeDataArray.map(classObj=> classObj.name);
                let weightClassMap=new Map();
                for(let i=0;i<classesArray.length;i++){
                    weightClassMap.set(classesArray[i],new Map())
                    response.data.weightsArr.forEach((val,key) =>{
                        let value=response.data.weightsArr.get(key).defaultValue;
                        weightClassMap.get(classesArray[i]).set(key,value)
                    })
                }
                updateWeightsValues(weightClassMap);
                }
            else{
                createNfr.current=false
                let map=new Map(Object.entries(response.data.valueOfWeightAndClass))
                let newMap=new Map(map)
                map.forEach((value,key,map)=>{
                    newMap.delete(key)
                    newMap.set(key,new Map(Object.entries(value)))
                })
                createPreviousState(newMap)
                updateWeightsValues(newMap);
            }
        }
        getDataFromServer();
    },[])

    function createPreviousState(map){
        oldWeightsBeforeEdit.current=new Map()
        for(const [className,value] of map.entries()){
            oldWeightsBeforeEdit.current.set(className,new Map())
            for(const [weightName,weightValue] of value.entries()){
                oldWeightsBeforeEdit.current.get(className).set(weightName,weightValue)
            }
        }
    }

    function onChange(value,className,weight){//change value
        let newClassWeights=new Map(weightsValues);
        newClassWeights.get(className).set(weight,value)
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
                           step={0.01} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}/>
                <br/>
                    <Form.Text> min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}</Form.Text></div>
                </td>)
            }
            else{
                rowArr.push(<td key={key+weightName}><select disabled={!editable} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}>
                    {//create select for each value
                   weights.get(weightName).values.map((value,index)=><option key={index} value={value}>{value}</option>)
               }
                    </select></td>

                    )
            }
        })
        return rowArr;
    }

    function createRestOfTable(){// create row with class and inputs
        let restOfTable=[];
        weightsValues.forEach((value,key)=>{
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
        axios.post(serverAddress+`/sendNFR`,JSON.stringify(weightsValues));
    }

    function cancelChanges(){
    updateWeightsValues(oldWeightsBeforeEdit.current)
    updateEditable(false)
    }

    return(
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
            {editable ? <div id={"editButtons"}>
                    <Button variant={"success"} type={"submit"}>Save</Button>
                { !createNfr.current && <Button variant={"danger"} onClick={cancelChanges}>Cancel</Button>}
                </div>:
            <Button onClick={_=>{
                createPreviousState(weightsValues)
                createNfr.current=false
                updateEditable(true)
            }}>Edit</Button>
            }
        </Form>
    )
}