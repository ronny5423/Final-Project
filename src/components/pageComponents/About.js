import React from "react";
import { Card } from "react-bootstrap";
import Member from '../sharedComponents/Member'
import ron from "../../Pictures/Ron.jpg"

export default function About() {
    let img = "https://www.freeiconspng.com/uploads/person-icon-8.png";
    let name = "Some One"
    let job = "Doing Something"
    let description = "At Somewhere"

    let projectDescription="Our system is a university final project for solving best DB selection problem." +
        "Our System will allow he user to describe the application that he wants to implement, and our web site will return the best suited DB for his application. "+
        "Our System will also provide a module for admin in which he could control and manage users and system's data."

    return (
        <div>
            <h1>DB Selection</h1>
            <div>
                <Card>

                    {/*<Card.Subtitle>Something Something</Card.Subtitle>*/}
                    <Card.Text>{projectDescription}</Card.Text>
                </Card>
                {/*<h1>DB Selection</h1>*/}
                {/*<p>{projectDescription}</p>*/}
            </div>
            <h3>Developers</h3>
            <div class="row">
                <Member img={img} name={"Eran German"} job={"BackEnd Developer"} />
                <Member img={img} name={"Illi Shmidt"} job={"BackEnd Developer"}/>
                <Member img={ron} name={"Ron Tyntarev"} job={"FrontEnd Developer"}/>
                <Member img={img} name={"Yotam Komp"} job={"BackEnd And FrontEnd Developer"}/>
            </div>
        </div>
    )
}