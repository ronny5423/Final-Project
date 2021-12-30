from database import *

def Login(data):
    jsonData = data.json
    UsernameForm = jsonData.get('Username')
    passwordForm = jsonData.get('password')
    UserMongoDB = db.getOneUser({"Username": UsernameForm})
    if UserMongoDB and UserMongoDB.comparePassword(passwordForm):
        return True, UserMongoDB.Username
    return False, 'Wrong Password or Username'

def Signup(data):
    jsonData = data.json
    userFromDB = db.getOneUser({'Username': jsonData.get('Username')})
    if userFromDB is not None:
        raise Exception('Username is already exists.')
    newUser = User(jsonData.get('Username'), jsonData.get('password'))
    db.insertOneObject('Users', newUser)