from flask_pymongo import PyMongo
import json

# Import modules
from .modules.User import User

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


db = DataBase()