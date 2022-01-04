from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

admin = Blueprint('admin', __name__)

# Import Utils
from modules.utils.admin_utils import *

@admin.route("/updateAHP", methods=['POST'])
def update_ahp():
    try:
        data = request.json
        updateAHP(data)
        return Response(status=200, mimetype='applica)tion/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/AHP", methods=['GET'])
def get_ahp():
    try:
        ahp = getAHP()
        return Response(json.dumps(ahp), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/updateNFR", methods=['POST'])
def update_nfr():
    try:
        data = request.json
        updateNFR(data)
        return Response(status=200, mimetype='applica)tion/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/NFR", methods=['GET'])
def get_nfr():
    try:
        ahp = getNFR()
        return Response(json.dumps(ahp), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/getUsers", methods=['GET'])
def get_users():
    try:
        queryData = request.args
        users = getUsers([int(queryData.get('startIndex')), int(queryData.get('endIndex'))])
        return Response(json.dumps(users), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/getProjects", methods=['GET'])
def get_projects():
    try:
        queryData = request.args
        users = getProjects([int(queryData.get('startIndex')), int(queryData.get('endIndex'))])
        return Response(json.dumps(users), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')    