
ProjectsID = 1

class Project:
    def __init__(self, ProjectID=ProjectsID):
        # Manage Users ID
        global ProjectsID
        if ProjectID == ProjectsID:
            ProjectsID += 1
        self.ProjectID = ProjectID

    def comparePassword(self, toCompare):
        return self.Password == toCompare

    def changePassword(self, newPass):
        self.Password = newPass