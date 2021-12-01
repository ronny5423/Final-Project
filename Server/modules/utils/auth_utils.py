from database import *

def Login(data):
    UsernameForm = data.get('Username')
    passwordForm = data.get('password')
    UserMongoDB = db.getOneUser({"Username": UsernameForm})
    if UserMongoDB and UserMongoDB.comparePassword(passwordForm):
        return True
    return False

def Signup(data):
    pass