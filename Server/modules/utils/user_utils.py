from database import *



def changePassword(data):
    username = data.get('Username')
    newPass = data.get('password')
    userToUpdate = User(username, newPass)
    db.updateOneUser(userToUpdate)
    
def getUserProjects(data):
    queryData = data.args
    username = data.cookies.get('LoggedUser')
    user = db.getOneUser({"Username": username})
    projects = [proj.project_preview for proj in db.getManyProjects({"ProjectID": user.Projects[queryData.get('startIndex'):queryData.get('endIndex')]})]
    return projects, len(user.Projects)
    