# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.parserUML import uml_parser

class UMLEditor(Editor):
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, projectID, convertedData, EditorID)
        if convertedData == None:
            self.parseJson()
        else:
            self.convertedData = convertedData
        self.type = 'UML'
    
    def parseJson(self):
        self.convertedData = uml_parser(self.undecipheredJson)

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()