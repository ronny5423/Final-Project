from flask_login import current_user

from database import *


def changePassword(data):
    userToUpdate = current_user.Username
    newPass = data.json.get('password')
    db.updateOneUser(userToUpdate, newPass)


def getUserProjects(data):
    queryData = data.args
    username = current_user.Username
    user = db.getOneUser({'Username': username})
    projects = db.getManyProjects(user.Projects[int(queryData.get('startIndex')):int(queryData.get('endIndex'))])
    proj = []
    for p in projects:
        if not hasattr(p, 'Weights'):
            p.setWeights(db.getAHPWeights())
        proj.insert(user.Projects.index(p.ProjectID)-int(queryData.get('startIndex')), p.project_preview())

    return {"Projects": proj, "size": len(user.Projects)}


def leaveProject(projectID):
    user = current_user.Username
    project = db.getOneProject({"ProjectID": projectID})
    db.removeProjectMember(project, user)
