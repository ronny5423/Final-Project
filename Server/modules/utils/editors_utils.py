from database import *

# Impost modules
from modules.UML_editor import *
from modules.NFR_editor import *
from modules.SQL_editor import *

def saveEditors(data, editorType):
    data['EditorID'] = db.nextEditorID
    newEditor = editorSwitch(data, editorType)
    db.insertOneObject('Editors', newEditor)
    db.updateProjectEditors(newEditor)
    return newEditor.EditorID

def loadEditor(ID):
    query = {'EditorID': int(ID)}
    return db.getOneEditor(query)

def updateEditor(data, editorType):
    to_update = editorSwitch(data, editorType)
    db.updateOneEditor(to_update)

###
# update nfr and sql editors after uml editor has been changed
###
def updateProjectEditors(data):
    updated_editors = {}
    old_uml_editor = loadEditor(data['EditorID'])
    old_uml_json = old_uml_editor.undecipheredJson
    new_uml_json = data["jsonFile"]
    add_set, del_set = get_changes_in_uml(old_uml_json, new_uml_json)
    if len(add_set) == len(del_set) == 0:
        return None
    editors_arr = db.get_editors_project(old_uml_editor.ProjectID)
    for editor in editors_arr[0]['editors']:
        if editor["type"] == 'SQL':
            updateSQLjson(editor, del_set)
            updated_editors["SQL"] = editor
        elif editor["type"] == 'NFR':
            updateNFReditor(editor, del_set, add_set)
            updated_editors["NFR"] = editor
    return updated_editors

def updateProjectEditors_in_DB(updated_editors):
    if "SQL" in updated_editors:
        editor = updated_editors["SQL"]
        data = {'jsonFile': editor["undecipheredJson"], "projectID": editor["ProjectID"], "EditorID": editor["EditorID"]}
        updateEditor(data, "SQL")

    if "NFR" in updated_editors:
        editor = updated_editors["NFR"]
        data = {'jsonFile': editor["undecipheredJson"], "projectID": editor["ProjectID"], "EditorID": editor["EditorID"]}
        updateEditor(data, "NFR")

def getProjectsWeights():
    return db.getNFRWeights()
    
    



# Helper Functions

def editorSwitch(data, editorType):
    if editorType == 'UML':
        return UMLEditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
    elif editorType == 'NFR':
        nfr = NFREditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
        data = NFR_parser_editors(nfr)
        nfr.parseJson(data[0].undecipheredJson, data[1])
        return nfr
    elif editorType == 'SQL':
        sql = SQLEditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
        sql.parseJson(SQL_parser_editors(sql).undecipheredJson)
        return sql

def SQL_parser_editors(sql):
    proj = db.getOneProject({'ProjectID': sql.ProjectID})
    return loadEditor(proj.UMLEditorID)

def NFR_parser_editors(nfr):
    proj = db.getOneProject({'ProjectID': nfr.ProjectID})
    ahp = db.getAHP_NFRWeights()
    return (loadEditor(proj.UMLEditorID), ahp)


def get_changes_in_uml(old_uml, new_uml):
    old_classes = old_uml["nodeDataArray"]
    new_classes = new_uml["nodeDataArray"]
    new_set = set()
    del_set = set()
    for n_cls in new_classes:
        if 'name' in n_cls:
            new_set.add(n_cls["name"])
    
    for o_cls in old_classes:
        if 'name' in o_cls:
            if o_cls["name"] in new_set:
                new_set.remove(o_cls["name"])
            else:
                del_set.add(o_cls["name"])
    
    return new_set, del_set


def updateSQLjson(sql_editor, del_set):
    classes_queries = json.loads(sql_editor["convertedData"]["classes_queries"])
    sql_json = sql_editor["undecipheredJson"]
    new_sql_json = {}
    for cls in del_set:
        if cls in classes_queries:
            for q_idx in classes_queries[cls]:
                if q_idx in sql_json:
                    sql_json[q_idx]["selectable"] = False  # if we dont want to delete
                    # del sql_json[q_idx]
    
# if we delete the query ----------
#     new_idx = 0
#     for idx, query in sql_json.items():
#         new_sql_json[str(new_idx)] = query
#         new_idx += 1
#     sql_editor["undecipheredJson"] = new_sql_json
#================================


def updateNFReditor(nfr_editor, del_set, add_set):
    nfr_json = nfr_editor["undecipheredJson"]
    for cls in del_set:
        if cls in nfr_json:
            del nfr_json[cls]
    weights = db.getNFRWeights()
    for cls in add_set:
        new_class = {}
        for w_name, w_val in weights.items():
            new_class[w_name] = w_val["defaultValue"]
        nfr_json[cls] = new_class
    nfr_editor["undecipheredJson"] = nfr_json



