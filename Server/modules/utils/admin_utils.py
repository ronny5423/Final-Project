from database import *


def updateAHP(data):
    db.updateAHPWeights(data.get('AHP'))


def getAHP():
    return db.getAHPWeights()


def updateNFR(data):
    db.updateNFRWeights(data.get('nfrWeights'))
    db.updateNFRAttributes(data.get('nfrAttributes'))

def getNFRWeights():
    return db.getNFRWeights()['Weights']

def getNFRAttributes():
    return db.getNFRAttributes()['Attributes']

def getNFR():
    return {'Weights': getNFRWeights(), 'Attributes': getNFRAttributes()}

def getUsers(indexes):
    users = db.getUsernamesByIndexes(indexes)
    return users


def getProjects(indexes):
    projects = db.getProjectsByIndexes(indexes)
    proj = []
    for p in projects['Projects']:
        if not hasattr(p, 'Weights'):
            p.setWeights(db.getAHPWeights())
        proj.append(p.project_preview())
    projects['Projects'] = proj
    return projects

def getDBProfiles():
    return db.getDBProfiles()

def updateDBProfiles(profiles):
    db.updateDBProfile(profiles)
