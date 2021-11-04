from flask_pymongo import PyMongo
import json
from modules.UML_editor import UMLEditor
from modules.SQL_editor import SQLEditor
from modules.NFR_editor import NFREditor
from modules.Editor import Editor

# Import modules
from modules.User import User

from modules.UML_editor import UMLEditor
from modules.SQL_editor import SQLEditor
from modules.NFR_editor import NFREditor
from modules.Editor import Editor

class DataBase:
    def __init__(self):
        self.db = PyMongo()

    def initMongoDB(self, app):
        self.db.init_app(app)

    def getOneUser(self, data):
        objectFromDB = self.db.db.Users.find_one(data)
        return User(objectFromDB['Username'], objectFromDB['password'], objectFromDB['UserID'])

    def getManyUsers(self, data):
        objectsFromDB = self.db.db.Users.find(data)
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(User(line['Username'], line['password'], line['UserID']))
        return convertedData

    def getOneEditor(self, data):
        objectFromDB = self.db.db.Editors.find_one(data)
        # Python 3.8 does not have switch case ='(
        return EditorsSwitchCase(objectFromDB)

    def getManyEditors(self, loadFrom, data):
        objectsFromDB = self.db.db[loadFrom].find(data)
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(EditorsSwitchCase(line))
        return convertedData
        
    def getOneObject(self, loadFrom, data):
        objectFromDB = self.db.db[loadFrom].find_one(data)
        # create class from the return data

    def getManyObject(self, loadFrom, data):
        objectsFromDB = self.db.db[loadFrom].find(data)
        # create classes from the return data

    def insertOneObject(self,saveTo, objectToSave):
        self.db.db[saveTo].insert_one(json.dumps(objectToSave.__dict__))

    def insertManyOjects(self, saveTo, objectsToSave):
        # Convert objects list to dict list
        dictObjects = []
        for object in objectsToSave:
            dictObjects.append(object.__dict__)
        self.db.db[saveTo].insert_many(json.dumps(dictObjects))


# Helper Functions
def EditorsSwitchCase(objectFromDB):
    if objectFromDB['type'] == 'UML':
        return UMLEditor(objectFromDB['undecipheredJson'], objectFromDB['convertedMatrix'], objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'SQL':
        return SQLEditor(objectFromDB['undecipheredJson'], objectFromDB['convertedMatrix'], objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'NFR':
        return NFREditor(objectFromDB['undecipheredJson'], objectFromDB['convertedMatrix'], objectFromDB['EditorID'])
    else:
        return Editor(objectFromDB['undecipheredJson'], objectFromDB['convertedMatrix'], objectFromDB['EditorID'])


db = DataBase()