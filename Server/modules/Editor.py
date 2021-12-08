
class Editor:
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        self.undecipheredJson = undecipheredJson
        self.ProjectID = projectID
        self.convertedData = convertedData
        if EditorID == None:
            EditorID = next(Editor.id_iter)
        self.EditorID = EditorID

    def parseJson(self):
        pass
        
    def updateEditor(self):
        pass
