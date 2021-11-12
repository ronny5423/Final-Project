from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

editors = Blueprint('editors', __name__)

from database import db

# Impost modules
from modules.UML_editor import UMLEditor
from modules.NFR_editor import NFREditor
from modules.SQL_editor import SQLEditor

@editors.route("/saveData/UMLEditor", methods = ["POST"])
def saveUMLEditor():
    try:
        data = request.json
        newUMLEditor = UMLEditor(data.get('jsonFile'))
        db.insertOneObject('Editors', newUMLEditor)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveData/NFREditor", methods = ["POST"])
def saveNFREditor():
    try:
        data = request.json
        newNFREditor = NFREditor(data.get('jsonFile'))
        db.insertOneObject('Editors', newNFREditor)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveData/SQLEditor", methods = ["POST"])
def saveSQLEditor():
    try:
        data = request.json
        newSQLEditor = SQLEditor(data.get('jsonFile'))
        db.insertOneObject('Editors', newSQLEditor)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/loadData/Editor", methods = ["GET"])
def loadUMLEditor():
    try:
        data = request.args
        query = {'EditorID': data.get('ID'), 'type': data.get('type')}
        EditorFromDB = db.getOneEditor(query)
        return Response(json.dumps(EditorFromDB.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
