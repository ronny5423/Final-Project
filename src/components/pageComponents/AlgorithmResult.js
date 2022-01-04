import React, {useEffect, useState} from "react";
import {Button, Table, Tooltip} from "react-bootstrap";
import axios from "axios";
import {serverAddress} from "../../Constants";
import {useNavigate, useParams} from "react-router-dom";

export default function AlgorithmResult(){
    const[algorithmResult, updateAlgorithmResult] = useState({})
    let {projectId} = useParams()

    useEffect(()=>{
        async function fetchAlgorithmResult(){
            let response= await axios.post(serverAddress+`/projects/calculate`, {"projectID": parseInt(projectId)})
            if(response.status===200){
                let results = response.data
                let fc = JSON.parse(results['final_clusters'])
                let dbd = JSON.parse(results['DB_distance'])
                results['final_clusters'] = fc
                results['DB_distance'] = dbd
                // results['final_clusters']['1'] = ["Class C"]
                // results['DB_distance']['1'] = {'RDBMS': 0.8, 'Document': 0.35}
                updateAlgorithmResult(results)
            }
            //console.log(algorithmResult)
        }
        fetchAlgorithmResult()
    },[])


    function createTableHead(){
        if(!('final_clusters' in algorithmResult)){
            return
        }
        let td_arr = []
        let o_size = Object.keys(algorithmResult['final_clusters']).length
        for(let [cluster_key, cluster_classes] of Object.entries(algorithmResult['final_clusters'])){
            let s = "Cluster "+ cluster_key +":";
            for(let i =0; i < cluster_classes.length; i++){
                s += " " + cluster_classes[i] + ",";
            }
            s = s.substring(0, s.length - 1);
            td_arr.push(<td colSpan="2"><b>{s}</b></td>)
        }
        return td_arr;
    }


    function createTableSecondRow(){
        if(!('final_clusters' in algorithmResult)){
            return
        }
        let td_arr = []
        let o_size = Object.keys(algorithmResult['final_clusters']).length
        for(let [cluster_key, cluster_classes] of Object.entries(algorithmResult['final_clusters'])){
            td_arr.push(<td width={(50/o_size)+'%'}>DB name</td>)
            td_arr.push(<td width={(50/o_size)+'%'}>Distance</td>)
        }
        return td_arr;
    }


    function sortDBforClusters(){

        const sortedDis = new Map();
        let len = 0;

        for(let cluster_key in Object.keys(algorithmResult['final_clusters'])){
            let sort_arr = []
            for(let [db_name, db_diss] of Object.entries(algorithmResult['DB_distance'][cluster_key])){
                sort_arr.push({'db_name': db_name, 'db_diss': db_diss})
            }
            sort_arr.sort(function (a, b) {
                return a.db_diss - b.db_diss;
            });
            len = sort_arr.length;
            sortedDis.set(cluster_key, sort_arr);
        }

        return [sortedDis, len];
    }


    function createDataRow(i, sortedData){
        let td_arr = []
        for(const [key, arr] of sortedData){
            let db_name = arr[i]['db_name']
            let db_diss = arr[i]['db_diss']
            db_diss = Math.round((db_diss + Number.EPSILON) * 1000) / 1000
            td_arr.push(<td>{db_name}</td>);
            td_arr.push(<td>{db_diss}</td>);
        }
        //console.log(td_arr)
        return td_arr
    }

    function createTableData(){
        if(!('final_clusters' in algorithmResult)){
            return
        }

        let tr_arr = []

        const [sortedData, len] = sortDBforClusters()
        //console.log(sortedData)
        // console.log(len);

        for(let i = 0; i < len; i++){
            tr_arr.push(<tr>{createDataRow(i.toString(), sortedData)}</tr>)
        }
        //console.log(tr_arr)
        return tr_arr
    }


    return(
        <div>
            <h1>Results</h1>
            <Table responsive>
                <thead>
                    <tr>
                        {   
                            createTableHead()
                        }
                    </tr>
                    <tr>
                        {
                            createTableSecondRow()
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    createTableData()
                }
                </tbody>
            </Table>
        </div>
    )
}