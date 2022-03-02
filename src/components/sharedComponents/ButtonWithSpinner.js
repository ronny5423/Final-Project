import React from "react";
import {Button} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

export default function ButtonWithSpinner (props) {
    return(
        <Button variant={props.variant} disabled>
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            {props.label}
        </Button>
    )
}