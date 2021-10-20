import React,{useState,useEffect} from "react"
import axios from "axios"
import {Button,Form, Table} from "react-bootstrap";


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


////tests
    const weightsTemp=new Map();
    weightsTemp["aa"]={
        type:"Range",
        values:[0,1,0.5]
    }
    weightsTemp["bb"]={type:"select box",values:["a","b","c","d"]}
    const uml={nodeDataArray:[{type:"Class",name:"A"},{type:"Class",name: "B"}]}

    const weightsAndClassesTemp=new Map();
    weightsAndClassesTemp["A"]=new Map();
    weightsAndClassesTemp["A"]["aa"]=0.65
    weightsAndClassesTemp["A"]["bb"]="c"
    weightsAndClassesTemp["B"]=new Map()
    weightsAndClassesTemp["B"]["aa"]=0.9
    weightsAndClassesTemp["B"]["bb"]="a"

    let response={data:{weightsArr:weightsAndClassesTemp,uml:uml}}

export default function NFREditor(props){
    const [weights,updateWeights]=useState(new Map());
    const [weightsValues,updateWeightsValues]=useState(new Map());
    const [editibale,updateEditibale]=useState(props.editibale)

    useEffect(()=>{
        async function getDataFromServer(){
            // get data from server, to fix!!!
            //let response= await axios.get("get from server data");
            let weightsTemp=new Map();
            weightsTemp.set("aa",{
                type:"range",
                values:[0,1,0.5]
            })
            weightsTemp.set("bb",{type:"select box",values:["a","b","c","d"]})
            let umlTemp={nodeDataArray:[{type:"Class",name:"A"},{type:"Class",name: "B"}]}

            const weightsAndClassesTemp=new Map();
            weightsAndClassesTemp.set("A",new Map())
            weightsAndClassesTemp.set("B",new Map())

            weightsAndClassesTemp.get("A").set("aa",0.65)
            weightsAndClassesTemp.get("A").set("bb","c")
            weightsAndClassesTemp.get("B").set("aa",0.9)
            weightsAndClassesTemp.get("B").set("bb","a")

            let response={data:{weightsArr:weightsTemp,uml:umlTemp,valueOfWeightAndClass:weightsAndClassesTemp}}
            updateWeights(response.data.weightsArr);
            if(!response.data.valueOfWeightAndClass){//create a map of class and weight as keys and their value
                let classesArray=response.data.uml.nodeDataArray.map(classObj=> classObj.name);
                let weightClassMap=new Map();
                for(let i=0;i<classesArray.length;i++){
                    weightClassMap.set(classesArray[i],new Map())
                    response.data.weightsArr.forEach((val,key) =>{
                        let value="";
                        if(response.data.weightsArr.get(key).type==="range"){
                            value=response.data.weightsArr.get(key).values[2];
                        }
                        weightClassMap.get(classesArray[i]).set(key,value)
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

    function onChange(value,className,weight){
        let newClassWeights=new Map(weightsValues);
        newClassWeights.get(className).set(weight,value)
        updateWeightsValues(newClassWeights);
        fix problem with edit button
    }

    function createWeightsRow(){
        let weightsNamesArr=[];
        weights.forEach((value,key)=> weightsNamesArr.push(<th>{key}</th>))
        return weightsNamesArr;
    }

    function createInputRow(key){
        let rowArr=[];
        weightsValues.get(key).forEach((value,weightName)=>{
            if(weights.get(weightName).type==="range"){//create range input
                rowArr.push(<td><input readOnly={!editibale} type={"number"} min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}
                           step={0.01} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}/></td>)
            }
            else{
                rowArr.push(<td><select disabled={!editibale} required value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}>
                    <option value={""}/>
                    {//create select for each value
                   weights.get(weightName).values.map(value=><option value={value}>{value}</option>)
               }
                    </select></td>

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
                    createInputRow(key)
                }
            </tr>)
        })
        return restOfTable
    }

    function sendNFRToServer(){
        axios.post(weightsValues);
    }

    return(
        <Form>
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
            {editibale ? <Button type={"submit"} onClick={sendNFRToServer}>Save</Button> :
            <Button onClick={_=>updateEditibale(true)}>Edit</Button>
            }
        </Form>
    )
}