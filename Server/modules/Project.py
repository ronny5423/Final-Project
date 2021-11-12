
ProjectsID = 1

class Project:
    def __init__(self, ProjectID=ProjectsID, UMLEditorID=None, SQLEditorID=None, 
                NFREditorID=None, Owner=None, Members=[]):
        # Manage Users ID
        global ProjectsID
        if ProjectID == ProjectsID:
            ProjectsID += 1
        self.ProjectID = ProjectID
        self.UMLEditorID = UMLEditorID
        self.SQLEditorID = SQLEditorID
        self.NFREditorID = NFREditorID
        self.Owner = Owner
        self.Members = Members

    def calc(self):
        pass

    

    