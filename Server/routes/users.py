import json

from flask import Blueprint, request
from flask.wrappers import Response
from flask_login import login_required

from modules.utils.user_utils import *

users = Blueprint('users', __name__)


@users.route('/updatePassword', methods=['POST'])
@login_required
def updatePassword():
    try:
        changePassword(request)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@users.route('/getProjects', methods=['GET'])
@login_required
def userProjects():
    try:
        data = getUserProjects(request)
        return Response(json.dumps(data), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@users.route('/leaveProject/<projectID>', methods=['DELETE'])
@login_required
def leave_project(projectID):
    try:
        leaveProject(int(projectID))
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
