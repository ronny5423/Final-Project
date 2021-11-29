from Server.modules.utils.editors_utils import loadEditor
import modules.utils.editors_utils

ProjectsID = 1

class Project:
    def __init__(self, ProjectID=ProjectsID, Discribtion='', UMLEditorID=None, SQLEditorID=None, 
                NFREditorID=None, AHPEditorID=None, Owner=None, Members=[]):
        # Manage Users ID
        global ProjectsID
        if ProjectID == ProjectsID:
            ProjectsID += 1
        self.ProjectID = ProjectID
        self.Discribtion = Discribtion
        self.UMLEditorID = UMLEditorID
        self.SQLEditorID = SQLEditorID
        self.NFREditorID = NFREditorID
        self.AHPEditorID = AHPEditorID
        self.Owner = Owner
        self.Members = Members

    def getProjectUML(self):
        return loadEditor(self.UMLEditorID)
        
    def getProjectSQL(self):
        return loadEditor(self.SQLEditorID)

    def getProjectNFR(self):
        return loadEditor(self.NFREditorID)

    def calc(self):
        pass

    

    