import React from 'react';
import PrevProject from '../sharedComponents/PrevProject';


export default function MyProjects() {


    return (
        <div>
            <div id='Projects'>
                <PrevProject name={'My Project'} lastUpdate={'2018/9/1'} discription={'A Project'} Users={['Eran', 'Ron']}></PrevProject>
            </div>
            <div id='UserLog'>
                
            </div>
        </div>
    )
}