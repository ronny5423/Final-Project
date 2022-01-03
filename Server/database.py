import pymongo
from flask_pymongo import PyMongo

from modules.NFR_editor import NFREditor
from modules.Project import Project
from modules.SQL_editor import SQLEditor
from modules.UML_editor import UMLEditor
from modules.User import User


class DataBase:
    def __init__(self):
        self.db = PyMongo()

    def initMongoDB(self, app):
        self.db.init_app(app)

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
            return User(objectFromDB['Username'], objectFromDB['Password'], objectFromDB['Projects'])

    def getManyUsers(self, data):
        objectsFromDB = self.db.db.Users.find(data)
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(User(line['Username'], line['Password']))
        return convertedData

    def getUsernamesByIndexes(self, indexes):
        objectsFromDB = self.db.db.Users.aggregate([
            {'$skip': indexes[0]},
            {'$limit': indexes[1] - indexes[0]}
        ])
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(line['Username'])
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
            return Project(objectFromDB)

    def getManyProjects(self, data):
        objectsFromDB = self.db.db.Projects.find({"ProjectID": {'$in': data}})
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(Project(line))
        return convertedData

    def getProjectsByIndexes(self, indexes):
        objectsFromDB = self.db.db.Projects.aggregate([
            {'$skip': indexes[0]},
            {'$limit': indexes[1] - indexes[0]}
        ])
        size = self.db.db.Projects.count({})
        convertedData = []
        for line in objectsFromDB:
            convertedData.append(Project(line))
        return {'Projects': convertedData, 'size': size}

    def getNFRWeights(self):
        weights = self.db.db.Constants.find_one({"Constant": "NFRWeights"}, {"Constant": 0})
        del weights["_id"]
        return weights

    def getNFRAttributes(self):
        attribuetes = self.db.db.Constants.find_one({"Constant": "NFRAttributes"}, {"Attributes": 1})
        del attribuetes["_id"]
        return attribuetes

    def updateNFRWeights(self, data):
        self.db.db.Constants.update_one({"Constant": "NFRWeights"}, {
            '$set': {
                'Weights': data
            }
        })

    def updateNFRAttributes(self, data):
        self.db.db.Constants.update_one({"Constant": "NFRAttributes"}, {
            '$set': {
                'Attributes': data
            }
        })

    def getAHPWeights(self):
        weights = self.db.db.Constants.find_one({"Constant": "AHPWeights"})
        return weights['Weights']

    def updateAHPWeights(self, data):
        self.db.db.Constants.update_one({"Constant": "AHPWeights"}, {
            '$set': {
                'Weights': data
            }
        })

    def getOneObject(self, loadFrom, data):
        objectFromDB = self.db.db[loadFrom].find_one(data)
        # create class from the return data

    def getManyObject(self, loadFrom, data):
        objectsFromDB = self.db.db[loadFrom].find(data)
        # create classes from the return data

    def get_editors_project(self, project_id):
        # return array of the editors of the same project
        result = {}
        editors_arr = self.db.db.Editors.aggregate([
            {
                '$match': {
                    'ProjectID': project_id
                }
            }, {
                '$lookup': {
                    'from': 'Editors',
                    'localField': 'ProjectID',
                    'foreignField': 'ProjectID',
                    'as': 'editors'
                }
            }, {
                '$project': {
                    'editors': 1,
                    '_id': 0
                }
            }, {
                '$limit': 1
            }
        ])

        result['result'] = list(editors_arr)

        return result['result'][0]['editors']

    def insertOneObject(self, saveTo, objectToSave):
        self.db.db[saveTo].insert_one(objectToSave.__dict__)

    def insertManyObjects(self, saveTo, objectsToSave):
        # Convert objects list to dict list
        dictObjects = []
        for object in objectsToSave:
            dictObjects.append(object.__dict__)
        self.db.db[saveTo].insert_many(dictObjects)

    def updateOneUser(self, userToUpdate, newPass):
        self.db.db.Users.update_one({'Username': userToUpdate}, {
            '$set': {
                'Password': newPass
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

    def updateProjectWeights(self, projectID, weights):
        self.db.db.Projects.update_one({'ProjectID': projectID}, {
            '$set': {
                'Weights': weights
            }
        })

    def addProjectMember(self, projectID, member):
        self.db.db.Projects.update_one({'ProjectID': projectID}, {
            '$addToSet': {
                'Members': member
            }
        })
        self.db.db.Users.update_one({'Username': member}, {
            '$addToSet': {
                'Projects': projectID
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

        if member == project.Owner:
            project.Members.remove(member)
            if len(project.Members) > 0:
                newOwner = project.Members[0]
            else:
                newOwner = None
            self.db.db.Projects.update_one({'ProjectID': project.ProjectID}, {
                '$set': {
                    'Owner': newOwner
                }
            })

    def saveCalcResults(self, projectID, results):
        self.db.db.Projects.update_one({'ProjectID': projectID}, {
            '$set': {
                "Results": results
            }
        })

    def getCalcResults(self, projectID):
        calcResults = self.db.db.Projects.find_one({'ProjectID': projectID}, {'Results': 1})
        del calcResults["_id"]
        return calcResults

    def updateProjectDetails(self, projectID, data):
        self.db.db.Projects.update_one({'ProjectID': projectID}, {
            '$set': {
                'name': data['name'],
                'Description': data['Description']
            }
        })

    def isAdmin(self, username):
        return self.db.db.Constants.find({
            "Constant": "Admins",
            'Admins': {'$in': [username]}
        }).count() > 0


# Helper Functions
def EditorsSwitchCase(objectFromDB):
    if objectFromDB is None:
        return
    elif objectFromDB['type'] == 'SQL':
        return SQLEditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'], objectFromDB['convertedData'],
                         objectFromDB['EditorID'])
    elif objectFromDB['type'] == 'NFR':
        nfrEditor = NFREditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'],
                              objectFromDB['convertedData'], objectFromDB['EditorID'])
        nfrEditor.setAttributes(db.getNFRAttributes())
        return nfrEditor
    elif objectFromDB['type'] == 'UML':
        return UMLEditor(objectFromDB['undecipheredJson'], objectFromDB['ProjectID'], objectFromDB['convertedData'],
                         objectFromDB['EditorID'])


db = DataBase()
