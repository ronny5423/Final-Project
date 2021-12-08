from flask_pymongo import PyMongo
import json

import pymongo

# Import modules
from modules.User import User
from modules.Project import Project

from modules.UML_editor import UMLEditor
from modules.SQL_editor import SQLEditor
from modules.NFR_editor import NFREditor
from modules.Editor import Editor

class DataBase:
    def __init__(self):
        self.db = PyMongo()

    def initMongoDB(self, app):
        self.db.init_app(app)
        
        # Test IDs
        proj = self.db.db.Projects.find_one(sort=[('ProjectID', pymongo.DESCENDING)])
        if proj:
            self.next_ProjectID = proj['ProjectID']
        else:
            self.next_ProjectID = 0
            
        edi = self.db.db.Editors.find_one(sort=[('EditorID', pymongo.DESCENDING)])
        if edi:
            self.next_EditorID = edi['EditorID']
        else:
            self.next_nextEditorID = 0
            
    @property
    def nextEditorID(self):
        self.next_EditorID += 1
        return self.next_EditorID
    
    @property
    def nextProjectID(self):
        self.next_ProjectID += 1
        return self.next_ProjectID
    
    # def getNextID(self, collectionFrom):
    #     self.db.db[collectionFrom].aggregate([ 
    #         { "$group": { 
    #             "_id": None,
    #             "max": { "$max": "$" }, 
    #             "min": { "$min": "$price" } 
    #         }}
    #     ])

    def getOneUser(self, data):
        objectFromDB = self.db.db.Users.find_one(data)
        if objectFromDB:
            return User(objectFromDB['Username'], objectFromDB['Password'])

    def getManyUsers(self, data):
        objectsFromDB = self.db.db.Users.find(data)
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(User(line['Username'], line['Password']))
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
    
    def getOneProject(self, data):
        objectFromDB = self.db.db.Projects.find_one(data)
        if objectFromDB:
            return Project(objectFromDB['ProjectID'], objectFromDB)
        
    def getManyProjects(self, data):
        objectsFromDB = self.db.db.Projects.find(data)
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(Project(line))
        return convertedData
        
    def getOneObject(self, loadFrom, data):
        objectFromDB = self.db.db[loadFrom].find_one(data)
        # create class from the return data

    def getManyObject(self, loadFrom, data):
        objectsFromDB = self.db.db[loadFrom].find(data)
        # create classes from the return data

    def insertOneObject(self,saveTo, objectToSave):
        self.db.db[saveTo].insert_one(objectToSave.__dict__)

    def insertManyObjects(self, saveTo, objectsToSave):
        # Convert objects list to dict list
        dictObjects = []
        for object in objectsToSave:
            dictObjects.append(object.__dict__)
        self.db.db[saveTo].insert_many(dictObjects)
        
    def updateOneUser(self, userToUpdate):
        self.db.db.Editors.update_one({'Username': userToUpdate.Username}, {
            '$set': {
                'password': userToUpdate.password
            }
        })
    
    def updateOneEditor(self, editorToUpdate):
        self.db.db.Editors.update_one({'EditorID': editorToUpdate.EditorID}, {
            '$set': {
                'undecipheredJson': editorToUpdate.undecipheredJson,
                'convertedData': editorToUpdate.convertedData
            }
        })
        
    def updateProjectEditors(self, editor):
        field = editor.type + 'EditorID'
        self.db.db.Projects.update_one({'ProjectID': editor.ProjectID}, {
            '$set': {
                field: editor.EditorID
            }
        })
    
    # def getNextID(self, collection):
    #     return self.db[collection].findOne({},sort={'ProjectID':-1})



# Helper Functions
def EditorsSwitchCase(objectFromDB):
    if objectFromDB is None:
        return
    elif objectFromDB['type'] == 'SQL':
        return SQLEditor(objectFromDB['undecipheredJson'], objectFromDB['projectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'NFR':
        return NFREditor(objectFromDB['undecipheredJson'], objectFromDB['projectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'UML':
        return UMLEditor(objectFromDB['undecipheredJson'], objectFromDB['projectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])


db = DataBase()