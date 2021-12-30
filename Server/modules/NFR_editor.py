# Import father class
from modules.Editor import Editor

# Import Editor parser
from modules.parsers.praserNFR import nfr_parser

# Import utils
from database import *

class NFREditor(Editor):
    def __init__(self, undecipheredJson, projectID, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, projectID, convertedData, EditorID)
        # if convertedData == None:
        #     self.parseJson()
        self.convertedData = convertedData
        self.type = 'NFR'
    
    def parseJson(self, UMLclasses, AHPvalues):
        self.convertedData = nfr_parser(self.undecipheredJson, UMLclasses, AHPvalues)

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()
        
    def setWeights(self, weights):
        self.weights = weights