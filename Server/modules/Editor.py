
import itertools

class Editor:
    id_iter = itertools.count()

    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        self.undecipheredJson = undecipheredJson
        self.projectID = projectID
        self.convertedData = convertedData
        if EditorID == None:
            EditorID = next(Editor.id_iter)
        self.EditorID = EditorID

    def parseJson(self):
        pass
        
    def updateEditor(self):
        pass
