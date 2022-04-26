import json

from flask import Blueprint, request
from flask.wrappers import Response
from flask_login import login_required

from modules.utils.project_utils import *

projects = Blueprint('projects', __name__)


@projects.route("/saveProject", methods=["POST"])
@login_required
def save_Project():
    try:
        projectID = saveProject(request)
        return Response(json.dumps(projectID), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/loadProject/<projectID>", methods=["GET"])
@login_required
def load_Project(projectID):
    try:
        project = loadProject(int(projectID))
        return Response(json.dumps(project), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/updateDetails", methods=['POST'])
@login_required
def update_details():
    try:
        data = request.json
        updateDetails(data)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/calculate", methods=["POST"])
@login_required
def calculate_results():
    try:
        data = request.json
        clacResults = calculateResults(data.get('projectID'), data.get('number'))
        return Response(json.dumps(clacResults), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/getResults/<projectID>", methods=["GET"])
@login_required
def get_results(projectID):
    try:
        clacResults = getResults(int(projectID))
        return Response(json.dumps(clacResults), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/getMembers/<projectID>", methods=["GET"])
@login_required
def project_members(projectID):
    try:
        queryData = request.args
        projectMembers = getProjectMembers(int(projectID), [int(queryData.get('startIndex')), int(queryData.get('endIndex'))])
        return Response(json.dumps(projectMembers), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/removeMembers/<projectID>/<member>", methods=["DELETE"])
@login_required
def remove_members(projectID, member):
    try:
        removeProjectMembers(int(projectID), member)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/addMember", methods=["POST"])
@login_required
def add_Member():
    try:
        jsonData = request.json
        addProjectMember(jsonData)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@projects.route("/getWeights/<projectID>", methods=['GET'])
@login_required
def get_weights(projectID):
    try:
        weights = getProjectWeights(int(projectID))
        return Response(json.dumps(weights), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')

@projects.route("/updateWeights", methods=['POST'])
@login_required
def update_weights():
    try:
        jsonData = request.json
        updateProjectWeights(jsonData)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@projects.route("/report/<projectID>", methods=['GET'])
@login_required
def get_report(projectID):
    try:
        report = createReport(int(projectID))
        return Response(report, status=200)
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
