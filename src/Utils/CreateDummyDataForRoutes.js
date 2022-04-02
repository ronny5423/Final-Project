export function createDataForDBProfiles(){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    let weights=Object.fromEntries(weightsTemp)

    const person={Integrity:0.65,Consistency:["c",3]}
    person["Query Complexity"]=2
    const user={Integrity:0.9,Consistency:["a",1]}
    user["Query Complexity"]=3
    let profiles={MongoDB:person,Oracle:user}

    return {NFRAttributes: weights, DBProfiles: profiles}
}

export function createDataForNFRAdmin(){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    let weightsObj= Object.fromEntries(weightsTemp)
    let ahp={"Integrity":0.2,"Consistency":0.8}
    return {Attributes:weightsObj,Weights:ahp}
}

let description="The concat method creates a new array consisting of the\n elements in the object on which it is called, followed in order by, for each argument, the elements of that\n argument (if the argument is an array) or the argument itself (if the argument is not an array). It does not recurse into nested array arguments.\n" +
    "\n" +
    "The concat method does not alter this or any of the arrays provided as arguments but instead returns a shallow copy\n that contains copies of the same elements combined from\n the original arrays. Elements of the original arrays are copied into the new array as follows:\n" +
    "\n" +
    "Object references (and not the actual object): concat copies object\n references into the new array. Both the original and new array refer to the same object. That is, if a referenced object is modified, the changes are visible\n to both the new and original arrays. This includes elements of array arguments that are also arrays.\n" +
    "Data types such as strings, numbers and booleans (not String, Number, and Boolean objects): concat copies the values of strings and numbers into the new array."

let project={
    name:"FirstProject",
    ProjectID:1,
    Description:description,
    Owner:"ronny54",
    UMLEditorID:4,
    SQLEditorID:5,
    NFREditorID:11,
    Weights:[1,2,3]
}

let projectsArr=[]
for(let i=0;i<201;i++){
    projectsArr.push(project)
}
export function createDataForDashboard(startIndex,endIndex){
    return [projectsArr.slice(startIndex,endIndex), projectsArr.length]
}

export function deleteProject(){
    projectsArr.splice(projectsArr.length-1,1)
}

export function getWeightsArr(){
    let weightsTemp=new Map();
    weightsTemp.set("Integrity",{
        type:"range",
        values:[0,1],
        defaultValue:0.5
    })
    let labelsAndValues={a:1,b:2,c:3,d:4}
    weightsTemp.set("Consistency",{type:"select box",values:labelsAndValues,defaultValue:["a",1]})
    return Object.fromEntries(weightsTemp)
}

export function getNFREditor(){
    const person={Integrity:0.65,Consistency:["c",3]}
    const user={Integrity:0.9,Consistency:["a",1]}
    return {Person: person, User: user}
}
