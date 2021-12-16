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
        
def getNFRWeights():
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
    ahp = db.getAHPWeights()
    return (loadEditor(proj.UMLEditorID), ahp)