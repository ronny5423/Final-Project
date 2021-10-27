
function checkAllLinksAreConnected(umlObj){
    let linksDataArray = umlObj["linkDataArray"];
    for(let i = 0; i < linksDataArray.length; i++){
        let link = linksDataArray[i];
        if(link["to"] === undefined || link["from"] === undefined){
            console.log("checkAllLinksAreConnected");
            return false;
        }
    }

    return true;
}

function checkLinkClassAssociateConnectToLinkAssociateAndClassAssociate(umlObj){
    let linksDataArray = umlObj["linkDataArray"];
    let nodesDataArray = umlObj["nodeDataArray"];
    for(let i = 0; i < linksDataArray.length; i++){
        let link = linksDataArray[i];
        if(link["name"] === "associationClassLink"){
            let linkCon = false;
            let classCon = false;
            let linkTo = link["to"];
            let linkFrom = link["from"];
            if(linkFrom === undefined || linkTo === undefined)
                return false;
            
            for(let j = 0; j < nodesDataArray.length; j++){
                let nodeKey = nodesDataArray[j]["key"];
                let nodeType = nodesDataArray[j]["type"];
                let nodeCategory = nodesDataArray[j]["category"];
                if((linkTo === nodeKey || linkFrom === nodeKey) && nodeType === "Association Class"){
                    linkCon = true;
                }
                else if((linkTo === nodeKey || linkFrom === nodeKey) && nodeCategory === "LinkLabel"){
                    classCon = true;
                }
            }

            if(!(linkCon && classCon)){
                console.log("checkLinkClassAssociateConnectToLinkAssociateAndClassAssociate");
                return false;
            }
        }
    }

    return true;
}

function checkAscClassNotAscWithSelf(umlObj){
    let linksDataArray = umlObj["linkDataArray"];
    let nodesDataArray = umlObj["nodeDataArray"];
    for(let i = 0; i < linksDataArray.length; i++){
        let link = linksDataArray[i];
        if(link["name"] === "associationClassLink"){

            let linkTo = link["to"];
            let linkFrom = link["from"];
            if(linkFrom === undefined || linkTo === undefined)
                return false;
            
            for(let j = 0; j < nodesDataArray.length; j++){
                let nodeKey = nodesDataArray[j]["key"];
                let nodeCategory = nodesDataArray[j]["category"];
                if(nodeCategory && (nodeKey === linkTo || nodeKey === linkFrom)){
                    for(let k = 0; k < linksDataArray.length; k++){
                        let lable = linksDataArray[k]["labelKeys"];
                        if(lable[0] && lable[0] === nodeKey){
                            let to = linksDataArray[k]["to"];
                            let from = linksDataArray[k]["from"];
                            if(to === linkTo || to === linkFrom || from === linkTo || from === linkFrom){
                                console.log("checkAscClassNotAscWithSelf");
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    return true;
}

function checkAscClassConnectToAscLink(umlObj){
    let ascClassDict = {};
    let linksDataArray = umlObj["linkDataArray"];
    let nodesDataArray = umlObj["nodeDataArray"];
    for(let i = 0; i < nodesDataArray.length; i++){
        let node = nodesDataArray[i];
        if(node["type"] === "Association Class"){
            ascClassDict[node["key"]] = node["name"];
        }
    }
    if(Object.keys(ascClassDict).length === 0){
        return true;
    }

    for(let j = 0; j < linksDataArray.length; j++){
        let link = linksDataArray[j];
        if(link["name"] === "associationClassLink"){
            if(ascClassDict.hasOwnProperty(link["to"])){
                delete ascClassDict[link["to"]];
            }
            else if(ascClassDict.hasOwnProperty(link["from"])){
                delete ascClassDict[link["from"]];
            }
        }
    }

    return Object.keys(ascClassDict).length === 0;
}

function validateUml(umlObj){
    let linkClassAssociate = checkLinkClassAssociateConnectToLinkAssociateAndClassAssociate(umlObj);
    let allLinksCon = checkAllLinksAreConnected(umlObj);
    let ascClassNotAscWithSelf = checkAscClassNotAscWithSelf(umlObj);
    let ascClassConnectToAscLink = checkAscClassConnectToAscLink(umlObj);
    return allLinksCon && linkClassAssociate && ascClassNotAscWithSelf && ascClassConnectToAscLink;
}

export default validateUml;