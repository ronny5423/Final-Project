
from Editor import Editor


class SQLEditor(Editor):
    def __init__(self, undecipheredJson, convertedMatrix=None, EditorID=None):
        super().__init__(undecipheredJson, convertedMatrix, EditorID)
        self.type = 'SQL'
    
    def parseJson(self):
        pass

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()