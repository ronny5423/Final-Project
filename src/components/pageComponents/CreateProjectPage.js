import React,{useState} from "react";
import {Tabs,Tab} from "react-bootstrap";

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

                </Tab>
            </Tabs>
        </div>
    )
}

export default CreateProjectPage;