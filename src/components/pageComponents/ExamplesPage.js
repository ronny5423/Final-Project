import React,{useState} from "react";
import {Tabs,Tab} from "react-bootstrap";


function ExamplesPage(){
    const [key,setKey]=useState("Uml");

    return(
        <div>
            <h1>Examples</h1>
            <br/>
            <Tabs defaultActiveKey={"Uml"}  activeKey={key} onSelect={(key)=>setKey(key)}>
                <Tab title={"Uml"} id={"uml"} eventKey={"Uml"}>

                </Tab>
                <Tab title={"Queries"} eventKey={"Queries"} id={"queries"}>

                </Tab>
                <Tab title={"Nfr"} eventKey={"Nfr"} id={"nfr"}>

                </Tab>
                <Tab title={"Managing Project"} eventKey={"Managing Project"} id={"managingProject"}>

                </Tab>
                <Tab title={"Creating Project"} eventKey={"Creating Project"} id={"creatingProject"}>

                </Tab>
            </Tabs>
        </div>

    )
}

export default ExamplesPage;