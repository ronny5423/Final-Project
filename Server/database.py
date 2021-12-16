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
            self.next_EditorID = 0
            
    @property
    def nextEditorID(self):
        self.next_EditorID += 1
        return self.next_EditorID
    
    @property
    def nextProjectID(self):
        self.next_ProjectID += 1
        return self.next_ProjectID

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
    
    def getNFRWeights(self):
        weights = self.db.db.Constants.find_one({"Constant": "NFRWeights"})
        del weights["_id"]
        return weights

    def getAHPWeights(self):
        weights = self.db.db.Constants.find_one({"Constant": "AHPWeights"})
        del weights["_id"]
        del weights["Constant"]
        return weights
    
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
        
    def updateOneUser(self, userToUpdate, newPass):
        self.db.db.Editors.update_one({'Username': userToUpdate}, {
            '$set': {
                'password': newPass
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
        
    def addProjectMember(self, projectID, member):
        self.db.db.Projects.update_one({'ProjectID': projectID}, {
            '$addToSet': {
                'Members': member
            }
        })    
    
    def removeProjectMember(self, project, member):
        self.db.db.Projects.update_one({'ProjectID': project.ProjectID}, {
            '$pull': {
                'Members': member
            }
        })
        
        self.db.db.Users.update_one({'Username': member}, {
            '$pull': {
                'Projects': project.ProjectID
            }
        })
        
        project.Members.remove(member)
        self.db.db.Projects.update_one({'ProjectID': project.ProjectID}, {
            '$set': {
                'Owner':  project.Members[0]
            }
        })
    



# Helper Functions
def EditorsSwitchCase(objectFromDB):
    if objectFromDB is None:
        return
    elif objectFromDB['type'] == 'SQL':
        return SQLEditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'NFR':
        nfrEditor = NFREditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])
        nfrEditor.setWeights(db.getNFRWeights())
        return nfrEditor
    elif objectFromDB['type'] == 'UML':
        return UMLEditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'], objectFromDB['convertedData'], objectFromDB['EditorID'])


db = DataBase()