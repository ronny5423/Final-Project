
EditorsID = 1

class Editor:
    def __init__(self, undecipheredJson, convertedMatrix=None, EditorID=EditorsID):
        self.undecipheredJson = undecipheredJson
        self.convertedMatrix = convertedMatrix
        # Manage Editors ID
        global EditorsID
        if EditorID == EditorsID:
            EditorsID += 1
        self.UserID = EditorID

    def parseJson(self):
        pass
        
    def updateEditor(self):
        pass