from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

auth = Blueprint('auth', __name__)

# Import Utils
from modules.utils.auth_utils import *

@auth.route("/Login", methods = ['POST'])
def Login_route():
    try:
        jsonData = request.json
        result = Login(jsonData)
        if result[1] != 'Wrong Password or Username':
            resp = Response(json.dumps(result[0]), status=200, mimetype='application/json')
            resp.set_cookie('LoggedUser', result[1])
        else:
            resp = Response(json.dumps(result[1]), status=401, mimetype='application/json')
        return resp
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@auth.route("/Signup", methods = ['POST'])
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
def Logout_route():
    try:
        resp = Response(status=200, mimetype='application/json')
        resp.delete_cookie('LoggedUser')
        return resp
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')