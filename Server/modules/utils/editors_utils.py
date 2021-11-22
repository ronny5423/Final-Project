from database import db

# Impost modules
from modules.UML_editor import UMLEditor
from modules.NFR_editor import NFREditor
from modules.SQL_editor import SQLEditor

def saveEditors(data, type):
    newEditor = None
    if type == 'UML':
        newEditor = UMLEditor(undecipheredJson=data)
    elif type == 'NFR':
        newEditor = NFREditor(undecipheredJson=data)
    elif type == 'SQL':
        newEditor = SQLEditor(undecipheredJson=data)
    db.insertOneObject('Editors', newEditor)


def loadEditor(ID):
    query = {'EditorID': ID}
    return db.getOneEditor(query)
        