from database import db

# Import Modules
from modules.Project import Project

def saveProject(data):
    newProject = Project(data)
    db.insertOneObject('Projects', newProject)
    
def loadProject(ID):
    return db.getOneProject(ID)