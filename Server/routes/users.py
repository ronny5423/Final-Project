from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

users = Blueprint('users', __name__)

# Import modules
from modules.User import User

# Import Utils
from modules.utils.user_utils import *

@users.route('/updatePassword', methods=['POST'])
def updatePassword():
    try:
        data = request.json
        changePassword(data)
        return Response(status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
    
@users.route('/getProjects', methods=['POST', 'GET'])
def userProjects():
    try:
        data = getUserProjects(request)
        return Response(json.dumps(data), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')