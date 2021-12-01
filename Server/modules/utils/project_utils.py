from database import *

# Import Modules
from modules.Project import *

def saveProject(data):
    newProject = Project(db.getNextID('Projects') ,data)
    db.insertOneObject('Projects', newProject)

def loadProject(ID):
    return db.getOneProject(ID)

def getProjectMembers(ID):
    return db.getOneProject(ID).Members