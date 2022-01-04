import {set} from "react-hook-form";

const QueryTypes = {
  "return": 1,
  "update": 2,
  "insert": 3,
  "delete": 4,
  "connect": 5
};


//---- saved word in sql -------//
let savedWords = new Set();
savedWords.add("return");
savedWords.add("update");
savedWords.add("insert");
savedWords.add("delete");
savedWords.add("connect");
savedWords.add("all");
savedWords.add("from");
savedWords.add("where");
savedWords.add("set");
savedWords.add("as");
savedWords.add("rel");
savedWords.add("path");
savedWords.add("math");
savedWords.add("max");
savedWords.add("min");
savedWords.add("count");
savedWords.add("between");
savedWords.add("type");
savedWords.add("and");
savedWords.add("or");
//----------------------------//


let savedOperation = new Set();
savedOperation.add("path");
savedOperation.add("math");
savedOperation.add("max");
savedOperation.add("min");
savedOperation.add("count");
savedOperation.add("type");


//---- Classes and properties ---//
let classes = {};
let properties = new Set();
//-------------------------------//


// get the classes from the uml and their properties
//e.g. classDict = [{"type":"Class","name":"Person","properties":[{"name":"Name:","type":"String"}],"methods":[],"key":-1,"loc":"-210 -180"},
// {"type":"Class","name":"User","properties":[{"name":"UserName:","type":"String"},{"name":"Password:","type":"String","visibility":"-"}],"methods":[],"key":-2,"loc":"170 -180"}]
// return {"Person": ["Name"], "User": ["UserName", "Password"]}
export function addUmlClasses(classDict){
    classes = classDict;
    properties = new Set();
    for (const [key, value] of Object.entries(classDict)) {
        for (let idx in value){
            properties.add(value[idx]);
        }
    }
}


function addProblem(problemsObj, key, problem){
    if(key in problemsObj){
        problemsObj[key].push(problem);
    }
    else {
        problemsObj[key] = [problem];
    }
}

function checkQueryType(queryWord){
    let type = QueryTypes[queryWord.toLowerCase()];
    if(type === undefined)
        return 0;
    return type;
}


function getAllClassesInFrom(queryArr){
    let fromCls = {};
    let idx = 0;
    while(idx < queryArr.length){
        if(queryArr[idx].toLowerCase() === "from"){
            idx++;
            while(idx < queryArr.length && queryArr[idx].toLowerCase() != "where"){
                let cls = queryArr[idx];
                if(!classes.hasOwnProperty(cls)){
                    //TODO support a class name combine from a few words
                    let tmpIdx = idx+1;
                    let exist = false;
                    let clsTmp = cls;
                    for (let i = 0; tmpIdx < queryArr.length && i < 3; i++, tmpIdx++){
                        clsTmp += " " + queryArr[tmpIdx];
                        if(classes.hasOwnProperty(clsTmp)){
                            cls = clsTmp;
                            exist = true;
                            break;
                        }
                    }
                    if(!exist)
                        throw cls + " is not a valid class name";
                    else
                        idx = tmpIdx;
                }
                if(idx+1 < queryArr.length && queryArr[idx+1].toLowerCase() === "as"){
                    if (idx+2 < queryArr.length){
                        if (fromCls.hasOwnProperty(queryArr[idx+2])){
                            throw "As "+ queryArr[idx+2] +" class name already been used twice";
                        }
                        fromCls[queryArr[idx+2]] = cls;
                        idx += 2;
                    }
                    else {
                        throw "Expected a name after " +  queryArr[idx+1];
                    }
                    idx++;
                }
                else {
                    fromCls[cls] = cls;
                    idx++;
                }
            }
        }
        idx++;
    }
    return fromCls;
}

function checkAttributeExist(attribute){
    return properties.has(attribute) || attribute.toLowerCase() === "all";
}

function parseOperation(queryArr, idx, classAs){
    let operationArr = queryArr[idx].split("(");
    if(operationArr[operationArr.length -1] === ""){
        operationArr.splice(operationArr.length -1, 1);
    }
    if (operationArr.length > 2)
        throw queryArr[idx] + " Unsupported operation";
    let operation = operationArr[0].toLowerCase();
    if(!savedOperation.has(operation)){
        throw operation + " operation is not supported";
    }


    let firstVar = undefined;
    let secondVar = undefined;

    if(operationArr[1].includes(")")){
        firstVar = operationArr[1].slice(0, -1);
        if(operation === "path" || operation === "math"){
            throw operation + " operation require 2 arguments";
        }
        else if(firstVar.length === 0){
            throw operation + " operation required 1 argument";
        }
    }
    else{
        idx++;
        firstVar = operationArr[1];
        secondVar = queryArr[idx].slice(0, -1);
        if(!(operation === "path" || operation === "math")){
            throw operation + " required only 1 argument";
        }
    }

    if(firstVar.includes(".")){
        parseClassAttributeWord(firstVar, classAs);
    }
    else {
        if(operation === "path"){
            if(!classAs.hasOwnProperty(firstVar)){
                throw firstVar + " is unrecognised";
            }
        }
        else if(!checkAttributeExist(firstVar)){
            throw firstVar + " is unrecognised";
        }
    }
    if(secondVar != undefined) {
        if (secondVar.includes(".")) {
            parseClassAttributeWord(secondVar, classAs);
        } else {
            if(operation === "path"){
                if(!classAs.hasOwnProperty(secondVar)){
                    throw secondVar + " is unrecognised";
                }
            }
            else if(!checkAttributeExist(secondVar)){
                throw secondVar + " is unrecognised";
            }
        }
    }

    return idx;
}

function parseClassAttributeWord(word, classAs){
    let wordArr = word.split("."); //class.attribute
    if(wordArr[wordArr.length -1] === ""){
        wordArr.splice(wordArr.length -1, 1);
    }
    if(wordArr.length > 2)
        throw word + " is an Invalid Return object";

    let wClass = wordArr[0];
    let wAttribute = wordArr[1];
    if(!classAs.hasOwnProperty(wClass)){
        throw wClass + " class doesn't appear in FROM sector";
    }

    let realClass = classAs[wClass];
    if(!(classes[realClass].indexOf(wAttribute) != -1 || wAttribute.toLowerCase() === "all")){
        throw wAttribute + " is not an attribute to " + realClass + " class";
    }
}

function parseReturnQuery(queryArr, idx, classAs){
    while (idx < queryArr.length && queryArr[idx].toLowerCase() != "from"){
        let word = queryArr[idx];
        if(word.includes(".") && !word.includes("(")){
            parseClassAttributeWord(word, classAs);
        }
        else if(word.includes("(")){
            idx = parseOperation(queryArr, idx, classAs);
        }
        else {
            if(!checkAttributeExist(word)){
                throw word + " is unrecognised";
            }
        }
        idx++;
    }
    if (idx >= queryArr.length){
        throw "Missing FROM token";
    }
}


function parseWhereQuery(queryArr, idx, classAs) {
    while (idx < queryArr.length && queryArr[idx].toLowerCase() != "set"){
        let expression = queryArr[idx];
        if(expression.toLowerCase() === "and" || expression.toLowerCase() === "or") {
            idx++;
            continue;
        }
        if(expression.toLowerCase() === "between"){
            while (idx < queryArr.length && queryArr[idx].toLowerCase() != "and" && queryArr[idx].toLowerCase() != "or"){
                idx++;
            }
            continue;
        }
        let expParts = expression.split("=");
        let firstPart = expParts[0];
        let secondPart = expParts[1];
        if(firstPart.includes(".") && !firstPart.includes("(")){
            parseClassAttributeWord(firstPart, classAs);
        }
        else if(firstPart.includes("(")){
            idx = parseOperation(queryArr, idx, classAs);
        }
        else {
            if(!(checkAttributeExist(firstPart) || firstPart.toLowerCase() === "rel")){
                throw firstPart + " is unrecognised";
            }
        }

        if(secondPart.includes(".") && !secondPart.includes("(")){
            parseClassAttributeWord(secondPart, classAs);
        }
        else if(secondPart.includes("(")){
            idx = parseOperation(queryArr, idx, classAs);
        }

        idx++;
    }
}

function parseUpdateQuery(queryArr) {
    let n = queryArr.length;
    let idx = 1;
    let classAs = {};
    while(idx < n && queryArr[idx].toLowerCase() != "set"){
        let cls = "";
        while (idx < n && queryArr[idx].toLowerCase() != "set" && queryArr[idx][queryArr[idx].length-1] != ","){
            let tmpCls = queryArr[idx];
            if (tmpCls === ""){
                idx++;
                continue;
            }
            if (cls === ""){
                cls = tmpCls;
            }
            else
                cls = cls + " " + tmpCls;

            idx++;
        }
        if(idx >= n){
            throw "Missing 'SET' token";
        }
        if (queryArr[idx].toLowerCase() === "set"){
            if(!classes.hasOwnProperty(cls)){
                throw cls + " is not a class";
            }

            classAs[cls] = cls;

            idx--;
        }
        else { // ,
            let tmpCls = queryArr[idx].slice(0, -1);
            if (cls === ""){
                cls = tmpCls;
            }
            else
                cls = cls + " " + tmpCls;

            if(!classes.hasOwnProperty(cls)){
                throw cls + " is not a class";
            }

            classAs[cls] = cls;
        }
        idx++;
    }


    if(idx >= n){
        throw "Missing 'SET' token";
    }

    idx++;

    while(idx < n && queryArr[idx].toLowerCase() != "where"){
        let cls = "";
        while (idx < n && queryArr[idx].toLowerCase() != "where" && queryArr[idx][queryArr[idx].length-1] != ","){
            let tmpCls = queryArr[idx];
            if(tmpCls === ""){
                idx++;
                continue;
            }
            if (cls === ""){
                cls = tmpCls;
            }
            else
                cls = cls + " " + tmpCls;

            idx++;
        }

        if(idx >= n){
            if(!classes.hasOwnProperty(cls)){
                throw cls + " is not a class";
            }

            classAs[cls] = cls;
            continue;
        }

        if (idx < n && queryArr[idx].toLowerCase() === "where"){
            if(!classes.hasOwnProperty(cls)){
                throw cls + " is not a class";
            }

            classAs[cls] = cls;

            idx--;
        }
        else { // ,
            let tmpCls = queryArr[idx].slice(0, -1);
            if (cls === ""){
                cls = tmpCls;
            }
            else
                cls = cls + " " + tmpCls;

            if(!classes.hasOwnProperty(cls)){
                throw cls + " is not a class";
            }

            classAs[cls] = cls;
        }
        idx++;
    }



    if(idx < n && queryArr[idx].toLowerCase() === "where"){
        idx++;
        parseWhereQuery(queryArr, idx, classAs);
    }

}

function parseInsertQuery(queryArr) {
    let classAS = {};
    let idx = 1;
    if(queryArr[idx].toLowerCase() != "into"){
        throw "missing INTO token";
    }

    idx++;
    let cls = undefined;
    while (idx < queryArr.length && queryArr[idx].toLowerCase() != "where"){
        if (cls === undefined){
            cls = queryArr[idx];
        }else {
            cls += " " + queryArr[idx];
        }
        idx++;
    }

    if(!classes.hasOwnProperty(cls)){
        throw cls + " is not a class";
    }
    classAS[cls] = cls;
    if (idx < queryArr.length){
        idx++;
        parseWhereQuery(queryArr, idx, classAS);
    }
}

function parseDeleteQuery(queryArr) {
    let classAS = {};
    let idx = 1;
    let cls = undefined;
    while (idx < queryArr.length && queryArr[idx].toLowerCase() != "where"){
        if (cls === undefined){
            cls = queryArr[idx];
        }else {
            cls += " " + queryArr[idx];
        }
        idx++;
    }

    if(!classes.hasOwnProperty(cls)){
        throw cls + " is not a class";
    }
    classAS[cls] = cls;
    if (idx < queryArr.length){
        idx++;
        parseWhereQuery(queryArr, idx, classAS);
    }
}

function parseConnectQuery(queryArr) {
    let classAS = {};
    let idx = 1;
    while(idx < queryArr.length && queryArr[idx].toLowerCase() !== "where" && queryArr[idx].toLowerCase() !== "set"){
        let cls = queryArr[idx];
        if(!classes.hasOwnProperty(cls)){
            //TODO support a class name combine from a few words
            let tmpIdx = idx+1;
            let exist = false;
            let clsTmp = cls;
            for (let i = 0; tmpIdx < queryArr.length && i < 3; i++, tmpIdx++){
                clsTmp += " " + queryArr[tmpIdx];
                if(classes.hasOwnProperty(clsTmp)){
                    cls = clsTmp;
                    exist = true;
                    break;
                }
            }
            if(!exist)
                throw cls + " is not a valid class name.";
            else
                idx = tmpIdx;
        }
        if(idx+1 < queryArr.length && queryArr[idx+1].toLowerCase() === "as"){
            if (idx+2 < queryArr.length){
                if (classAS.hasOwnProperty(queryArr[idx+2])){
                    throw "As "+ queryArr[idx+2] +" class name already been used twice";
                }
                classAS[queryArr[idx+2]] = cls;
                idx += 2;
            }
            else {
                throw "Expected a name after " +  queryArr[idx+1];
            }
            idx++;
        }
        else {
            classAS[cls] = cls;
            idx++;
        }
    }
    if(idx >= queryArr.length || queryArr[idx].toLowerCase() !== "set"){
        return;
    }
    if(queryArr[idx].toLowerCase() === "where"){
        idx++;
        parseWhereQuery(queryArr, idx, classAS);
    }
}

export function ValidateAllQueries(queries){
    //  console.log(queries);
    //  const obj = Object.fromEntries(queries);
    //  console.log(obj);
    //  const jo = JSON.stringify(obj);
    //  console.log(jo);
    //  const j = JSON.parse(jo);
    // console.log(jo);
    // for (let key in j){
    //     console.log(j[key])
    // }
    // const a = new Map(Object.entries(j))
    // console.log(a);
    //
    let problems = {};

    for (let [key, queryObj] of queries) {
        if(!queryObj["selectable"])
            continue
        let query = queryObj["query"];
        query = query.replace(/\s\s+/g, ' ');
        query = query.replaceAll("( ", "(");
        query = query.replaceAll(" )", ")");
        query = query.replaceAll("= ", "=");
        query = query.replaceAll(" =", "=");
        //query = query.replaceAll("+ ", "+");
        //query = query.replaceAll(" +", "+");
        if(query.length === 0)
            continue;

        let queryArr = query.split(/[\n ,]+/);
        if(queryArr[queryArr.length -1] === ""){
            queryArr.splice(queryArr.length -1, 1);
        }

        if(queryArr.length === 0){
            addProblem(problems, key, "Empty query");
            continue;
        }

        if(queryArr.length === 1){
            addProblem(problems, key, "Invalid query");
            continue;
        }

        let queryType = checkQueryType(queryArr[0]);
        if(queryType === 0){
            addProblem(problems, key, "Invalid query type");
            continue;
        }

        let classAs = {}; //saving renames of classes
        if(queryType === 1){ // Return
            try {
                const includesFrom = queryArr.some(element => {
                    return element.toLowerCase() === 'from';
                });
                if (!includesFrom){
                    addProblem(problems, key, "From is missing");
                    continue;
                }
                classAs = getAllClassesInFrom(queryArr);
                parseReturnQuery(queryArr,1,classAs);
                const whereIdx = queryArr.findIndex(element => {
                    return element.toLowerCase() === "where";
                });
                if(whereIdx > -1){
                    parseWhereQuery(queryArr,whereIdx+1,classAs);
                }

            }catch (e){
                addProblem(problems, key, e);
                console.trace();
                continue;
            }
        }
        else if(queryType === 2){ // Update
            query = query.replaceAll(",", ", ");
            query = query.replaceAll(" ,", ",");
            queryArr = query.split(" ");
            try {
                parseUpdateQuery(queryArr);

            }catch (e) {
                addProblem(problems, key, e);
                console.trace();
                continue;
            }
        }
        else if(queryType === 3){ // Insert
            try {
                parseInsertQuery(queryArr);

            }catch (e) {
                addProblem(problems, key, e);
                console.trace();
                continue;
            }
        }
        else if(queryType === 4){ // Delete
            try {
                parseDeleteQuery(queryArr);

            }catch (e) {
                console.log(e.type)
                addProblem(problems, key, e);
                console.trace();
                continue;
            }
        }
        else if(queryType === 5){ // Connect
            try {
                parseConnectQuery(queryArr);

            }catch (e) {
                console.log(e);
                addProblem(problems, key, e);
                console.trace();
                continue;
            }
        }
    }

    return problems;
}


