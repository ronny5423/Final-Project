
EditorsID = 1

class Editor:
    def __init__(self, undecipheredJson, convertedData=None, EditorID=EditorsID):
        self.undecipheredJson = undecipheredJson
        self.convertedMatrix = convertedData
        # Manage Editors ID
        global EditorsID
        if EditorID == EditorsID:
            EditorsID += 1
        self.UserID = EditorID

    def parseJson(self):
        pass
        
    def updateEditor(self):
        pass
