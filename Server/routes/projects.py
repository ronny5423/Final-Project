from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

projects = Blueprint('projects', __name__)

# from database import db
from modules.utils.project_utils import *

@projects.route("/saveProject", methods = ["POST"])
def save_Project():
    try:
        projectID = saveProject(request)
        return Response(json.dumps(projectID), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/loadProject/<projectID>", methods=["GET"])
def load_Project(projectID):
    try:
        project = loadProject(projectID)
        return Response(json.dumps(project.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/getMembers/<projectID>", methods=["GET"])
def project_members(projectID):
    try:
        projectMembers = getProjectMembers(int(projectID))
        return Response(json.dumps(projectMembers), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@projects.route("/removeMembers/<projectID>/<member>", methods=["DELETE"])
def remove_members(projectID, member):
    try:
        removeProjectMembers(request, projectID, member)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/addMember", methods = ["POST"])
def add_Member():
    try:
        addProjectMember(request)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@projects.route("/getWeights/<projectID>", methods=['GET'])
def get_weights(projectID):
    #TODO: get project weights from DB
    try:
        weights = getProjectWeights(projectID)
        return Response(json.dumps(weights), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
