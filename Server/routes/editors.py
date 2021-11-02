from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

editors = Blueprint('editors', __name__)

from database import db


@editors.route("/saveData/UMLEditor", ["POST"])
def saveUMLEditor():
    try:
        data = request.json
        # TODO build UML Editor class and create db function for saving and updating
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveData/NFREditor", ["POST"])
def saveNFREditor():
    try:
        data = request.json
        # TODO build NFR Editor class and create db function for saving and updating
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/saveData/SQLEditor", ["POST"])
def saveSQLEditor():
    try:
        data = request.json
        # TODO build SQL Editor class and create db function for saving and updating
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')