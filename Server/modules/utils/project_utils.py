from flask_login import current_user

from database import *
from modules.Project import *
from modules.parsers.Algorithm import calculate_algorithm


def saveProject(data):
    jsonData = data.json
    jsonData['ProjectID'] = db.nextProjectID
    jsonData['Owner'] = current_user.Username
    newProject = Project(jsonData)
    db.insertOneObject('Projects', newProject)
    db.addProjectMember(newProject.ProjectID, current_user.Username)
    return newProject.ProjectID


def loadProject(projectID):
    proj = db.getOneProject({"ProjectID": projectID})
    if not hasattr(proj, 'Weights'):
        proj.setWeights(db.getAHPWeights())
    return proj.project_preview()


def updateDetails(data):
    db.updateProjectDetails(data.get('projectID'), data.get('details'))


def getProjectMembers(projectID, indexes):
    members = db.getOneProject({"ProjectID": projectID}).getMembers
    return {'Members': members[indexes[0]:indexes[1]], 'size': len(members)}


def addProjectMember(data):
    jsonData = data.json
    projectID = jsonData.get('ProjectID')
    member = jsonData.get('Member')
    if not db.getOneUser({'Username': member}):
        raise Exception('Received member does not exists.')
    project = db.getOneProject({"ProjectID": projectID})
    if project.Owner == current_user.Username:
        db.addProjectMember(projectID, member)
    else:
        raise Exception('Logged User is not the project Owner.')


def removeProjectMembers(projectID, member):
    project = db.getOneProject({"ProjectID": projectID})
    if project.Owner == current_user.Username:
        if member not in project.Members:
            raise Exception('Received User is not part of the received project.')
        db.removeProjectMember(project, member)
    else:
        raise Exception('Logged User is not the project Owner.')


def getProjectWeights(projectID):
    project = db.getOneProject({"ProjectID": projectID})
    if hasattr(project, 'Weights'):
        return project.Weights
    else:
        return db.getAHPWeights()


def updateProjectWeights(data):
    jsonData = data.json
    projectID = jsonData.get('ProjectID')
    weights = jsonData.get('Weights')
    project = db.getOneProject({"ProjectID": projectID})
    if current_user.Username in project.Members:
        db.updateProjectWeights(projectID, weights)
    else:
        raise Exception('Logged User is not a member of the received project.')


def calculateResults(projectID, N):
    calcResults = calculate_algorithm(projectID)
    db.saveCalcResults(projectID, calcResults)
    return calcResults


def getResults(projectID):
    return db.getCalcResults(projectID)
