
EditorsID = 1

class Editor:
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=EditorsID):
        self.undecipheredJson = undecipheredJson
        self.projectID = projectID
        self.convertedData = convertedData
        # Manage Editors ID
        global EditorsID
        if EditorID == EditorsID:
            EditorsID += 1
        self.UserID = EditorID

    def parseJson(self):
        pass
        
    def updateEditor(self):
        pass
