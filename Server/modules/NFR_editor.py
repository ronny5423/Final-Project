
from modules.Editor import Editor
from modules.parsers.praserNFR import nfr_parser

class NFREditor(Editor):
    def __init__(self, undecipheredJson, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, convertedData, EditorID)
        self.parseJson()
        self.type = 'NFR'
    
    def parseJson(self):
        self.convertedData = nfr_parser(self.undecipheredJson)

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()