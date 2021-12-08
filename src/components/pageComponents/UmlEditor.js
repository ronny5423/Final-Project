import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import "../cssComponents/umlEditor.css";
import val from "../../Utils/UmlValidationUtill";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {serverAddress} from "../../Constants";


var umlJson={ "class": "GraphLinksModel",
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "linkKeyProperty": "key",
    "linkLabelKeysProperty": "labelKeys",
    "nodeDataArray": [],
    "linkDataArray": []};



// const Pallete = (props) => {

//     function initDiagram() {
//         var $ = go.GraphObject.make;  // for conciseness in defining templates

//         myDiagram =
//         $(go.Diagram, // must name or refer to the DIV HTML element
//             {
//             grid: $(go.Panel, "Grid",
//                 $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
//                 $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
//                 $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
//                 $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
//             ),
//             "draggingTool.dragsLink": true,
//             "draggingTool.isGridSnapEnabled": true,
//             "linkingTool.isUnconnectedLinkValid": true,
//             "linkingTool.portGravity": 20,
//             "relinkingTool.isUnconnectedLinkValid": true,
//             "relinkingTool.portGravity": 20,
//             "relinkingTool.fromHandleArchetype":
//                 $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
//             "relinkingTool.toHandleArchetype":
//                 $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
//             "linkReshapingTool.handleArchetype":
//                 $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
//             "rotatingTool.handleAngle": 270,
//             "rotatingTool.handleDistance": 30,
//             "rotatingTool.snapAngleMultiple": 15,
//             "rotatingTool.snapAngleEpsilon": 15,
//             "undoManager.isEnabled": true,
//             "toolManager.hoverDelay": 1
//             });
//         myDiagram.model.copiesArrayObjects = true;

//         // when the document is modified, add a "*" to the title and enable the "Save" button
//         myDiagram.addDiagramListener("Modified", function(e) {
//         var button = document.getElementById("SaveButton");
//         if (button) button.disabled = !myDiagram.isModified;
//         var idx = document.title.indexOf("*");
//         if (myDiagram.isModified) {
//             if (idx < 0) document.title += "*";
//         } else {
//             if (idx >= 0) document.title = document.title.substr(0, idx);
//         }
//         });

//         // Define a function for creating a "port" that is normally transparent.
//         // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
//         // and where the port is positioned on the node, and the boolean "output" and "input" arguments
//         // control whether the user can draw links from or to the port.
//         function makePort(name, spot, output, input) {
//         // the port is basically just a small transparent circle
//         return $(go.Shape, "Circle",
//             {
//             fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
//             stroke: null,
//             desiredSize: new go.Size(7, 7),
//             alignment: spot,  // align the port on the main Shape
//             alignmentFocus: spot,  // just inside the Shape
//             portId: name,  // declare this object to be a "port"
//             fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
//             fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
//             cursor: "pointer",  // show a different cursor to indicate potential link point
//             fromLinkableDuplicates: true, toLinkableDuplicates: true,
//             fromLinkableSelfNode: true, toLinkableSelfNode: true
//             });
//         }

//         var nodeSelectionAdornmentTemplate =
//         $(go.Adornment, "Auto",
//             $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
//             $(go.Placeholder)
//         );

//         var nodeResizeAdornmentTemplate =
//         $(go.Adornment, "Spot",
//             { locationSpot: go.Spot.Right },
//             $(go.Placeholder),
//             $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

//             $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

//             $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
//         );

//         var nodeRotateAdornmentTemplate =
//         $(go.Adornment,
//             { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
//             $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
//             $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
//         );


//         function showSmallPorts(node, show) {
//         node.ports.each(function(port) {
//             if (port.portId !== "") {  // don't change the default port, which is the big shape
//             port.fill = show ? "rgba(0,0,0,.3)" : null;
//             }
//         });
//         }


//         var linkSelectionAdornmentTemplate =
//         $(go.Adornment, "Link",
//             $(go.Shape,
//             // isPanelMain declares that this Shape shares the Link.geometry
//             { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
//         );


//         function AssociationClassLinkValidation(fromnode, fromport, tonode, toport){
//         //console.log(fromnode);
//         if(!fromnode || !tonode){
//             return true;
//         }
//         if(fromnode.data.type === "Association Class" || tonode.data.type === "Association Class"){
//             return true;
//         }

//         return false;
//         }

//         //myDiagram.toolManager.linkingTool.linkValidation = AssociationClassLinkValidation;

//         //myDiagram.toolManager.relinkingTool.linkValidation = AssociationClassLinkValidation;

//         myDiagram.nodeTemplateMap.add("LinkLabel",
//         $(go.Node,
//         {
//             layerName: "Foreground",  // always have link label nodes in front of Links
//             background: "transparent",
//             width: 12, height: 12,
//             locationSpot: go.Spot.Center,
//             movable: false,  // but becomes movable when it's not a label on a Link
//             deletable: false,  // but becomes deletable when there's no connected link
//             // only deletable when it's unconnected
//             linkConnected: function(node, link, port) {
//             node.deletable = false;
//             },
//             linkDisconnected: function(node, link, port) {
//             node.deletable = (node.linksConnected.count === 0);
//             }
//         },
//         // only movable when it's a label Node of a Link
//         new go.Binding("movable", "labeledLink", function(link) { return link === null; }).ofObject(),
//         new go.Binding("segmentIndex").makeTwoWay(),  // remember where this label belongs on the link
//         new go.Binding("segmentFraction").makeTwoWay(),
//         $(go.Shape, "Circle",
//             { // a junction node appears as just a small black circle
//             position: new go.Point(3, 3),  // center the circle in the Node
//             width: 5, height: 5,
//             stroke: null,
//             fill: null,
//             background: "blue",
//             portId: "",
//             fromLinkable: true, toLinkable: true, cursor: "pointer"
//             })
//         ));


//         myDiagram.linkTemplate =
//         $(go.Link,  // the whole link panel
//             { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
//             { relinkableFrom: true, relinkableTo: true, reshapable: true},
//             {
//             routing: go.Link.AvoidsNodes,
//             curve: go.Link.JumpOver,
//             corner: 5,
//             toShortLength: 4
//             },
//             new go.Binding("points").makeTwoWay(),
//             $(go.Shape,  // the link path shape
//             { isPanelMain: true, strokeWidth: 2 },
//             new go.Binding("strokeDashArray", "dashed")),
//             $(go.Shape, { scale: 1.3, fill: "white" }, // the arrowhead
//             new go.Binding("toArrow", "toArrow")),
//             $(go.TextBlock,
//             { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleFrom").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleTo").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: 0, segmentOffset: new go.Point(NaN, 10),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiFrom").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiTo").makeTwoWay())
//         );

//         //load();  // load an initial diagram from some JSON text

//         // show visibility or access as a single character at the beginning of each property or method
//         function convertVisibility(v) {
//             if(v==="+" || v==="-" || v==="#" || v==="~")
//                 return v;

//             switch (v) {
//                 case "public": return "+";
//                 case "private": return "-";
//                 case "protected": return "#";
//                 case "package": return "~";
//                 default: return "+";
//             }
//         }

//         function createJunction(e, link) { // Creates Junction node when user double clicks on a link
//         if(link && link.ob.labelKeys.length === 1)
//             return;
//         e.handled = true;
//         e.diagram.startTransaction("Link Label");

//         var label = { category: "LinkLabel" }; // Create data for label node -- the junction Node
//         e.diagram.model.addNodeData(label);

//         var labelnode = e.diagram.findNodeForData(label); // Finds the created node from the NodeData
//         attachJunction(link, labelnode, e.documentPoint);

//         e.diagram.commitTransaction("Link Label");
//         }

//     function attachJunction(link, labelnode, pos) {
//         labelnode.labeledLink = link;		// set the labeledLink for the junction node

//         var index = link.findClosestSegment(pos); // Finds the index of the segment that is closest to POS
//         labelnode.segmentIndex = index;

//         var startPoint = link.points.elt(index); // Grabs the point at the start and end of the segment
//         var endPoint = link.points.elt(index + 1);
//         // Finds diff between pos and startPoint divided by diff of endPoint and startPoint
//         if (Math.abs(startPoint.x - endPoint.x) < 0.1) { // Segment is horizontal
//         labelnode.segmentFraction = (pos.y - startPoint.y) / (endPoint.y - startPoint.y);
//         } else { // Segment is vertical
//         labelnode.segmentFraction = (pos.x - startPoint.x) / (endPoint.x - startPoint.x);
//         }
//     }

//     myDiagram.linkTemplateMap.add("Linkble",
//     $("Link",
//             { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
//             { relinkableFrom: true, relinkableTo: true, reshapable: true},
//             {
//             routing: go.Link.AvoidsNodes,
//             curve: go.Link.JumpOver,
//             corner: 5,
//             toShortLength: 4,
//             doubleClick: createJunction
//             },
//             new go.Binding("points").makeTwoWay(),
//             $(go.Shape,  // the link path shape
//             { isPanelMain: true, strokeWidth: 2 },
//             new go.Binding("strokeDashArray", "dashed")),
//             $(go.Shape, { scale: 1.3, fill: "white" }, // the arrowhead
//             new go.Binding("toArrow", "toArrow")),
//             $(go.TextBlock,
//             { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleFrom").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "RoleTo").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: 0, segmentOffset: new go.Point(NaN, 10),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiFrom").makeTwoWay()),
//             $(go.TextBlock,
//             { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
//                 segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiTo").makeTwoWay())
//     ));


//         // the item template for properties
//         var propertyTemplate =
//         $(go.Panel, "Horizontal",
//             // property visibility/access
//             $(go.TextBlock, "+",
//             { isMultiline: false, editable: true, width: 12 },
//             new go.Binding("text", "visibility", function (v) { return convertVisibility(v) }).makeTwoWay()),
//             // property name, underlined if scope=="class" to indicate static property
//             $(go.TextBlock, "Attribute Name:",
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "name", function (s) { return s.slice(-1)===':' ? s : s+":" }).makeTwoWay(),
//             new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
//             // property type, if known
//             $(go.TextBlock, " "),
//             $(go.TextBlock, "Type",
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "type").makeTwoWay()),
//             // property default value, if any
//             $(go.TextBlock,
//             { isMultiline: false, editable: false },
//             new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; })),
//             $("Button",
//             { margin: 2,
//             click: removeProperty,
//             },
//             $(go.Shape, "LineH", { desiredSize: new go.Size(10, 10) }))
//         );

//         var methodTemplate =
//         $(go.Panel, "Horizontal",
//         // method visibility/access
//         $(go.TextBlock,
//             { isMultiline: false, editable: false, width: 12 },
//             new go.Binding("text", "visibility", convertVisibility)),
//         // method name, underlined if scope=="class" to indicate static method
//         $(go.TextBlock,
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "name").makeTwoWay(),
//             new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
//         // method parameters
//         $(go.TextBlock, "()",
//             // this does not permit adding/editing/removing of parameters via inplace edits
//             new go.Binding("text", "parameters", function (parr) {
//             var s = "(";
//             for (var i = 0; i < parr.length; i++) {
//                 var param = parr[i];
//                 if (i > 0) s += ", ";
//                 s += param.name + ": " + param.type;
//             }
//             return s + ")";
//             })),
//         // method return type, if any
//         $(go.TextBlock, "",
//             new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
//         $(go.TextBlock,
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "type").makeTwoWay())
//         );


//         var UndesiredEventAdornment =
//         $(go.Adornment, "Spot",
//             $(go.Panel, "Auto",
//             $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
//             $(go.Placeholder)),
//             // the button to create a "next" node, at the top-right corner
//             $("Button",
//             {
//                 alignment: go.Spot.BottomRight,
//                 click: addProperty
//             },  // this function is defined below
//             new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
//             $(go.Shape, "PlusLine", { desiredSize: new go.Size(10, 10) })
//             )
//         );

//         function removeProperty(e, obj){
//             var pan = obj.panel;
//             if (pan === null) return;
//             var ob = pan.ob;
//             var data = obj.part.data.properties;
//             //var arr = adorn.adornedPart.data.properties;  __gohashid
//             myDiagram.startTransaction("remove property");
//             //myDiagram.model.addArrayItem(arr, {});
//             for(let i=0; i < data.length; i++){
//             if(data[i]["__gohashid"] === ob.__gohashid){
//                 myDiagram.model.removeArrayItem(data, i);
//                 break;
//             }
//             }
//             myDiagram.commitTransaction("remove property");
//         }

//         function addProperty(e, obj) {
//             var adorn = obj.part;
//             if (adorn === null) return;
//             e.handled = true;
//             var arr = adorn.adornedPart.data.properties;
//             myDiagram.startTransaction("add property");
//             myDiagram.model.addArrayItem(arr, {});
//             myDiagram.commitTransaction("add property");
//         }

//         function convertFill(v) {
//             switch (v) {
//                 case "Association Class": return "orange";
//                 default: return "lightyellow";
//             }
//         }

//         myDiagram.nodeTemplate =
//         $(go.Node, "Auto",
//         {
//             locationSpot: go.Spot.Center,
//             fromSpot: go.Spot.AllSides,
//             toSpot: go.Spot.AllSides
//         },
//         new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
//         { selectionAdornmentTemplate: UndesiredEventAdornment },
//         $(go.Shape, new go.Binding("fill", "type", convertFill)),
//         $(go.Panel, "Table",
//             { defaultRowSeparatorStroke: "black" },
//             // header
//             $(go.TextBlock,
//             {
//                 row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
//                 font: "bold 12pt sans-serif",
//                 isMultiline: false, editable: true
//             },
//             new go.Binding("text", "name").makeTwoWay()),
//             // properties
//             $(go.TextBlock, "Properties",
//             { row: 1, font: "italic 10pt sans-serif" },
//             new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
//             $(go.Panel, "Vertical", { name: "PROPERTIES" },
//             {
//                 row: 1, margin: 3, stretch: go.GraphObject.Fill,
//                 defaultAlignment: go.Spot.Left,
//                 itemTemplate: propertyTemplate,

//             },
//             new go.Binding("itemArray", "properties"),
//             ),
//             $("PanelExpanderButton", "PROPERTIES",
//             { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
//             new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
//             // methods
//             $(go.TextBlock, "Methods",
//             { row: 2, font: "italic 10pt sans-serif" },
//             new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
//             $(go.Panel, "Vertical", { name: "METHODS" },
//             new go.Binding("itemArray", "methods"),
//             {
//                 row: 2, margin: 3, stretch: go.GraphObject.Fill,
//                 defaultAlignment: go.Spot.Left, background: "lightyellow",
//                 itemTemplate: methodTemplate
//             }
//             ),
//             $("PanelExpanderButton", "METHODS",
//             { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
//             new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
//         ),
//             // four small named ports, one on each side:
//             makePort("T", go.Spot.Top, true, true),
//             makePort("L", go.Spot.Left, true, true),
//             makePort("R", go.Spot.Right, true, true),
//             makePort("B", go.Spot.Bottom, true, true),
//         );


//         myDiagram.model = $(go.GraphLinksModel,
//         {
//             linkKeyProperty: "key",
//             linkLabelKeysProperty: "labelKeys",
//             copiesArrays: true,
//             copiesArrayObjects: true
//         });

//         //loadUml();
//         //console.log(myDiagram.model);

//         return myDiagram;
//     }

//     function initPalette() {
//         const $ = go.GraphObject.make;
//         var myPalette = $(go.Palette, {
//             maxSelectionCount: 1,
//             //nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
//             linkTemplate: // simplify the link template, just in this Palette
//               $(go.Link,
//                 { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
//                   // to line up the Link in the same manner we have to pretend the Link has the same location spot
//                   locationSpot: go.Spot.Center,
//                   selectionAdornmentTemplate:
//                     $(go.Adornment, "Link",
//                       { locationSpot: go.Spot.Center },
//                       $(go.Shape,
//                         { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 2 },
//                         new go.Binding("strokeDashArray", "dashed")),
//                       $(go.Shape, { scale: 1.3, fill: "white" },  // the arrowhead
//                         new go.Binding("toArrow", "toArrow"))
//                     )
//                 },
//                 {
//                   routing: go.Link.AvoidsNodes,
//                   curve: go.Link.JumpOver,
//                   corner: 5,
//                   toShortLength: 4
//                 },
//                 new go.Binding("points"),
//                 $(go.Shape,  // the link path shape
//                   { isPanelMain: true, strokeWidth: 2 },
//                   new go.Binding("strokeDashArray", "dashed")),
//                 $(go.Shape, { scale: 1.3, fill: "white" },  // the arrowhead
//                   new go.Binding("toArrow", "toArrow")),
//                 {
//                   toolTip:  // define a tooltip for each node that displays the color as text
//                     $("ToolTip",
//                       $(go.TextBlock, { margin: 4 },
//                         new go.Binding("text", "name"))
//                     )  // end of Adornment
//                 }
//                 ),
//             model: new go.GraphLinksModel([  // specify the contents of the Palette
//               {
//                 type: "Class",
//                 name: "Class",
//                 properties: [
//                   // { name: "classes", type: "List<Course>", visibility: "public" }
//                 ],
//                 methods: []
//               },{

//                 type: "Association Class",
//                 name: "Association Class",
//                 properties: [
//                   // { name: "cla", type: "List<Course>", visibility: "public" }
//                 ],
//                 methods: []
//               }
//             ], [
//                 // the Palette also has a disconnected Link, which the user can drag-and-drop
//                 {category: "Linkble", name: "association", RoleFrom: "from", RoleTo: "to", MultiFrom: "0", MultiTo: "1", toArrow: "", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) },
//                 {name: "generalization", toArrow: "Triangle", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) },
//                 {name: "associationClassLink", dashed: [5,5], toArrow: "", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) }
//               ])
//           }
//         );


//         function convertVisibility(v) {
//             if(v==="+" || v==="-" || v==="#" || v==="~")
//                 return v;

//             switch (v) {
//                 case "public": return "+";
//                 case "private": return "-";
//                 case "protected": return "#";
//                 case "package": return "~";
//                 default: return "+";
//             }
//         }

//         let myDiagram = undefined;

//         function removeProperty(e, obj){
//             var pan = obj.panel;
//             if (pan === null) return;
//             var ob = pan.ob;
//             var data = obj.part.data.properties;
//             //var arr = adorn.adornedPart.data.properties;  __gohashid
//             myDiagram.startTransaction("remove property");
//             //myDiagram.model.addArrayItem(arr, {});
//             for(let i=0; i < data.length; i++){
//             if(data[i]["__gohashid"] === ob.__gohashid){
//                 myDiagram.model.removeArrayItem(data, i);
//                 break;
//             }
//             }
//             myDiagram.commitTransaction("remove property");
//         }

//         function makePort(name, spot, output, input) {
//             // the port is basically just a small transparent circle
//             return $(go.Shape, "Circle",
//                 {
//                 fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
//                 stroke: null,
//                 desiredSize: new go.Size(7, 7),
//                 alignment: spot,  // align the port on the main Shape
//                 alignmentFocus: spot,  // just inside the Shape
//                 portId: name,  // declare this object to be a "port"
//                 fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
//                 fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
//                 cursor: "pointer",  // show a different cursor to indicate potential link point
//                 fromLinkableDuplicates: true, toLinkableDuplicates: true,
//                 fromLinkableSelfNode: true, toLinkableSelfNode: true
//                 });
//             }

//         // the item template for properties
//         var propertyTemplate =
//         $(go.Panel, "Horizontal",
//             // property visibility/access
//             $(go.TextBlock, "+",
//             { isMultiline: false, editable: true, width: 12 },
//             new go.Binding("text", "visibility", convertVisibility).makeTwoWay()),
//             // property name, underlined if scope=="class" to indicate static property
//             $(go.TextBlock, "Attribute Name:",
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "name", function (s) { return s.slice(-1)===':' ? s : s+":" }).makeTwoWay(),
//             //makeTwoWaySubBinding("text", "name"),
//             new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
//             // property type, if known
//             $(go.TextBlock,
//             new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
//             $(go.TextBlock, "Type",
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "type").makeTwoWay()),
//             // property default value, if any
//             $(go.TextBlock,
//             { isMultiline: false, editable: false },
//             new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; })),
//             $("Button",
//             { margin: 2,
//             click: removeProperty,
//             },
//             $(go.Shape, "LineH", { desiredSize: new go.Size(10, 10) }))
//         );

//         var methodTemplate =
//         $(go.Panel, "Horizontal",
//         // method visibility/access
//         $(go.TextBlock,
//             { isMultiline: false, editable: false, width: 12 },
//             new go.Binding("text", "visibility", convertVisibility)),
//         // method name, underlined if scope=="class" to indicate static method
//         $(go.TextBlock,
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "name").makeTwoWay(),
//             new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
//         // method parameters
//         $(go.TextBlock, "()",
//             // this does not permit adding/editing/removing of parameters via inplace edits
//             new go.Binding("text", "parameters", function (parr) {
//             var s = "(";
//             for (var i = 0; i < parr.length; i++) {
//                 var param = parr[i];
//                 if (i > 0) s += ", ";
//                 s += param.name + ": " + param.type;
//             }
//             return s + ")";
//             })),
//         // method return type, if any
//         $(go.TextBlock, "",
//             new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
//         $(go.TextBlock,
//             { isMultiline: false, editable: true },
//             new go.Binding("text", "type").makeTwoWay())
//         );

//         function convertFill(v) {
//             switch (v) {
//                 case "Association Class": return "orange";
//                 default: return "lightyellow";
//             }
//         }


//         myPalette.nodeTemplate =
//         $(go.Node, "Auto",
//         {
//             locationSpot: go.Spot.Center,
//             fromSpot: go.Spot.AllSides,
//             toSpot: go.Spot.AllSides
//         },
//         new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
//         $(go.Shape, new go.Binding("fill", "type", convertFill)),
//         $(go.Panel, "Table",
//             { defaultRowSeparatorStroke: "black" },
//             // header
//             $(go.TextBlock,
//             {
//                 row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
//                 font: "bold 12pt sans-serif",
//                 isMultiline: false, editable: true
//             },
//             new go.Binding("text", "name").makeTwoWay()),
//             // properties
//             $(go.TextBlock, "Properties",
//             { row: 1, font: "italic 10pt sans-serif" },
//             new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
//             $(go.Panel, "Vertical", { name: "PROPERTIES" },
//             {
//                 row: 1, margin: 3, stretch: go.GraphObject.Fill,
//                 defaultAlignment: go.Spot.Left,
//                 itemTemplate: propertyTemplate,

//             },
//             new go.Binding("itemArray", "properties"),
//             ),
//             $("PanelExpanderButton", "PROPERTIES",
//             { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
//             new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
//             // methods
//             $(go.TextBlock, "Methods",
//             { row: 2, font: "italic 10pt sans-serif" },
//             new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
//             $(go.Panel, "Vertical", { name: "METHODS" },
//             new go.Binding("itemArray", "methods"),
//             {
//                 row: 2, margin: 3, stretch: go.GraphObject.Fill,
//                 defaultAlignment: go.Spot.Left, background: "lightyellow",
//                 itemTemplate: methodTemplate
//             }
//             ),
//             $("PanelExpanderButton", "METHODS",
//             { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
//             new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
//         ),
//             // four small named ports, one on each side:
//             makePort("T", go.Spot.Top, true, true),
//             makePort("L", go.Spot.Left, true, true),
//             makePort("R", go.Spot.Right, true, true),
//             makePort("B", go.Spot.Bottom, true, true),
//         );


//         return myPalette;
//     }

//         function save() {
//             let umlJ = JSON.parse(myDiagram.model.toJson());

//             let problems = val(umlJ);
//             if (problems.length > 0) {
//                 for (let problemIdx in problems) {
//                     toast.error("error: " + problems[problemIdx], {position: toast.POSITION.TOP_CENTER})
//                 }
//                 return;
//             }
//             saveDiagramProperties();  // do this first, before writing to JSON
//             document.getElementById("mySavedModel").value = myDiagram.model.toJson();
//             umlJson = myDiagram.model.toJson();
//             myDiagram.isModified = false;
//             if (props !== undefined && typeof props.changeUmlStatus !== "undefined")
//                 props.changeUmlStatus();
//         }

//         function load() {
//             myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
//             loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
//         }

//         function loadUml() {
//             myDiagram.model = go.Model.fromJson(umlJson);
//             loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
//         }

//         function saveDiagramProperties() {
//             myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
//         }
//         function loadDiagramProperties(e) {
//             // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
//             var pos = myDiagram.model.modelData.position;
//             if (pos) myDiagram.initialPosition = go.Point.parse(pos);
//         }

//         function hi(){
//             alert("hi")
//         }


//     return (
//         <div id="wrapper">
//           <script src="../../../uml_editor_resources/release/go.js"></script>
//           <script src="../../../uml_editor_resources/extensions/Figures.js"></script>
//           <div id="editorDiv">
//           <ReactPalette
//             initPalette={initPalette}
//             divClassName="paletteComponent"
//           />
//           <ReactDiagram
//             initDiagram={initDiagram.bind(this)}
//             divClassName="diagram-component"
//           />

//         </div>

//           <div id="sample">
//             {/* <div style={{width: "100%", display: "flex"}}>
//                 <div id="myPaletteDiv" style={{width: "200px", marginRight: "2px", backgroundColor: "whitesmoke", border: "solid 1px black"}}></div>
//                 <div id="myDiagramDiv" style={{flexGrow: "1", height: "620px", border: "solid 1px black"}}></div>
//             </div> */}
//             <div>
//                 <div>
//                 <button id="SaveButton" onClick={() => save()}>Save</button>
//                 <button onClick={() => load()}>Load</button>
//                 Diagram Model saved in JSON format:
//                 </div>
//                 <textarea value={JSON.stringify(umlJson)} id="mySavedModel" style={{width: "500px", height: "300px"}}>
//                 </textarea>
//             </div>
//             <ToastContainer />
//         </div>

//         </div>
//       );
// };


export default function UmlEditor(props){
    let myDiagram;
    //props.editorID = 0;
    useEffect(()=>{
        async function fetchUmlFromServer() {
            let response = undefined;
            // if (!props.editorID)
            //     return;
            try {
                response = await axios.get(serverAddress+`/editors/loadEditor?ID=${0}`);
                console.log(response);
            }catch (e){
                console.log(e);
                console.trace();
                //loadUml(umlJson); 
            }
            //response = await axios.get(serverAddress+`/getSql`);
            if (response && response.data.undecipheredJson) {
                //myDiagram = response.data.uml;
                loadUml(response.data.undecipheredJson)
            }
        }
        fetchUmlFromServer()
    },[])




    function initDiagram() {
        var $ = go.GraphObject.make;  // for conciseness in defining templates

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
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
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
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiTo").makeTwoWay())
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
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiFrom").makeTwoWay()),
                $(go.TextBlock,
                    { segmentIndex: -1, segmentOffset: new go.Point(NaN, 10),
                        segmentOrientation: go.Link.OrientUpright, editable: true}, new go.Binding("text", "MultiTo").makeTwoWay())
            ));


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


        myDiagram.model = $(go.GraphLinksModel,
            {
                linkKeyProperty: "key",
                linkLabelKeysProperty: "labelKeys",
                copiesArrays: true,
                copiesArrayObjects: true
            });

        //loadUml();
        //console.log(myDiagram.model);

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
                    {category: "Linkble", name: "association", RoleFrom: "from", RoleTo: "to", MultiFrom: "0", MultiTo: "1", toArrow: "", points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(40, 40), new go.Point(60, 40)]) },
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

        let problems = val(umlJ);
        if (problems.length > 0) {
            for (let problemIdx in problems) {
                toast.error("error: " + problems[problemIdx], {position: toast.POSITION.TOP_CENTER})
            }
            return;
        }
        saveDiagramProperties();  // do this first, before writing to JSON
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        umlJson = myDiagram.model.toJson();
        myDiagram.isModified = false;
        if (props !== undefined && typeof props.changeUmlStatus !== "undefined")
            props.changeUmlStatus();
        saveUmlToServer().then(r => console.log("saved"));
    }

    async function saveUmlToServer(){
        let uml = JSON.parse(myDiagram.model.toJson());
        try {
            let response = await axios.post(serverAddress+`/editors/saveUMLEditor`, {'jsonFile': uml, 'projectID': 1});
            console.log(response);
        }catch (e){
            console.log(e);
            console.trace();
        }
    }

    function load() {
        myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
    }

    function loadUml(umlJson) {
        myDiagram.model = go.Model.fromJson(umlJson);
        loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        umlJson = myDiagram.model.toJson();
    }

    function saveDiagramProperties() {
        myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
    }

    function loadDiagramProperties(e) {
        // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
        var pos = myDiagram.model.modelData.position;
        if (pos) myDiagram.initialPosition = go.Point.parse(pos);
    }


    return (
        <div id="wrapper">
            <script src="../../../uml_editor_resources/release/go.js"></script>
            <script src="../../../uml_editor_resources/extensions/Figures.js"></script>
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
                {/* <div style={{width: "100%", display: "flex"}}>
            <div id="myPaletteDiv" style={{width: "200px", marginRight: "2px", backgroundColor: "whitesmoke", border: "solid 1px black"}}></div>
            <div id="myDiagramDiv" style={{flexGrow: "1", height: "620px", border: "solid 1px black"}}></div>
        </div> */}
                <div>
                    <div>
                        <button id="SaveButton" onClick={() => save()}>Save</button>
                        <button onClick={() => load()}>Load</button>
                        Diagram Model saved in JSON format:
                    </div>
                    <textarea value={JSON.stringify(umlJson)} id="mySavedModel" style={{width: "500px", height: "300px"}}>
            </textarea>
                </div>
                <ToastContainer />
            </div>

        </div>
    );
}


