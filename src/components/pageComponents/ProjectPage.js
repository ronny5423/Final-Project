import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';

export default function ProjectPage({projectID}) {
    const [project, setProject]=useState({});

    useEffect(()=>{
        async function getProjectFromServer(){
                //get project from server
        }
        getProjectFromServer();
    },[projectID])

    return(
        <div>
            <h1>{project.name}</h1>
            <h2>{project.owner}</h2>
            <div>
                <div id='ProjectEditors'>
                    {/* Tabs Editors*/}
                </div>
                <Button>Clac</Button>
                <div id='ProjectLog'>

                </div>
            </div>
            <div id='ProjectCont'>

            </div>
        </div>

    )
}