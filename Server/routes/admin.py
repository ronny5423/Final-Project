from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

admin = Blueprint('admin', __name__)

# Import Utils
from modules.utils.admin_utils import *

@admin.route("/changeWeights", methods=['POST'])
def change_weights():
    try:
        
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/getUsers/<indexes>", methods=['GET'])
def get_users(indexes):
    try:
        users = getUsers(json.loads(indexes))
        return Response(json.dumps(users), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@admin.route("/getProjects/<indexes>", methods=['GET'])
def get_projects(indexes):
    try:
        users = getProjects(json.loads(indexes))
        return Response(json.dumps(users), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')    