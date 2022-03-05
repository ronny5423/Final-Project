import json

from flask import Blueprint, request
from flask.wrappers import Response
from flask_login import login_required

from modules.utils.editors_utils import *

editors = Blueprint('editors', __name__)


@editors.route("/saveUMLEditor", methods=["POST"])
@login_required
def saveUMLEditor():
    try:
        data = request.json
        newEditorID = saveEditors(data, 'UML')
        return Response(json.dumps(newEditorID), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/updateUMLEditor", methods=["POST"])
@login_required
def updateUMLEditor():
    try:
        data = request.json
        updated_editors = updateProjectEditors(data)
        updateEditor(data, 'UML')
        if updated_editors is not None:
            updateProjectEditors_in_DB(updated_editors)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/saveNFREditor", methods=["POST"])
@login_required
def saveNFREditor():
    try:
        data = request.json
        newEditorID = saveEditors(data, 'NFR')
        return Response(json.dumps(newEditorID), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/updateNFREditor", methods=["POST"])
@login_required
def updateNFREditor():
    try:
        data = request.json
        updateEditor(data, 'NFR')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/saveSQLEditor", methods=["POST"])
@login_required
def saveSQLEditor():
    try:
        data = request.json
        newEditorID = saveEditors(data, 'SQL')
        return Response(json.dumps(newEditorID), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/updateSQLEditor", methods=["POST"])
@login_required
def updateSQLEditor():
    try:
        data = request.json
        updateEditor(data, 'SQL')
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/loadEditor", methods=["GET"])
@login_required
def load_Editor():
    try:
        data = request.args
        EditorFromDB = loadEditor(data.get('ID'))
        return Response(json.dumps(EditorFromDB.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/getNFRWeights", methods=['GET'])
@login_required
def get_weigths():
    try:
        weights = getNFRWeights()
        return Response(json.dumps(weights), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@editors.route("/getNFRAttributes", methods=['GET'])
@login_required
def get_attributes():
    try:
        weights = getNFRAtrributes()
        return Response(json.dumps(weights), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@editors.route("/matrix", methods=['GET'])
@login_required
def get_converted_matrix():
    try:
        data = request.args
        matrix = loadEditor(data.get('ID'))
        return Response(json.dumps(matrix.convertedData), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    