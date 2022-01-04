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
        project = loadProject(int(projectID))
        return Response(json.dumps(project), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/updateDetails", methods=['POST'])
def update_details():
    try:
        data = request.json
        updateDetails(data)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/calculate", methods=["POST"])
def calculate_results():
    try:
        data = request.json
        clacResults = calculateResults(data.get('projectID'), data.get('number'))
        return Response(json.dumps(clacResults), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/getResults/<projectID>", methods=["GET"])
def get_results(projectID):
    try:
        clacResults = getResults(int(projectID))
        return Response(json.dumps(clacResults), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')    

@projects.route("/getMembers/<projectID>", methods=["GET"])
def project_members(projectID):
    try:
        queryData = request.args
        projectMembers = getProjectMembers(int(projectID), [int(queryData.get('startIndex')), int(queryData.get('endIndex'))])
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
    try:
        weights = getProjectWeights(projectID)
        return Response(json.dumps(weights), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
