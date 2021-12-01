
function checkAllLinksAreConnected(umlObj){
    let linksDataArray = umlObj["linkDataArray"];
    for(let i = 0; i < linksDataArray.length; i++){
        let link = linksDataArray[i];
        if(link["to"] === undefined || link["from"] === undefined){
            console.log("checkAllLinksAreConnected");
            return "Not all links are connected";
        }
    }

    return "";
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
                return "";
            
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
                return "LinkClassAssociation isn't connected to an Association class or Association link";
            }
        }
    }

    return "";
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
                return "";
            
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
                                return "Association class can't associate with itself";
                            }
                        }
                    }
                }
            }
        }
    }

    return "";
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
        return "";
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

    return Object.keys(ascClassDict).length === 0 ? "" : "Association class must be connected to Association class link";
}

function checkAllClassesWithUniqueName(umlObj){
    let names = new Set();
    let nodesDataArray = umlObj["nodeDataArray"];
    for(let i = 0; i < nodesDataArray.length; i++){
        let node = nodesDataArray[i];
        if("name" in node){
            if(node["name"].length === 0)
                return "Class must have a name";
            if (names.has(node["name"]))
                return "Class name must be unique";
            names.add(node["name"]);
        }
    }
    return "";
}

function checkAtLeastOneClassExist(umlObj){
    let nodesDataArray = umlObj["nodeDataArray"];
    for(let i = 0; i < nodesDataArray.length; i++){
        let node = nodesDataArray[i];
        if("type" in node){
            return ""
        }
    }
    return "At least one class must exist";
}

function validateUml(umlObj){
    let problems = [];
    let linkClassAssociate = checkLinkClassAssociateConnectToLinkAssociateAndClassAssociate(umlObj);
    if(linkClassAssociate.length > 0)
        problems.push(linkClassAssociate);
    let allLinksCon = checkAllLinksAreConnected(umlObj);
    if(allLinksCon.length > 0)
        problems.push(allLinksCon);
    let ascClassNotAscWithSelf = checkAscClassNotAscWithSelf(umlObj);
    if(ascClassNotAscWithSelf.length > 0)
        problems.push(ascClassNotAscWithSelf);
    let ascClassConnectToAscLink = checkAscClassConnectToAscLink(umlObj);
    if(ascClassConnectToAscLink.length > 0)
        problems.push(ascClassConnectToAscLink);
    let uniqueNames = checkAllClassesWithUniqueName(umlObj);
    if(uniqueNames.length > 0)
        problems.push(uniqueNames);
    let atLeastOneClass = checkAtLeastOneClassExist(umlObj);
    if(atLeastOneClass.length > 0)
        problems.push(atLeastOneClass);
    return problems;
}

export default validateUml;