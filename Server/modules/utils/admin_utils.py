from database import *

def getUsers(indexes):
    users = db.getUsernamesByIndexes(indexes)
    return users

def getProjects(indexes):
    users = db.getProjectsByIndexes(indexes)
    return users