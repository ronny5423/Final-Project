
from modules.Editor import Editor


class UMLEditor(Editor):
    def __init__(self, undecipheredJson, convertedMatrix=None, EditorID=None):
        super().__init__(undecipheredJson, convertedMatrix, EditorID)
        self.type = 'UML'
    
    def parseJson(self):
        pass

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()