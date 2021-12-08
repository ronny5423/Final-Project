from database import *

# Import Modules
from modules.Project import *

def saveProject(data):
    jsonData = data.json
    newProject = Project(db.nextProjectID, jsonData)
    db.insertOneObject('Projects', newProject)
    return newProject.ProjectID

def loadProject(data):
    jsonData = data.json
    return db.getOneProject(jsonData).project_preview()

def getProjectMembers(data):
    jsonData = data.json
    return db.getOneProject(jsonData).getMembers

def removeProjectMembers(data):
    jsonData = data.json
    project =  db.getOneProject({"ProjectID": jsonData.get('ID')})
    if project.Owner == data.cookies.get('LoggedUser'):
        pass
    else:
        raise Exception('Logged User is not the project Owner.')