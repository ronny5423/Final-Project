import React, {useEffect, useState} from 'react';
import {Table} from "react-bootstrap";
import "../cssComponents/EditorMatrix.css";


export default function EditorMatrix(props){

    // const [convertedData, updateData] = useState({})
    // const [type, updateType] = useState("")
    let type = ""
    let convertedData = {}

    // useEffect(() => {
    //     let stringifyData = localStorage.getItem("matrixData");
    //     localStorage.removeItem("matrixData");
    //
    //     if (!stringifyData){
    //         return
    //     }
    //     let matrixData = JSON.parse(stringifyData);
    //
    //     if(!('type' in matrixData) || !('convertedData' in matrixData)){
    //         return;
    //     }
    //
    //     updateType(matrixData['type'])
    //     let convertedData2 = matrixData['convertedData']
    //     if(type === 'UML' || type === 'SQL'){
    //         convertedData2['classes'] = Object.values(convertedData2['classes'])
    //     }
    //     updateData(convertedData2)
    //
    // }, [])


    function loadData(){
        let stringifyData = localStorage.getItem("matrixData");
        //localStorage.removeItem("matrixData");

        if (!stringifyData){
            return
        }
        let matrixData = JSON.parse(stringifyData);

        if(!('type' in matrixData) || !('convertedData' in matrixData)){
            return;
        }

        //updateType(matrixData['type'])
        type = matrixData['type']
        convertedData = matrixData['convertedData']
        if(type === 'UML' || type === 'SQL'){
            convertedData['classes'] = Object.values(convertedData['classes'])
        }
        //updateData(convertedData2)
    }

    function createTable(){
        loadData()
        let dataArr = createDataArr()

        const cols = convertedData['shape']+1
        const rows = Math.ceil(dataArr.length / cols)

        function dataMap(c, idx){
            if (idx == 0){
                return <th>{c}</th>;
            }
            else {
                return <td>{c}</td>;
            }
        }

        return Array.from({ length: rows }, (_, i) => (
            <tr>
                {
                    i===0 ? dataArr.slice(i * cols, (i + 1) * cols)
                        .map(c => <th>{c}</th>)
                        :
                        dataArr.slice(i * cols, (i + 1) * cols)
                            .map(dataMap)
                }
            </tr>
        ))
    }

    function createDataArr(){
        let matrixDataToArr = []
        let matrixClasses = Object.values(convertedData['matrix_classes'])
        let shape = convertedData['shape']
        let classes = convertedData['classes'].map(getFirstCell)

        function getFirstCell(classArr){
            return classArr[0];
        }

        //first row - classes names
        matrixDataToArr.push("")
        classes.forEach(cls => matrixDataToArr.push(cls));

        let classIdx = 0
        let dataIdx = 0

        for (let i = 0; i < shape; i++){
            matrixDataToArr.push(classes[classIdx])
            classIdx++

            for (let j = 0; j < shape; j++){

                matrixDataToArr.push(matrixClasses[dataIdx].toFixed(3))
                dataIdx++
            }
        }

        return matrixDataToArr;
    }

    function mh(){

        var tds =
            document.querySelectorAll("#matrix td");
        var ths =
            document.querySelectorAll("#matrix th");

        var cells =
            Array.prototype.slice.call(tds)
                .concat(
                    Array.prototype.slice.call(ths)
                );

        var rows =
            document.querySelectorAll("#matrix tr");


        [].forEach.call(
            cells,
            function(el) {
                el.addEventListener(
                    'mouseover',
                    function() {

                        var index = indexInParent(this);
                        if(index == 0 || this.parentNode.rowIndex == 0)
                            return;

                        let thRowCells = rows[0].getElementsByTagName("th");
                        thRowCells[index]
                            .classList
                            .add("hover");

                        let currRowCells = rows[this.parentNode.rowIndex].getElementsByTagName("td");
                        currRowCells[index-1]
                            .classList
                            .add("hover");
                        let currRowCellsTh = rows[this.parentNode.rowIndex].getElementsByTagName("th");
                        currRowCellsTh[0]
                            .classList
                            .add("hover");

                        // for (var i = 0; i < rows.length; i++) {
                        //     var cellsInThisRow = rows[i].getElementsByTagName("td");
                        //
                        //     if (cellsInThisRow.length == 0) {
                        //         cellsInThisRow = rows[i].getElementsByTagName("th");
                        //     }
                        //
                        //     cellsInThisRow[index]
                        //         .classList
                        //         .add("hover");
                        // };

                    },
                    false
                );
            }
        );

        [].forEach.call(
            cells,
            function(el) {
                el.addEventListener(
                    'mouseout',
                    function() {
                        for (var i = 0; i < cells.length; i++) {
                            cells[i]
                                .classList
                                .remove("hover");
                        }
                    },
                    false
                );
            }
        );

        function indexInParent(node) {
            var children = node.parentNode.childNodes;
            var num = 0;
            for (var i=0; i<children.length; i++) {
                if (children[i]==node) return num;
                if (children[i].nodeType==1) num++;
            }
            return -1;
        }
    }



    return(
        <Table onMouseOver={mh} id={"matrix"} responsive={true}>
            <tbody>
                {
                    createTable()
                }
            </tbody>
        </Table>
    );
};