from database import *

def updateAHP(data):
    db.updateAHPWeights(data.get('AHP'))

def getAHP():
    return db.getAHPWeights()

def updateNFR(data):
    db.updateNFRWeights(data.get('nfrWeights'))
    db.updateNFRAttributes(data.get('nfrAttributes'))

def getNFR():
    return {'Weights': db.getNFRWeights()['Weights'], 'Attributes': db.getNFRAttributes()['Attributes']}

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