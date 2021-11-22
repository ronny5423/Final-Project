
from modules.Editor import Editor
from modules.parsers.parserUML import uml_parser

class UMLEditor(Editor):
    def __init__(self, undecipheredJson, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, convertedData, EditorID)
        self.parseJson()
        self.type = 'UML'
    
    def parseJson(self):
        self.convertedData = uml_parser(self.undecipheredJson)

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()