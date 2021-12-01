from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

projects = Blueprint('projects', __name__)

# from database import db
from modules.utils.project_utils import *

@projects.route("/saveProject", methods = ["POST"])
def save_Project():
    try:
        data = request.json
        saveProject(data)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/loadProject", methods=["GET"])
def load_Project():
    try:
        data = request.json
        project = loadProject(data.get('ID'))
        return Response(json.dumps(project.__dict__), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')