# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.parserUML import uml_parser

# Import utils
from modules.utils.project_utils import *

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