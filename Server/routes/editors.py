from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

editors = Blueprint('editors', __name__)

# from database import db
from modules.utils.editors_utils import *

# Impost modules
from modules.UML_editor import UMLEditor
from modules.NFR_editor import NFREditor
from modules.SQL_editor import SQLEditor

@editors.route("/saveUMLEditor", methods = ["POST"])
def saveUMLEditor():
    try:
        data = request.json
        saveEditors(data, 'UML')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@editors.route("/updateUMLEditor", methods = ["POST"])
def updateUMLEditor():
    try:
        data = request.json
        updateEditor(data, 'UML')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveNFREditor", methods = ["POST"])
def saveNFREditor():
    try:
        data = request.json
        saveEditors(data, 'NFR')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@editors.route("/updateNFREditor", methods = ["POST"])
def updateNFREditor():
    try:
        data = request.json
        updateEditor(data, 'NFR')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveSQLEditor", methods = ["POST"])
def saveSQLEditor():
    try:
        data = request.json
        saveEditors(data, 'SQL')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@editors.route("/updateSQLEditor", methods = ["POST"])
def updateSQLEditor():
    try:
        data = request.json
        updateEditor(data, 'SQL')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/loadEditor", methods = ["GET"])
def loadEditor():
    try:
        data = request.args
        EditorFromDB = loadEditor(data.get('ID'))
        return Response(json.dumps(EditorFromDB.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
