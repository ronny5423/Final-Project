import React,{useState} from "react";
import {Tabs,Tab} from "react-bootstrap";
import NFREditor from "./NFREditor";
import {ChangeMatrixWeights} from "./ChangeMatrixWeights";

function CreateProjectPage(){
    const [key,setKey]=useState("Uml");

    return(
        <div>
            <h1>Project Creation</h1>
            <br/>
            <div id={"projectNAmeInput"}>
                <p>Please enter project name:</p>
                <input type={"text"}/>
            </div>
            <Tabs defaultActiveKey={"Uml"}  activeKey={key} onSelect={(key)=>setKey(key)}>
                <Tab title={"Uml"} id={"uml"} eventKey={"Uml"}>

                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>

                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>
                    <NFREditor editibale={true}/>
                </Tab>
                <Tab title={"changeWeights"} eventKey={"changeWeights"} id={"changeWeights"}>
                    <ChangeMatrixWeights/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default CreateProjectPage;