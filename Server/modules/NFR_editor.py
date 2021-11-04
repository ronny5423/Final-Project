
from modules.Editor import Editor


class NFREditor(Editor):
    def __init__(self, undecipheredJson, convertedMatrix=None, EditorID=None):
        super().__init__(undecipheredJson, convertedMatrix, EditorID)
        self.type = 'NFR'
    
    def parseJson(self):
        pass

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()