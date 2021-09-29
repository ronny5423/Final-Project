import React from 'react';
import { Card } from "react-bootstrap";

export default function PrevProject({name, lastUpdate, discription, Users}) {

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{lastUpdate}</Card.Subtitle>
                <Card.Text>{discription}</Card.Text>
                {Users.map((user, index) => 
                    <Card.Text key={index}>{user}</Card.Text>
                )}
            </Card.Body>
        </Card>
    )
}