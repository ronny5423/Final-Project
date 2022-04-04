import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import "../cssComponents/umlEditor.css";
import {Button, Modal, Tooltip} from "react-bootstrap";
import val from "../../Utils/UmlValidationUtill";
import ModalComponnent from '../sharedComponents/ModalComponnent';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faQuestion, faBookmark } from '@fortawesome/fontawesome-free-solid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";
import EditorMatrix from "./EditorMatrix";
import {useNavigate} from "react-router-dom";
import "../../Utils/TextEditorSelectBox";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import SavingSpinner from "../sharedComponents/SavingSpinner";


var umlJson={ "class": "GraphLinksModel",
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "linkKeyProperty": "key",
    "linkLabelKeysProperty": "labelKeys",
    "nodeDataArray": [],
    "linkDataArray": []};

let modalBody = <div>
    <p>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Drag and Drop classes and links from the pallete on the left into the diagram
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Click on a class and then click on the bottom left button next to it in order to create an new class attribiute
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Click on the button on the rigth of a class attribuite in order to remove said attribuite from the class
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> Double click on any of the text in the diagram in order to edit it
        <br></br>
        <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon> In order to connect association class link to a normal association link, double click the normal link and then connect the other link to the blue dot
    </p>
</div>

let modalHeader = <h3>How to use UML EDITOR?</h3>


export default function UmlEditor(props){
    let [myDiagram, updateDiagram] = useState({})
    const [editorID, updateEditorId]=useState(props.id)
    const [modalShow, setModalShow] = React.useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [saving,updateSaving]=useState(false)
    let navigate = useNavigate()
    let propertyTypes = []

    useEffect(()=>{
        async function fetchUmlFromServer() {
            let response = undefined;
            if (!editorID)
                return;
            try {
                response = await axios.get(serverAddress+`/editors/loadEditor?ID=${editorID}`);
            }catch (e){
                console.log(e);
                console.trace();
                //loadUml(umlJson); 
            }
            //response = await axios.get(serverAddress+`/getSql`);
            if (response && response.data && response.data.undecipheredJson) {
                //myDiagram = response.data.uml;
                loadUml(response.data.undecipheredJson)
                //updateDiagram(myDiagram)
                props.changeUmlStatus(true);
                props.updateClasses(getClassesObject());
            }
        }
        fetchUmlFromServer()
    },[])




    function initDiagram() {
        var $ = go.GraphObject.make;  // for conciseness in defining templates

        if(editorID === undefined){
            let myDiagram = {}
        }

        myDiagram =
            $(go.Diagram, // must name or refer to the DIV HTML element
                {
                    grid: $(go.Panel, "Grid",
                        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                        $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
                        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                        $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
                    ),
                    "draggingTool.dragsLink": true,
                    "draggingTool.isGridSnapEnabled": true,
                    "linkingTool.isUnconnectedLinkValid": true,
                    "linkingTool.portGravity": 20,
                    "relinkingTool.isUnconnectedLinkValid": true,
                    "relinkingTool.portGravity": 20,
                    "relinkingTool.fromHandleArchetype":
                        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
                    "relinkingTool.toHandleArchetype":
                        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
                    "linkReshapingTool.handleArchetype":
                        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                    "rotatingTool.handleAngle": 270,
                    "rotatingTool.handleDistance": 30,
                    "rotatingTool.snapAngleMultiple": 15,
                    "rotatingTool.snapAngleEpsilon": 15,
                    "undoManager.isEnabled": true,
                    "toolManager.hoverDelay": 1
                });
        myDiagram.model.copiesArrayObjects = true;

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", function(e) {
            var button = document.getElementById("SaveButton");
            var loadButton = document.getElementById("LoadButton");
            var matrixButton = document.getElementById("MatrixButton");
            if (button) button.disabled = !myDiagram.isModified;
            if (loadButton) loadButton.disabled = !myDiagram.isModified;
            if (matrixButton) matrixButton.disabled = myDiagram.isModified;
            // if (matrixButton){
            //     console.log(editorID)
            //     if(!editorID){
            //         matrixButton.disabled = true;
            //     }else {
            //         matrixButton.disabled = myDiagram.isModified;
            //     }
            // }
            var idx = document.title.indexOf("*");
            //console.log("dis", myDiagram.isModified)
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
                //props.changeUmlStatus(false);
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        myDiagram.addModelChangedListener(function(evt) {
            // ignore unimportant Transaction events
            if (!evt.isTransactionFinished) return;
            var txn = evt.object;  // a Transaction
            if (txn === null) return;
            // iterate over all of the actual ChangedEvents of the Transaction
            txn.changes.each(function(e) {
                // record node insertions and removals
                let modelS = myDiagram.model.toJson();
                let modelC = JSON.parse(modelS)
                while(propertyTypes.length > 0) {
                    propertyTypes.pop();
                }
                let constantTypes = ['Number', 'String', 'Boolean', 'Char', 'Data', 'Time']
                propertyTypes.push(...constantTypes)
                for(let i = 0; i < modelC["nodeDataArray"].length; i++){
                    let className = modelC['nodeDataArray'][i]['name']
                    if(className !== undefined)
                        propertyTypes.push(className)
                }
                let len = propertyTypes.length
                for(let i = 0; i < len; i++){
                    let lst = "List<"+propertyTypes[i]+">"
                    propertyTypes.push(lst)
                }
            });
        });


        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small transparent circle
            return $(go.Shape, "Circle",
                {
                    fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                    stroke: null,
                    desiredSize: new go.Size(7, 7),
                    alignment: spot,  // align the port on the main Shape
                    alignmentFocus: spot,  // just inside the Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer",  // show a different cursor to indicate potential link point
                    fromLinkableDuplicates: true, toLinkableDuplicates: true,
                    fromLinkableSelfNode: true, toLinkableSelfNode: true
                });
        }

        var nodeSelectionAdornmentTemplate =
            $(go.Adornment, "Auto",
                $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
                $(go.Placeholder)
            );

        var nodeResizeAdornmentTemplate =
            $(go.Adornment, "Spot",
                { locationSpot: go.Spot.Right },
                $(go.Placeholder),
                $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
            );

        var nodeRotateAdornmentTemplate =
            $(go.Adornment,
                { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
                $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
            );


        function showSmallPorts(node, show) {
            node.ports.each(function(port) {
                if (port.portId !== "") {  // don't change the default port, which is the big shape
                    port.fill = show ? "rgba(0,0,0,.3)" : null;
                }
            });
        }


        var linkSelectionAdornmentTemplate =
            $(go.Adornment, "Link",
                $(go.Shape,
                    // isPanelMain declares that this Shape shares the Link.geometry
                    { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
            );


        function AssociationClassLinkValidation(fromnode, fromport, tonode, toport){
            //console.log(fromnode);
            if(!fromnode || !tonode){
                return true;
            }
            if(fromnode.data.type === "Association Class" || tonode.data.type === "Association Class"){
                return true;
            }

            return false;
        }

        //myDiagram.toolManager.linkingTool.linkValidation = AssociationClassLinkValidation;

        //myDiagram.toolManager.relinkingTool.linkValidation = AssociationClassLinkValidation;

        myDiagram.nodeTemplateMap.add("LinkLabel",
            $(go.Node,
                {
                    layerName: "Foreground",  // always have link label nodes in front of Links
                    background: "transparent",
                    width: 12, height: 12,
                    locationSpot: go.Spot.Center,
                    movable: false,  // but becomes movable when it's not a label on a Link
                    deletable: false,  // but becomes deletable when there's no connected link
                    // only deletable when it's unconnected
                    linkConnected: function(node, link, port) {
                        node.deletable = false;
                    },
                    linkDisconnected: function(node, link, port) {
                        node.deletable = (node.linksConnected.count === 0);
                    }
                },
                // only movable when it's a label Node of a Link
                new go.Binding("movable", "labeledLink", function(link) { return link === null; }).ofObject(),
                new go.Binding("segmentIndex").makeTwoWay(),  // remember where this label belongs on the link
                new go.Binding("segmentFraction").makeTwoWay(),
                $(go.Shape, "Circle",
                    { // a junction node appears as just a small black circle
                        position: new go.Point(3, 3),  // center the circle in the Node
                        width: 5, height: 5,
                        stroke: null,
                        fill: null,
                        background: "blue",
                        portId: "",
                        fromLinkable: true, toLinkable: true, cursor: "pointer"
                    })
            ));


        function CardinalValidation(textblock, oldstr, newstr){

            function tockenValidate(str){
                return str === '*' || (!isNaN(+str) && str.replace(/\s/g, "") !== '');
            }

            if(newstr.length == 0)
                return false

            if((newstr.match(/\s/g) || []).length > 0)
                return false

            let countDots = (newstr.match(/\./g) || []).length;
            if(countDots !== 0 && countDots !== 2){
                return false
            }

            if(countDots === 2 && newstr.includes("..")){
                let cardArr = newstr.split("..")
                let from = cardArr[0]
                if(from === '*')
                    return false
                let to = cardArr[1]
                if(tockenValidate(from) && tockenValidate(to))
                    return true
                else
                    return false
            }
            else if(countDots === 2)
                return false

            return tockenValidate(newstr)
        }

        function CardinalErrorMsg(newstr){

            function tockenValidate(str){
                return str === '*' || (!isNaN(+str) && str.replace(/\s/g, "") !== '');
            }

            if(newstr.length == 0)
                return "new string is empty"

            if((newstr.match(/\s/g) || []).length > 0)
                return "new string should not include whitespace"

            let countDots = (newstr.match(/\./g) || []).length;
            if(countDots !== 0 && countDots !== 2){
                return "new string should either include no dots or 2 dots like this '..' "
            }

            if(countDots === 2 && newstr.includes("..")){
                let cardArr = newstr.split("..")
                let from = cardArr[0]
                if(from === '*')
                    return "Cardinal value cant have '*' as bottom range"
                let to = cardArr[1]
                if(tockenValidate(from) && tockenValidate(to))
                    return true
                else
                    return "Cradinal bounds arent numbers or '*'"
            }
            else if(countDots === 2)
                return "new string should either include no dots or 2 dots like this '..' "

            let isVal = tockenValidate(newstr)
            if(!isVal)
                return "new string isnt a number or '*'"
            return ''
        }

        function ValidationErrorRais(tool, olds, news){
            // create and show tooltip about why editing failed for this textblock
            var mgr = tool.diagram.toolManager;
            mgr.hideToolTip();  // hide any currently showing tooltip
            var node = tool.textBlock.part;
            // create a GoJS tooltip, which is an Adornment
            var errorMsg = CardinalErrorMsg(news)

            var tt = $("ToolTip",
                {
                    "Border.fill": "pink",
                    "Border.stroke": "red",
                    "Border.strokeWidth": 2
                },
                $(go.TextBlock,
                    "Unable to replace the string '" + olds + "' with '" + news +
                    "' on Cardinal Link'" +
                    "'\nbecause " + errorMsg));
            mgr.showToolTip(tt, node);
        }


        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
                { relinkableFrom: true, relinkableTo: true, reshapable: true},
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape,  // the link path shape
                    { isPanelMain: true, strokeWidth: 2 },
                    new go.Binding("strokeDashArray", "dashed")),
                $(go.Shape, { scale: 1.3, fill: "white" }, // the arrowhead
                    new go.Binding("toArrow", "toArrow")),
                $(go.TextBlock,
                    { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleTo").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: 0, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true,
                        textValidation: CardinalValidation,
                        errorFunction: ValidationErrorRais
                    }, new go.Binding("text", "MultiFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true,
                        textValidation: CardinalValidation,
                        errorFunction: ValidationErrorRais}, new go.Binding("text", "MultiTo").makeTwoWay()),
                $(go.TextBlock, { segmentIndex: 2, segmentFraction: 0.5, segmentOffset: new go.Point(NaN, 10), editable: true },  // centered multi-line text
                    new go.Binding("text", "LinkName").makeTwoWay())
            );

        //load();  // load an initial diagram from some JSON text

        // show visibility or access as a single character at the beginning of each property or method
        function convertVisibility(v) {
            if(v==="+" || v==="-" || v==="#" || v==="~")
                return v;

            switch (v) {
                case "public": return "+";
                case "private": return "-";
                case "protected": return "#";
                case "package": return "~";
                default: return "+";
            }
        }

        function createJunction(e, link) { // Creates Junction node when user double clicks on a link
            if(link && link.ob.labelKeys.length === 1)
                return;
            e.handled = true;
            e.diagram.startTransaction("Link Label");

            var label = { category: "LinkLabel" }; // Create data for label node -- the junction Node
            e.diagram.model.addNodeData(label);

            var labelnode = e.diagram.findNodeForData(label); // Finds the created node from the NodeData
            attachJunction(link, labelnode, e.documentPoint);

            e.diagram.commitTransaction("Link Label");
        }

        function attachJunction(link, labelnode, pos) {
            labelnode.labeledLink = link;		// set the labeledLink for the junction node

            var index = link.findClosestSegment(pos); // Finds the index of the segment that is closest to POS
            labelnode.segmentIndex = index;

            var startPoint = link.points.elt(index); // Grabs the point at the start and end of the segment
            var endPoint = link.points.elt(index + 1);
            // Finds diff between pos and startPoint divided by diff of endPoint and startPoint
            if (Math.abs(startPoint.x - endPoint.x) < 0.1) { // Segment is horizontal
                labelnode.segmentFraction = (pos.y - startPoint.y) / (endPoint.y - startPoint.y);
            } else { // Segment is vertical
                labelnode.segmentFraction = (pos.x - startPoint.x) / (endPoint.x - startPoint.x);
            }
        }

        myDiagram.linkTemplateMap.add("Linkble",
            $("Link",
                { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
                { relinkableFrom: true, relinkableTo: true, reshapable: true},
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4,
                    doubleClick: createJunction
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape,  // the link path shape
                    { isPanelMain: true, strokeWidth: 2 },
                    new go.Binding("strokeDashArray", "dashed")),
                $(go.Shape, { scale: 1.3, fill: "white" }, // the arrowhead
                    new go.Binding("toArrow", "toArrow")),
                $(go.TextBlock,
                    { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleTo").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: 0, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true,
                        textValidation: CardinalValidation,
                        errorFunction: ValidationErrorRais
                    }, new go.Binding("text", "MultiFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true,
                        textValidation: CardinalValidation,
                        errorFunction: ValidationErrorRais}, new go.Binding("text", "MultiTo").makeTwoWay()),
                $(go.TextBlock, { segmentIndex: 2, segmentFraction: 0.5, segmentOffset: new go.Point(NaN, 10), editable: true },  // centered multi-line text
                    new go.Binding("text", "LinkName").makeTwoWay())
            ));

        function typeChoises(textBlock, diagram, tool){
            return propertyTypes
        }

        // the item template for properties
        var propertyTemplate =
            $(go.Panel, "Horizontal",
                // property visibility/access
                $(go.TextBlock, "+",
                    { isMultiline: false, editable: true, width: 12 },
                    new go.Binding("text", "visibility", function (v) { return convertVisibility(v) }).makeTwoWay()),
                // property name, underlined if scope=="class" to indicate static property
                $(go.TextBlock, "Attribute Name:",
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name", function (s) { return s.slice(-1)===':' ? s : s+":" }).makeTwoWay(),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // property type, if known
                $(go.TextBlock, " "),
                $(go.TextBlock, "Type",
                    { isMultiline: false, editable: true, textEditor: window.TextEditorSelectBox, // defined in textEditorRadioButtons.js
                        // this specific TextBlock has its own choices:
                        choices: typeChoises()},
                    new go.Binding("text", "type").makeTwoWay(),
                    new go.Binding("choices")
                ),
                // property default value, if any
                $(go.TextBlock,
                    { isMultiline: false, editable: false },
                    new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; })),
                $("Button",
                    { margin: 2,
                        click: removeProperty,
                    },
                    $(go.Shape, "LineH", { desiredSize: new go.Size(10, 10) }))
            );

        var methodTemplate =
            $(go.Panel, "Horizontal",
                // method visibility/access
                $(go.TextBlock,
                    { isMultiline: false, editable: false, width: 12 },
                    new go.Binding("text", "visibility", convertVisibility)),
                // method name, underlined if scope=="class" to indicate static method
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name").makeTwoWay(),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // method parameters
                $(go.TextBlock, "()",
                    // this does not permit adding/editing/removing of parameters via inplace edits
                    new go.Binding("text", "parameters", function (parr) {
                        var s = "(";
                        for (var i = 0; i < parr.length; i++) {
                            var param = parr[i];
                            if (i > 0) s += ", ";
                            s += param.name + ": " + param.type;
                        }
                        return s + ")";
                    })),
                // method return type, if any
                $(go.TextBlock, "",
                    new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "type").makeTwoWay())
            );


        var UndesiredEventAdornment =
            $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
                    $(go.Placeholder)),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    {
                        alignment: go.Spot.BottomRight,
                        click: addProperty
                    },  // this function is defined below
                    new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
                    $(go.Shape, "PlusLine", { desiredSize: new go.Size(10, 10) })
                )
            );

        function removeProperty(e, obj){
            var pan = obj.panel;
            if (pan === null) return;
            var ob = pan.ob;
            var data = obj.part.data.properties;
            //var arr = adorn.adornedPart.data.properties;  __gohashid
            myDiagram.startTransaction("remove property");
            //myDiagram.model.addArrayItem(arr, {});
            for(let i=0; i < data.length; i++){
                if(data[i]["__gohashid"] === ob.__gohashid){
                    myDiagram.model.removeArrayItem(data, i);
                    break;
                }
            }
            myDiagram.commitTransaction("remove property");
        }

        function addProperty(e, obj) {
            var adorn = obj.part;
            if (adorn === null) return;
            e.handled = true;
            var arr = adorn.adornedPart.data.properties;
            myDiagram.startTransaction("add property");
            myDiagram.model.addArrayItem(arr, {});
            myDiagram.commitTransaction("add property");
        }

        function convertFill(v) {
            switch (v) {
                case "Association Class": return "orange";
                default: return "lightyellow";
            }
        }

        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                {
                    locationSpot: go.Spot.Center,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                { selectionAdornmentTemplate: UndesiredEventAdornment },
                $(go.Shape, new go.Binding("fill", "type", convertFill)),
                $(go.Panel, "Table",
                    { defaultRowSeparatorStroke: "black" },
                    // header
                    $(go.TextBlock,
                        {
                            row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                            font: "bold 12pt sans-serif",
                            isMultiline: false, editable: true,
                            textValidation: function(tb, olds, news) {
                                var regExp = /[a-zA-Z]/g;
                                return regExp.test(news);  // new string must contain a letter
                            },
                            errorFunction: function(tool, olds, news) {
                                // create and show tooltip about why editing failed for this textblock
                                var mgr = tool.diagram.toolManager;
                                mgr.hideToolTip();  // hide any currently showing tooltip
                                var node = tool.textBlock.part;
                                // create a GoJS tooltip, which is an Adornment
                                var tt = $("ToolTip",
                                    {
                                        "Border.fill": "pink",
                                        "Border.stroke": "red",
                                        "Border.strokeWidth": 2
                                    },
                                    $(go.TextBlock,
                                        "Unable to replace the string '" + olds + "' with '" + news +
                                        "' on node '" + node.key +
                                        "'\nbecause the new string does not contain a letter."));
                                mgr.showToolTip(tt, node);
                            }
                        },
                        new go.Binding("text", "name").makeTwoWay()),
                    // properties
                    $(go.TextBlock, "Properties",
                        { row: 1, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                    $(go.Panel, "Vertical", { name: "PROPERTIES" },
                        {
                            row: 1, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left,
                            itemTemplate: propertyTemplate,

                        },
                        new go.Binding("itemArray", "properties"),
                    ),
                    $("PanelExpanderButton", "PROPERTIES",
                        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                        //new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })
                    ),
                    // methods
                    $(go.TextBlock, "Methods",
                        { row: 2, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                    $(go.Panel, "Vertical", { name: "METHODS" },
                        new go.Binding("itemArray", "methods"),
                        {
                            row: 2, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: "lightyellow",
                            itemTemplate: methodTemplate
                        }
                    ),
                    $("PanelExpanderButton", "METHODS",
                        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
                ),
                // four small named ports, one on each side:
                makePort("T", go.Spot.Top, true, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, true),
            );


        myDiagram.model = $(go.GraphLinksModel,
            {
                linkKeyProperty: "key",
                linkLabelKeysProperty: "labelKeys",
                copiesArrays: true,
                copiesArrayObjects: true
            });

        //loadUml();
        //console.log(myDiagram.model);
        if(editorID === undefined){
            updateDiagram(myDiagram)
        }
        // updateDiagram(myDiagram)

        return myDiagram;
    }

    function initPalette() {
        const $ = go.GraphObject.make;
        var myPalette = $(go.Palette, {
                maxSelectionCount: 1,
                //nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                linkTemplate: // simplify the link template, just in this Palette
                    $(go.Link,
                        { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                            // to line up the Link in the same manner we have to pretend the Link has the same location spot
                            locationSpot: go.Spot.Center,
                            selectionAdornmentTemplate:
                                $(go.Adornment, "Link",
                                    { locationSpot: go.Spot.Center },
                                    $(go.Shape,
                                        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 2 },
                                        new go.Binding("strokeDashArray", "dashed")),
                                    $(go.Shape, { scale: 1.3, fill: "white" },  // the arrowhead
                                        new go.Binding("toArrow", "toArrow"))
                                )
                        },
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5,
                            toShortLength: 4
                        },
                        new go.Binding("points"),
                        $(go.Shape,  // the link path shape
                            { isPanelMain: true, strokeWidth: 2 },
                            new go.Binding("strokeDashArray", "dashed")),
                        $(go.Shape, { scale: 1.3, fill: "white" },  // the arrowhead
                            new go.Binding("toArrow", "toArrow")),
                        {
                            toolTip:  // define a tooltip for each node that displays the color as text
                                $("ToolTip",
                                    $(go.TextBlock, { margin: 4 },
                                        new go.Binding("text", "name"))
                                )  // end of Adornment
                        }
                    ),
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    {
                        type: "Class",
                        name: "Class",
                        properties: [
                            // { name: "classes", type: "List<Course>", visibility: "public" }
                        ],
                        methods: []
                    },{

                        type: "Association Class",
                        name: "Association Class",
                        properties: [
                            // { name: "cla", type: "List<Course>", visibility: "public" }
                        ],
                        methods: []
                    }
                ], [
                    // the Palette also has a disconnected Link, which the user can drag-and-drop
                    {category: "Linkble", name: "association", RoleFrom: "from", RoleTo: "to", MultiFrom: "0", MultiTo: "1", LinkName: "link name", toArrow: "", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) },
                    {name: "generalization", toArrow: "Triangle", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) },
                    {name: "associationClassLink", dashed: [5,5], toArrow: "", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) }
                ])
            }
        );


        function convertVisibility(v) {
            if(v==="+" || v==="-" || v==="#" || v==="~")
                return v;

            switch (v) {
                case "public": return "+";
                case "private": return "-";
                case "protected": return "#";
                case "package": return "~";
                default: return "+";
            }
        }

        let myDiagram = undefined;

        function removeProperty(e, obj){
            var pan = obj.panel;
            if (pan === null) return;
            var ob = pan.ob;
            var data = obj.part.data.properties;
            //var arr = adorn.adornedPart.data.properties;  __gohashid
            myDiagram.startTransaction("remove property");
            //myDiagram.model.addArrayItem(arr, {});
            for(let i=0; i < data.length; i++){
                if(data[i]["__gohashid"] === ob.__gohashid){
                    myDiagram.model.removeArrayItem(data, i);
                    break;
                }
            }
            myDiagram.commitTransaction("remove property");
        }

        function makePort(name, spot, output, input) {
            // the port is basically just a small transparent circle
            return $(go.Shape, "Circle",
                {
                    fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                    stroke: null,
                    desiredSize: new go.Size(7, 7),
                    alignment: spot,  // align the port on the main Shape
                    alignmentFocus: spot,  // just inside the Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer",  // show a different cursor to indicate potential link point
                    fromLinkableDuplicates: true, toLinkableDuplicates: true,
                    fromLinkableSelfNode: true, toLinkableSelfNode: true
                });
        }

        // the item template for properties
        var propertyTemplate =
            $(go.Panel, "Horizontal",
                // property visibility/access
                $(go.TextBlock, "+",
                    { isMultiline: false, editable: true, width: 12 },
                    new go.Binding("text", "visibility", convertVisibility).makeTwoWay()),
                // property name, underlined if scope=="class" to indicate static property
                $(go.TextBlock, "Attribute Name:",
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name", function (s) { return s.slice(-1)===':' ? s : s+":" }).makeTwoWay(),
                    //makeTwoWaySubBinding("text", "name"),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // property type, if known
                $(go.TextBlock,
                    new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
                $(go.TextBlock, "Type",
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "type").makeTwoWay()),
                // property default value, if any
                $(go.TextBlock,
                    { isMultiline: false, editable: false },
                    new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; })),
                $("Button",
                    { margin: 2,
                        click: removeProperty,
                    },
                    $(go.Shape, "LineH", { desiredSize: new go.Size(10, 10) }))
            );

        var methodTemplate =
            $(go.Panel, "Horizontal",
                // method visibility/access
                $(go.TextBlock,
                    { isMultiline: false, editable: false, width: 12 },
                    new go.Binding("text", "visibility", convertVisibility)),
                // method name, underlined if scope=="class" to indicate static method
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name").makeTwoWay(),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // method parameters
                $(go.TextBlock, "()",
                    // this does not permit adding/editing/removing of parameters via inplace edits
                    new go.Binding("text", "parameters", function (parr) {
                        var s = "(";
                        for (var i = 0; i < parr.length; i++) {
                            var param = parr[i];
                            if (i > 0) s += ", ";
                            s += param.name + ": " + param.type;
                        }
                        return s + ")";
                    })),
                // method return type, if any
                $(go.TextBlock, "",
                    new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "type").makeTwoWay())
            );

        function convertFill(v) {
            switch (v) {
                case "Association Class": return "orange";
                default: return "lightyellow";
            }
        }


        myPalette.nodeTemplate =
            $(go.Node, "Auto",
                {
                    locationSpot: go.Spot.Center,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, new go.Binding("fill", "type", convertFill)),
                $(go.Panel, "Table",
                    { defaultRowSeparatorStroke: "black" },
                    // header
                    $(go.TextBlock,
                        {
                            row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                            font: "bold 12pt sans-serif",
                            isMultiline: false, editable: true
                        },
                        new go.Binding("text", "name").makeTwoWay()),
                    // properties
                    $(go.TextBlock, "Properties",
                        { row: 1, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                    $(go.Panel, "Vertical", { name: "PROPERTIES" },
                        {
                            row: 1, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left,
                            itemTemplate: propertyTemplate,

                        },
                        new go.Binding("itemArray", "properties"),
                    ),
                    $("PanelExpanderButton", "PROPERTIES",
                        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
                    // methods
                    $(go.TextBlock, "Methods",
                        { row: 2, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                    $(go.Panel, "Vertical", { name: "METHODS" },
                        new go.Binding("itemArray", "methods"),
                        {
                            row: 2, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: "lightyellow",
                            itemTemplate: methodTemplate
                        }
                    ),
                    $("PanelExpanderButton", "METHODS",
                        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
                ),
                // four small named ports, one on each side:
                makePort("T", go.Spot.Top, true, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, true),
            );


        return myPalette;
    }

    function save() {
        let umlJ = JSON.parse(myDiagram.model.toJson());
        updateSaving(true)
        let problems = val(umlJ);
        if (problems.length > 0) {
            for (let problemIdx in problems) {
                toast.error("error: " + problems[problemIdx], {position: toast.POSITION.TOP_CENTER})
            }
            updateSaving(false)
            return;
        }
        saveDiagramProperties();  // do this first, before writing to JSON
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        umlJson = myDiagram.model.toJson();
        myDiagram.isModified = false;
        updateDiagram(myDiagram)
        saveUmlToServer().then((r) => {
            //console.log("r:" ,r)
            if (props !== undefined && typeof props.changeUmlStatus !== "undefined")
                props.changeUmlStatus(true);
            props.updateClasses(getClassesObject());
        });
    }

    async function saveUmlToServer(){
        let uml = JSON.parse(myDiagram.model.toJson());
        let url = undefined;
        try {
            if(editorID !== undefined){
                url = serverAddress+`/editors/updateUMLEditor`;
                let response = await axios.post(url, {'jsonFile': uml, 'EditorID': editorID});
                updateSaving(false)
                if(response.status !== 400){
                    toast.success("UML was saved successfully", {position: toast.POSITION.TOP_CENTER})
                }
            }
            else{
                url = serverAddress+`/editors/saveUMLEditor`;
                let response = await axios.post(url, {'jsonFile': uml, 'projectID': props.projectId});
                updateSaving(false)
                if(response.status === 200){
                    props.updateEditorId(response.data, 1)
                    updateEditorId(response.data)
                    toast.success("UML was saved successfully", {position: toast.POSITION.TOP_CENTER})
                }
                return response;
            }
            
        }catch (e){
            updateSaving(false)
            console.log(e);
            console.trace();
        }
    }

    function load() {
        //myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        myDiagram.model = go.Model.fromJson(umlJson);
        loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
    }

    function loadUml(umlJ) {
        myDiagram.model = go.Model.fromJson(umlJ);
        loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        umlJson = myDiagram.model.toJson();
        updateDiagram(myDiagram)
    }

    function saveDiagramProperties() {
        myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
    }

    function loadDiagramProperties(e) {
        // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
        var pos = myDiagram.model.modelData.position;
        if (pos) myDiagram.initialPosition = go.Point.parse(pos);
    }


    function getClassesObject(){
        let umlJ = JSON.parse(myDiagram.model.toJson());
        let nodes = umlJ["nodeDataArray"]

        let classes = {}

        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            if("name" in node){
                classes[node["name"]] = []
                node["properties"].forEach(prop => {
                    if("name" in prop){
                        classes[node["name"]].push(prop["name"])
                    }
                });
            }
        }

        return classes;
    }


    async function getMatrixData(){
        // let data = {"convertedData": {
        //     "classes": {"-1": ["Class B", 0], "-2": ["Class A", 1], "-4": ["Association Class", 2]},
        //         "matrix_classes": {"1": 1.0, "2": 0.8, "3": 0.35999999999999993, "4": 0.8, "5": 1.0, "6": 0.5599999999999999, "7": 0.35999999999999993, "8": 0.5599999999999999, "9": 1.0},
        //         "shape": 3
        // }}
        // return data;
        try {
            let response = await axios.get(serverAddress+`/editors/matrix?ID=${editorID}`);
            if (response && response.data && response.data){
                return response.data;
            }
            else {
                toast.error("Matrix isn't available at the moment", {position: toast.POSITION.TOP_CENTER})
            }
        }
        catch (e){
            toast.error("Matrix isn't available at the moment", {position: toast.POSITION.TOP_CENTER})
            console.log(e);
            console.trace();
        }

        return null;
    }


    function redirectToMatrixPage(){
        if(!editorID){
            toast.error("Editor wasn't yet saved to the server", {position: toast.POSITION.TOP_CENTER})
            return
        }

        getMatrixData().then((convertedData) => {
            convertedData['classes'] = JSON.parse(convertedData['classes'])
            convertedData['matrix_classes'] = JSON.parse(convertedData['matrix_classes'])
            let matrixData = {'type': 'UML', 'convertedData': convertedData}
            localStorage.setItem("matrixData", JSON.stringify(matrixData))
            //window.open("/MatrixEditor", "_blank")
            //navigate("/MatrixEditor")
            setIsOpen(true)
        })

    }


    return (
        <div id="wrapper">
            <script src="../../../uml_editor_resources/release/go.js"></script>
            <script src="../../../uml_editor_resources/extensions/Figures.js"></script>
            <script src="../../Utils/TextEditorSelectBox.js"></script>
            <div id="editorDiv">
                <ReactPalette
                    initPalette={initPalette}
                    divClassName="paletteComponent"
                />
                <ReactDiagram
                    initDiagram={initDiagram.bind(this)}
                    divClassName="diagram-component"
                />

            </div>

            <div id="sample">
                <div>
                    <div>
                        <Button class="umlButtons" id="SaveButton" variant={"info"} onClick={save}>Save</Button>
                        <Button class="umlButtons" id="LoadButton" variant={"danger"} onClick={load}>Cancel</Button>
                        <Button class="umlButtons" disabled={!editorID} id="MatrixButton" variant={"success"} onClick={redirectToMatrixPage}>Show Matrix</Button>
                        <Button id="helpButton" onClick={() => setModalShow(true)} variant='warning'><FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon></Button>
                        {/* <button id="SaveButton" onClick={() => save()}>Save</button>
                            <button onClick={() => load()}>Load</button> */}
                    </div>
                    <textarea value={JSON.stringify(umlJson)} id="mySavedModel" style={{width: "500px", height: "300px"}}></textarea>
                </div>
                <ToastContainer />
            </div>

            <div>
                <ModalComponnent
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    text= {modalBody}
                    header = {modalHeader}
                />
            </div>
            {saving && <SavingSpinner/>}
            <Modal
                show={modalIsOpen}
                onHide={()=>{setIsOpen(false)}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        UML Matrix
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditorMatrix></EditorMatrix>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{setIsOpen(false)}}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


