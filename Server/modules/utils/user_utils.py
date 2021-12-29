from database import *



def changePassword(data):
    userToUpdate = data.cookies.get('LoggedUser')
    newPass = data.json.get('password')
    db.updateOneUser(userToUpdate, newPass)
    
def getUserProjects(data):
    queryData = data.args
    username = data.cookies.get('LoggedUser')
    user = db.getOneUser({"Username": username})
    projects = [proj.project_preview for proj in db.getManyProjects({"ProjectID": user.Projects[queryData.get('startIndex'):queryData.get('endIndex')]})]
    return projects, len(user.Projects)
    