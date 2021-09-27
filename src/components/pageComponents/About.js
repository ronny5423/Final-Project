import React from "react";
import { Card } from "react-bootstrap";
import Member from '../sharedComponents/Member'

export default function About() {
    let img = "https://www.freeiconspng.com/uploads/person-icon-8.png";
    let name = "Some One"
    let job = "Doing Something"
    let description = "At Somewhere"
    return (
        <div>
            <div>
                <Card>
                    <Card.Title>Project UML</Card.Title>
                    <Card.Subtitle>Something Something</Card.Subtitle>
                    <Card.Text>This is a Project UML, and writing more stuff so I could see the text box is working fine.</Card.Text>
                </Card>
            </div>
            <div class="row">
                <Member img={img} name={name} job={job} description={description}></Member>
            </div>
        </div>
    )
}