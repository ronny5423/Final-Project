
from modules.Editor import Editor
from modules.parsers.parserSQL import sql_parser

class SQLEditor(Editor):
    def __init__(self, undecipheredJson, convertedData=None, EditorID=None):
        super().__init__(undecipheredJson, convertedData, EditorID)
        self.parseJson()
        self.type = 'SQL'
    
    def parseJson(self):
        self.convertedData = sql_parser(self.undecipheredJson)

    def updateEditor(self, undecipheredJson):
        self.undecipheredJson = undecipheredJson
        self.parseJson()