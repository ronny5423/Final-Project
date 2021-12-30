# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.parserSQL import sql_parser

# Import utils
from database import *

class SQLEditor(Editor):
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, projectID, convertedData, EditorID)
        # if convertedData == None:
        #     self.parseJson()
        self.convertedData = convertedData
        self.type = 'SQL'
    
    def parseJson(self, UMLEditor):
        # editorProject = db.getOneProject(self.projectID)
        self.convertedData = sql_parser(self.undecipheredJson, UMLEditor) # Need to check if should extract the json or the class

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()