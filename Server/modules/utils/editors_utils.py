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

def loadEditor(ID):
    query = {'EditorID': ID}
    return db.getOneEditor(query)

def updateEditor(data, editorType):
    to_update = editorSwitch(data, editorType)
    db.updateOneEditor(to_update)
        
        
def editorSwitch(data, editorType):
    if editorType == 'UML':
        return UMLEditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
    elif editorType == 'NFR':
        return NFREditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
    elif editorType == 'SQL':
        sql = SQLEditor(undecipheredJson=data.get('jsonFile'), projectID=data.get('projectID'), EditorID=data.get('EditorID'))
        sql.parseJson(SQL_parser_editors(sql).undecipheredJson)
        return sql
    
    



# Helper Functions

def SQL_parser_editors(sql):
    proj = db.getOneProject({'ProjectID': sql.projectID})
    return loadEditor(proj.UMLEditorID)

def NFR_parser_editors(nfr):
    proj = db.getOneProject({'ProjectID': nfr.projectID})
    # Get AHP data from db
    return (loadEditor(proj.UMLEditorID), ) #second object is the AHP data