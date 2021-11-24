# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.praserNFR import nfr_parser

# Import utils
from modules.utils.project_utils import *

class NFREditor(Editor):
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, projectID, convertedData, EditorID)
        self.parseJson()
        self.type = 'NFR'
    
    def parseJson(self):
        editorProject = loadProject(self.projectID)
        self.convertedData = nfr_parser(self.undecipheredJson, editorProject.getProjectUML(), editorProject.getProjectSQL())

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()