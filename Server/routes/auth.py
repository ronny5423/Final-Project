from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

auth = Blueprint('auth', __name__)

# Import Utils
from modules.utils.auth_utils import *

@auth.route("/Login", methods = ['POST'])
def Login_route():
    try:
        result = Login(request)
        resp = Response(json.dumps(result[0]), status=200, mimetype='application/json')
        resp.set_cookie('LoggedUser', result[1])
        return resp
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')


@auth.route("/Signup", methods = ['POST'])
def Signuo_route():
    try:
        Signup(request)
        return Response(status=200, mimetype='application/json')
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