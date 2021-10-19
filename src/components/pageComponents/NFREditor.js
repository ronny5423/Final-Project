import React,{useState,useEffect} from "react"
import axios from "axios"
import {Button, DropdownButton, Table} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

const umlJson={
    nodeDataArray:[{
        type:"Class",
        name:"name of the class"
    }]
};

const weightsArray=new Map();
weightsArray["name"]={
    type:" Range or select box",
    values:[]// if range so it is going to be [min, max, default] and if select box, the array is going to include the different values
};

const valueOfWeightAndClass=new Map();
valueOfWeightAndClass["class name"]=new Map();
valueOfWeightAndClass["class name"]["weight name"]=5;

export default function NFREditor(){
    const [weights,updateWeights]=useState(new Map());
    const [weightsValues,updateWeightsValues]=useState(new Map());


    useEffect(()=>{
        async function getDataFromServer(){
            // get data from server, to fix!!!
            let response= await axios.get("get from server data");
            updateWeights(response.data.weightsArr);
            if(!response.data.valueOfWeightAndClass){//create a map of class and weight as keys and their value
                let classesArray=response.data.uml.nodeDataArray.map(classObj=> classObj.name);
                let weightClassMap=new Map();
                for(let i=0;i<classesArray.length;i++){
                    weightClassMap[classesArray[i]]=new Map();
                    weights.forEach(key=>{
                        let value="";
                        if(weights[key].type==="Range"){
                            value=weights[key].values[2];
                        }
                        weightClassMap[classesArray[i]][key]=value;
                    })
                }
                updateWeightsValues(weightClassMap);
            }
            else{
                updateWeightsValues(response.data.valueOfWeightAndClass);
            }
        }
        getDataFromServer();
    },[])

    function createWeightsRow(){
        let weightsNamesArr=[];
        weights.forEach((value,key)=> weightsNamesArr.push(<th>{key}</th>))
        return weightsNamesArr;
    }

    function createRow(key){
        let rowArr=[];
        weightsValues[key].forEach(weightName=>{
            if(weights[weightName].type==="Range"){//create range input
                rowArr.push(<input type={"number"} min={weights[weightName].values[0]} max={weights[weightName].values[1]}
                                   defaultValue={weightsValues[key][weightName]}/>)
            }
            else{
                rowArr.push(<DropdownButton title={weightsValues[key][weightName]} onSelect={e=>{
                    let newClassWeights=new Map(weightsValues);
                    newClassWeights[key][weightName]=e;
                    updateWeightsValues(newClassWeights);
                }
                }>
               {//create drop down items for each value
                    weights[weightName].values.map(value=><DropdownItem eventKey={value}>{value}</DropdownItem>)
               }
                </DropdownButton>

                    )
            }
        })
        return rowArr;
    }

    function createRestOfTable(){
        let restOfTable=[];
        weightsValues.forEach((value,key)=>{
            restOfTable.push(<tr>
                <td>{key}</td>
                {
                    createRow(key)
                }
            </tr>)
        })
        return restOfTable
    }

    function sendNFRToServer(){
        axios.post(weightsValues);
    }

    return(
        <div>
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
                    finish drop down check for empty values
                }
                </tbody>
            </Table>
            <Button onClick={sendNFRToServer}>Save</Button>
        </div>
    )
}