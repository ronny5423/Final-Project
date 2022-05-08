import React,{useState,useEffect,useRef} from "react"
import axios from "axios";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import {serverAddress} from "../../Constants";


export default function TransformationComponent(props){

    const transformationType = props.transformationType;
    const projectId = props.projectId;
    const [transformationResults, updateTransformation] = useState({})
    const [clusters, updateClusters] = useState({})
    const [clusterColor, updateClusterColor] = useState({})
    const [load, updateLoad] = useState(true)
    let colors = ['blue', 'red', 'green', 'purple', 'cyan']

    function swap(json){
        var ret = {};
        for (const [key, valueArr] of Object.entries(json)){
            for (const value in valueArr) {
                ret[valueArr[value]] = key;
            }
        }
        return ret;
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function assignColorToCluster(clusters){
        let clusterToColor = {}
        let idx = 0
        for(let clusterKey in clusters){
            if(idx >= colors.length)
                clusterToColor[clusterKey] = getRandomColor()
            else
                clusterToColor[clusterKey] = colors[idx++]
        }
        return clusterToColor
    }


    useEffect(()=>{
        async function calculateProjectTransformation() {
            let response = undefined
            try {
                updateLoad(true)
                response = await axios.get(serverAddress+`/projects/transformation/${projectId}/${transformationType}`)
                if(response && response.data){
                    let trans = JSON.parse(response.data.transformation)
                    updateTransformation(trans)
                    let final_clusters = JSON.parse(response.data.final_clusters.Results.final_clusters)
                    let swap_final_clusters = swap(final_clusters)
                    updateClusterColor(assignColorToCluster(final_clusters))
                    updateClusters(swap_final_clusters)
                }
            }catch (e) {

            }
        }
        calculateProjectTransformation()
    },[])


    function createEmbeddedClasses(classObj){
        if (!("embedded_classes" in classObj)){
            return []
        }
        let embedded_classes = []
        for (const [key, value] of Object.entries(classObj.embedded_classes)){
            embedded_classes.push(createClass(key, value, transformationType))
        }
        return embedded_classes
    }

    function createClass(name, classObj, transformationType){
        let cluster = name in clusters ? clusters[name] : undefined
        let color = cluster === undefined ? 'black' : clusterColor[cluster]
        //{name in clusters ? <span> [cluster {clusters[name]}] </span> : ''}
        let className = <h3 style={{color: color}}>{name}</h3>
        let properties = createPropertiesList(classObj.Properties)
        let embeddedClasses = []
        if (transformationType === "document"){
            embeddedClasses = createEmbeddedClasses(classObj)
        }
        return <div style={{margin: '1% 1%', float: 'left', border: '1px solid red', padding: '5px'}}>
                    {className}
                    <h5><b><u>Properties:</u></b></h5>
                    {properties}
            {embeddedClasses.length > 0 ? <div><h5><b><u>Embedded Classes:</u></b></h5>
                {embeddedClasses}</div> : ''}
                </div>
    }

    function createPropertiesList(properties){
        let propertiesArr = []
        for (const propElem of properties) {
            propertiesArr.push(<li>{propElem.name}: {propElem.type}</li>)
        }
        return <ul>{propertiesArr}</ul>
    }

    function createNodes(){
        let classesArr = []
        if (!('nodes' in transformationResults))
            return
        for (const [key, value] of Object.entries(transformationResults.nodes)) {
            let clsDiv = createClass(key, value, transformationType)
            classesArr.push(clsDiv)
        }
        return classesArr
    }


    function createEdge(edge_obj) {
        let class_from = edge_obj['Class_From']
        let class_to = edge_obj['Class_To']
        let cardinal_from = edge_obj['Cardinal_From']
        let cardinal_to = edge_obj['Cardinal_To']
        let edge_name = edge_obj['Edge_Name']
        let properties = createPropertiesList(edge_obj.Properties)
        let cluster_from = class_from in clusters ? clusters[class_from] : undefined
        let color_from = cluster_from === undefined ? 'black' : clusterColor[cluster_from]
        let cluster_to = class_to in clusters ? clusters[class_to] : undefined
        let color_to = cluster_to === undefined ? 'black' : clusterColor[cluster_to]

        return <div style={{margin: '1% 1%', float: 'left', border: '1px solid red', padding: '5px'}}>
            <h3><span style={{color: color_from}}>{class_from}</span> --> <span style={{color: color_to}}>{class_to}</span></h3>
            <h6>Edge Name : {edge_name}</h6>
            <h6>Cardinal at {class_from} : {cardinal_from}</h6>
            <h6>Cardinal at {class_to} : {cardinal_to}</h6>
            <h5><b><u>Properties:</u></b></h5>
            {properties}
        </div>
    }

    function createEdges(){
        let edgesArr = []
        if (!('edges' in transformationResults))
            return
        for (const [key, value] of Object.entries(transformationResults.edges)) {
            let clsDiv = createEdge(value)
            edgesArr.push(clsDiv)
        }
        return edgesArr
    }


    return (
        <div style={{margin: '3% 0px', fontFamily: "inherit"}}>
            {transformationType === "document" ? <h1>Classes:</h1> : <h1>Nodes:</h1>}
            <div style={{display: 'flex', 'flex-flow': 'wrap', 'margin-left': '5%', 'margin-right': '5%'}}>{createNodes()}</div>

            {transformationType === "graph" ? <h1>Edges:</h1> : ''}
            {transformationType === "graph" ? <div style={{display: 'flex', 'flex-flow': 'wrap', 'margin-left': '5%', 'margin-right': '5%'}}>{createEdges()}</div> : ''}
            {/*{!load && transformationType === "document" ? <TransformationDocumentNodes nodes={transformationResults}/> : <div>aaaa</div>}*/}
            {/*{JSON.stringify(transformationResults.nodes, null, 6)}*/}
        </div>
    )
}