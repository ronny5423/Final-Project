# from modules.utils.editors_utils import *

ProjectsID = 1

class Project:
    def __init__(self, ProjectID, name, Discription='', UMLEditorID=None, SQLEditorID=None, 
                NFREditorID=None, AHPEditorID=None, Owner=None, Members=[]):
        self.ProjectID = ProjectID
        self.name = name
        self.Discription = Discription
        self.UMLEditorID = UMLEditorID
        self.SQLEditorID = SQLEditorID
        self.NFREditorID = NFREditorID
        self.AHPEditorID = AHPEditorID
        self.Owner = Owner
        self.Members = Members
    
    def __init__(self, data):
        self.ProjectID = data.get('ProjectID')
        self.name = data.get('name')
        self.Discription = data.get('Discription')
        self.UMLEditorID = data.get('UMLEditorID')
        self.SQLEditorID = data.get('SQLEditorID')
        self.NFREditorID = data.get('NFREditorID')
        self.AHPEditorID = data.get('AHPEditorID')
        self.Owner = data.get('Owner')
        if data.get('Members') is not None:
            self.Members = data.get('Members')
        else:
            self.Members = []
        if data.get('Weights') is not None:
            self.Weights = data.get('Weights')
    
    def project_preview(self):
        proj = self.__dict__
        del proj['Members']
        if hasattr(self, 'Results'):
            del proj['Results']
        return proj
    
    @property
    def getMembers(self):
        return self.Members
    
    def setWeights(self, w):
        self.Weights = w

    def calc(self):
        pass

    

    