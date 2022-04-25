from flask import session
from flask_login import current_user

from database import *
from modules.Project import *
from modules.parsers.Algorithm import calculate_algorithm
from modules.parsers.createPDF import createHtmlReport


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
    project = db.getOneProject({"ProjectID": data.get('projectID')})
    if project.Owner == current_user.Username or session['admin']:
        db.updateProjectDetails(data.get('projectID'), data.get('details'))


def getProjectMembers(projectID, indexes):
    members = db.getOneProject({"ProjectID": projectID}).getMembers
    return {'Members': members[indexes[0]:indexes[1]], 'size': len(members)}


def addProjectMember(data):
    projectID = data.get('ProjectID')
    member = data.get('Member')
    if not db.getOneUser({'Username': member}):
        raise Exception('Received member does not exists.')
    project = db.getOneProject({"ProjectID": projectID})
    if project.Owner == current_user.Username or session['admin']:
        db.addProjectMember(projectID, member)
    else:
        raise Exception('Logged User is not the project Owner.')


def removeProjectMembers(projectID, member):
    project = db.getOneProject({"ProjectID": projectID})
    if project.Owner == current_user.Username or session['admin']:
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
    projectID = data.get('ProjectID')
    weights = data.get('Weights')
    project = db.getOneProject({"ProjectID": projectID})
    if current_user.Username in project.Members or session['admin']:
        db.updateProjectWeights(projectID, weights)
    else:
        raise Exception('Logged User is not a member of the received project.')


def calculateResults(projectID, N):
    project = db.getOneProject({"ProjectID": projectID})
    editors = db.get_editors_project(projectID)
    calcResults = calculate_algorithm(project, editors)
    db.saveCalcResults(projectID, calcResults, editors)
    return calcResults


def getResults(projectID):
    return db.getCalcResults(projectID)


def createReport(projectID):
    project = db.getOneProject({"ProjectID": projectID})
    if current_user.Username in project.Members or session['admin']:
        return createHtmlReport(project)
    else:
        raise Exception('Logged User is not a member of the received project.')
