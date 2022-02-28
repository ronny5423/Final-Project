import {useEffect} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate} from "react-router-dom";
import ChangeEditorsAhpHoc from "../sharedComponents/ChangeEditorsAhpHoc";

function ChangeEditorsAhpAdmin(props){
    let navigate=useNavigate()

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(serverAddress+`/admin/AHP`)
            if(response.status!==200){
                navigate(`/error`)
                return
            }
            props.updateWeights(response.data)
            props.updateSaveRoute(serverAddress+`/admin/updateAHP`)
        }
        fetchData()
    },[])

    return(
        <div/>
    )
}

export default ChangeEditorsAhpHoc(ChangeEditorsAhpAdmin)