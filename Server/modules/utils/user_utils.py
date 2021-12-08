from database import *



def changePassword(data):
    username = data.get('Username')
    newPass = data.get('password')
    userToUpdate = User(username, newPass)
    db.updateOneUser(userToUpdate)
    
def getUserProjects(data):
    jsonData = data.json
    username = data.cookies.get('LoggedUser')
    indexes = jsonData.get('indexes')
    user = db.getOneUser({"Username": username})
    projects = [proj.project_preview for proj in db.getManyProjects({"ProjectID": user.Projects[indexes[0]:indexes[1]]})]
    return projects, len(user.Projects)
    