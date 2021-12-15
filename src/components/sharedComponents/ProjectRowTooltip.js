import React from "react";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function projectRowTooltip(props){
    return(
        <OverlayTrigger trigger={"hover"} placement={"top"} overlay={<Tooltip placement={"top"}>{props.message}</Tooltip>}>
            <Button onClick={props.onClick}><FontAwesomeIcon icon={props.icon}/></Button>
        </OverlayTrigger>
    )
 }