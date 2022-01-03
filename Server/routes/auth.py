import json

from flask import Blueprint, request, session
from flask.wrappers import Response
from flask_login import login_required, logout_user, login_user

from modules.utils.auth_utils import *

auth = Blueprint('auth', __name__)


@auth.route("/Login", methods=['POST'])
def Login_route():
    try:
        jsonData = request.json
        result = Login(jsonData)
        if result[1] != 'Wrong Password or Username':
            resp = Response(json.dumps(result[0]), status=200, mimetype='application/json')
            login_user(result[1], remember=True)
            session['admin'] = result[0]
        else:
            resp = Response(json.dumps(result[1]), status=401, mimetype='application/json')
        return resp
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@auth.route("/Signup", methods=['POST'])
def Signup_route():
    try:
        res = Signup(request)
        if res:
            return Response(status=200, mimetype='application/json')
        else:
            return Response('Username is already exists.', status=409, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@auth.route("/Logout", methods=['POST', 'GET'])
@login_required
def Logout_route():
    try:
        resp = Response(status=200, mimetype='application/json')
        logout_user()
        return resp
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')
