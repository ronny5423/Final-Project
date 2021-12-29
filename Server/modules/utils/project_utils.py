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

def addProjectMember(data):
    jsonData = data.json
    projectID = jsonData.get('ProjectID')
    member = jsonData.get('Member')
    project =  db.getOneProject({"ProjectID": projectID})
    if project.Owner == data.cookies.get('LoggedUser'):
        db.addProjectMember(projectID, member)
    else:
        raise Exception('Logged User is not the project Owner.')

def removeProjectMembers(data, projectID, member):
    project =  db.getOneProject({"ProjectID": int(projectID)})
    #TODO remove project ID from user's list
    if project.Owner == data.cookies.get('LoggedUser'):
        db.removeProjectMember(project, member)
    else:
        raise Exception('Logged User is not the project Owner.')
    
def getProjectWeights(projectID):
    project =  db.getOneProject({"ProjectID": projectID})
    return {'Weights': [0.3, 0.3, 0.3]}

def updateProjectWeights(data):
    jsonData = data.json
    projectID = jsonData.get('ProjectID')
    weights = jsonData.get('Weights')
    project =  db.getOneProject({"ProjectID": projectID})
    if data.cookies.get('LoggedUser') in project.Members:
        pass
    else:
        raise Exception('Logged User is not the project Owner.')