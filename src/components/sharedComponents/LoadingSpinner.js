import React from "react";
import Spinner from 'react-bootstrap/Spinner'

export default function LoadingSpinner(){

    return(
        <div>
        <span>Loading </span>
        <Spinner animation={"border"}/>
        </div>
    )
}