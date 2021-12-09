from database import *

# Import Modules
from modules.Project import *

def saveProject(data):
    jsonData = data.json
    newProject = Project(db.nextProjectID, jsonData)
    db.insertOneObject('Projects', newProject)
    return newProject.ProjectID

def loadProject(projectID):
    return db.getOneProject({"ProjectID": projectID}).project_preview()

def getProjectMembers(projectID):
    return db.getOneProject({"ProjectID": projectID}).getMembers

def removeProjectMembers(data, projectID, member):
    project =  db.getOneProject({"ProjectID": projectID})
    #TODO remove project ID from user's list
    if project.Owner == data.cookies.get('LoggedUser'):
        pass
    else:
        raise Exception('Logged User is not the project Owner.')