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
    
@projects.route("/loadProject", methods=["GET"])
def load_Project():
    try:
        project = loadProject(request)
        return Response(json.dumps(project.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/getMembers", methods=["GET"])
def project_members():
    try:
        projectMembers = getProjectMembers(request)
        return Response(json.dumps(projectMembers), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@projects.route("/removeMembers", methods=["POST"])
def remove_members():
    try:
        removeProjectMembers(request)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')