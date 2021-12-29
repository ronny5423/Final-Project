from database import *



def changePassword(data):
    userToUpdate = data.cookies.get('LoggedUser')
    newPass = data.json.get('password')
    db.updateOneUser(userToUpdate, newPass)
    
def getUserProjects(data):
    queryData = data.args
    username = data.cookies.get('LoggedUser')
    user = db.getOneUser({"Username": username})
    projects = db.getManyProjects(user.Projects[int(queryData.get('startIndex')):int(queryData.get('endIndex'))])
    proj = []
    for p in projects:
        if hasattr(p, 'Weights'):
            proj.append(p.project_preview())
    return {"Projects": proj, "size": len(user.Projects)}
    