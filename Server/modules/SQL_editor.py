# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.parserSQL import sql_parser

# Import utils
from modules.utils.project_utils import *

class SQLEditor(Editor):
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, projectID, convertedData, EditorID)
        self.parseJson()
        self.type = 'SQL'
    
    def parseJson(self):
        editorProject = loadProject(self.projectID)
        self.convertedData = sql_parser(self.undecipheredJson, editorProject.getProjectUML()) # Need to check if should extract the json or the class

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()