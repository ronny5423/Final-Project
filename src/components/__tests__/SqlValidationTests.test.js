

const sql_utils = require('../../Utils/SqlValidationUtils');


describe("test sql validations for return queries",()=> {

    it('test validation on empty queries', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"abc","tpm": 45, "selectable": true, "query": ""});
        map.set(1,{"name":"def","tpm": 15, "selectable": false, "query": ""});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a valid return query', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return User.UserName From User"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a valid return query with an as class in from', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return u1.UserName, u2.all From User as u1, User as u2"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a valid return query with where', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return u1.UserName, u2.all From User as u1, User as u2 where u1.Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a valid return query with path operator', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return path(u1,u2) From User as u1, User as u2 where u1.Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });

    it('test validation on a valid return query with single argument operator', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return count(u2.all) From User as u1, User as u2 where u1.Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });

    it('test validation on a invalid return query with no from', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return all User as u1, User as u2 where u1.Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(1)
        expect(prob[0][0]).toBe("From is missing")
    });

    it('test validation on a invalid return query with unrecognized class', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return all From User, car where Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(1)
        expect(prob[0][0]).toBe("car is not a valid class name")
    });

    it('test validation on a invalid return query with unrecognized attribute', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Return User.age From User where Password=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(1)
        expect(prob[0][0]).toBe("age is not an attribute to User class")
    });

})



describe("test sql validations for update queries",()=> {

    it('test validation on a valid update query', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Update User Set Person A"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a valid update query with where', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Update User Set Person A where Name=?"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(0)
    });


    it('test validation on a invalid update query with no SET token', function () {
        let classesDict= {"Person A": ["Name"], "User": ["UserName", "Password"], "NamedModelElement": ["name"]};
        sql_utils.addUmlClasses(classesDict)
        let map=new Map();
        map.set(0,{"name":"q1","tpm": 45, "selectable": true, "query": "Update User, Person A"});
        let prob = sql_utils.ValidateAllQueries(map)
        expect(Object.keys(prob).length).toBe(1)
        expect(prob[0][0]).toBe("Missing 'SET' token")
    });

})
