from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

auth = Blueprint('auth', __name__)

# Import DB class
from database import db

# Import modules
from ..modules.User import User

@auth.route("/Login", methods = ['POST'])
def home():
    try:
        UsernameForm = request.json.get('Username')
        passwordForm = request.json.get('password')
        UserMongoDB = db.getOneUser({"Username": UsernameForm})
        if UserMongoDB and UserMongoDB.comparePassword(passwordForm):
            result = True
        else:
            result = False
        return Response(json.dumps(result), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')




@auth.route("/Signup", methods = ['POST'])
def Register():
    try:
        data = request.json
        newUser = User(data.get('Username'), data.get('password'))
        db.insertOneObject('Users', newUser)
    except Exception as e:
        return Response(json.dumps(str(e)), status=400, mimetype='application/json')