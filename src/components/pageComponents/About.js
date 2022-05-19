import React from "react";
import { Card } from "react-bootstrap";
import Member from '../sharedComponents/Member'

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
            <h1 style={{padding: '20px 0px', fontFamily: 'inherit'}}>DB Selection</h1>
            <div>
                <Card className={'aboutCard'} style={{margin: '20px 10%',
                    'font-size': 'larger',
                    width: '80%',
                    'font-family': 'monospace'}}>

                    {/*<Card.Subtitle>Something Something</Card.Subtitle>*/}
                    <Card.Text>{projectDescription}</Card.Text>
                </Card>
                {/*<h1>DB Selection</h1>*/}
                {/*<p>{projectDescription}</p>*/}
            </div>
            <h3 style={{padding: '20px 0px', fontFamily: 'inherit'}}>Developers</h3>
            <div class="row">
                <Member img={"https://media-exp1.licdn.com/dms/image/C4D03AQF_xafRrBhMHQ/profile-displayphoto-shrink_200_200/0/1582663858227?e=1656547200&v=beta&t=YctXl30TuE2k7XRf2na-evdPv-Ffl0jAk2geRjB6kv8"} name={"Eran German"} job={"Software Engineer"} linkedin={"https://www.linkedin.com/in/eaert/"} />
                <Member img={"https://media-exp1.licdn.com/dms/image/C4D03AQECz-O4q-Wm-A/profile-displayphoto-shrink_200_200/0/1634534002919?e=1656547200&v=beta&t=Z7B_bhUjc6hvwIIAq9MYbULo3diQ8agnrvytcEW2Edc"} name={"Illi Shmidt"} job={"Software Engineer"} linkedin={"https://www.linkedin.com/in/ili-shmidt/"}/>
                <Member img={"https://media-exp1.licdn.com/dms/image/C4D03AQHqwZnapzu0SQ/profile-displayphoto-shrink_800_800/0/1598021325900?e=1656547200&v=beta&t=W_SLQWLcbJLpHlBHK1xEBid_JyY-9UcPGUpctbl8mYg"} name={"Ron Tyntarev"} job={"Software Engineer"} linkedin={"https://www.linkedin.com/in/rontyntarev/"}/>
                <Member img={img} name={"Yotam Komp"} job={"Software Engineer"} linkedin={""}/>
            </div>
        </div>
    )
}