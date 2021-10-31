import React,{useState,useEffect,useRef} from "react"
import axios from "axios"
import {Button,Form, Table} from "react-bootstrap";

export default function SqlEditor(props){


    // function createInputRow(key){//create input row
    //     let rowArr=[];
    //     weightsValues.get(key).forEach((value,weightName)=>{
    //         if(weights.get(weightName).type==="range"){//create range input
    //             rowArr.push(<td key={key+weightName}><div><input readOnly={!editable} type={"number"} min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}
    //                                                              step={0.01} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}/>
    //                 <Form.Text> min={weights.get(weightName).values[0]} max={weights.get(weightName).values[1]}</Form.Text></div>
    //             </td>)
    //         }
    //         else{
    //             rowArr.push(<td key={key+weightName}><select disabled={!editable} value={weightsValues.get(key).get(weightName)} onChange={e=>onChange(e.target.value,key,weightName)}>
    //                     {//create select for each value
    //                         weights.get(weightName).values.map((value,index)=><option key={index} value={value}>{value}</option>)
    //                     }
    //                 </select></td>
    //
    //             )
    //         }
    //     })
    //     return rowArr;
    // }
    //
    //
    // function createRestOfTable(){// create row with class and inputs
    //     let restOfTable=[];
    //     weightsValues.forEach((value,key)=>{
    //         restOfTable.push(<tr key={key}>
    //             <td>{key}</td>
    //             {
    //                 createInputRow(key)
    //             }
    //         </tr>)
    //     })
    //     return restOfTable;
    // }

    return (
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

                }
                </tbody>
            </Table>
        </div>
    )
}