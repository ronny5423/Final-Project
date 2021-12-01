# from modules.utils.editors_utils import *

ProjectsID = 1

class Project:
    def __init__(self, ProjectID, Discribtion='', UMLEditorID=None, SQLEditorID=None, 
                NFREditorID=None, AHPEditorID=None, Owner=None, Members=[]):
        self.ProjectID = ProjectID
        self.Discribtion = Discribtion
        self.UMLEditorID = UMLEditorID
        self.SQLEditorID = SQLEditorID
        self.NFREditorID = NFREditorID
        self.AHPEditorID = AHPEditorID
        self.Owner = Owner
        self.Members = Members
    
    def __init__(self, data):
        self.ProjectID = data.get('projectID')
        self.Discribtion = data.get('Discribtion')
        self.UMLEditorID = data.get('UMLEditorID')
        self.SQLEditorID = data.get('SQLEditorID')
        self.NFREditorID = data.get('NFREditorID')
        self.AHPEditorID = data.get('AHPEditorID')
        self.Owner = data.get('Owner')
        if data.get('Members') is not None:
            self.Members = data.get('Members')
        else:
            self.Members = []
        
    # def __dict__(self):
    #     return {
    #         'ProjectID': self.ProjectID,
    #         'Discribtion': self.Discribtion,
    #         'UMLEditorID': self.UMLEditorID,
    #         'SQLEditorID': self.SQLEditorID,
    #         'NFREditorID': self.NFREditorID,
    #         'AHPEditorID': self.AHPEditorID,
    #         'Owner': self.Owner,
    #     }

    # def getProjectUML(self):
    #     return loadEditor(self.UMLEditorID)
        
    # def getProjectSQL(self):
    #     return loadEditor(self.SQLEditorID)

    # def getProjectNFR(self):
    #     return loadEditor(self.NFREditorID)

    def calc(self):
        pass

    

    