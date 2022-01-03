from database import *


def Login(data):
    UsernameForm = data.get('Username')
    passwordForm = data.get('password')
    UserMongoDB = db.getOneUser({'Username': UsernameForm})
    if UserMongoDB and UserMongoDB.comparePassword(passwordForm):
        resAdmin = db.isAdmin(UsernameForm)
        return resAdmin, UserMongoDB
    return False, 'Wrong Password or Username'


def Signup(data):
    jsonData = data.json
    userFromDB = db.getOneUser({'Username': jsonData.get('Username')})
    if userFromDB is not None:
        return False
    newUser = User(jsonData.get('Username'), jsonData.get('password'))
    db.insertOneObject('Users', newUser)
    return True
