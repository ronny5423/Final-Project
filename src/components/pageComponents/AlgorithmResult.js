import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useHistory} from "react-router-dom";

export default function AlgorithmResult(props){
    const[algorithmResult,updateAlgorithmResult]=useState({})
    let history=useHistory()

    useEffect((props)=>{
        async function fetchAlgorithmResult(projectIndex){
            let response= await axios.get(serverAddress+`/algorithmResult/${projectIndex}`)
            if(response.status!==200){
                history.push("/error")
            }
            else{
                updateAlgorithmResult(response.data.result)
            }
        }
        fetchAlgorithmResult(props.projectIndex)
    },[])

    return(
        <div>

        </div>
    )
}