import {useEffect} from "react";
import {serverAddress} from "../../Constants";
import changeEditorsAhpHoc from "../sharedComponents/ChangeEditorsAhpHoc";
import axios from "axios";

function ChangeMatrixWeights(props){
    useEffect(()=>{
        async function fetchData(){
            let weights
            if(props.nfrAhp && props.umlAhp && props.sqlAhp){
                weights={
                    UML:props.umlAhp,
                    SQL:props.sqlAhp,
                    NFR:props.nfrAhp
                }
            }
            else{
                let response=await axios.get(serverAddress+`/projects/getWeights/${props.id}`)
                weights=response.data
            }
            props.updateWeights(weights)
            props.updateSaveRoute(serverAddress+`/projects/updateWeights`,props.id)
        }
        fetchData()
    },[])
    return(
        <div/>
    )
}

export default changeEditorsAhpHoc(ChangeMatrixWeights)
