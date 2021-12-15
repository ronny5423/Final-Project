import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";

export default function AlgorithmResult(){
    const[algorithmResult,updateAlgorithmResult]=useState({})
    let history=useNavigate()

    useEffect((props)=>{
        async function fetchAlgorithmResult(projectIndex){
            let response= await axios.get(serverAddress+`/algorithmResult/${projectIndex}`)
            if(response.status!==200){
                history.navigate("/error")
            }
            else{
                updateAlgorithmResult(response.data.result)
            }
        }
        //fetchAlgorithmResult(props.projectIndex)
    },[])

    return(
        <div>
            <h1>Results</h1>
        </div>
    )
}