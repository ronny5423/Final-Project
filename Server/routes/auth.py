from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
import json

from database import db
auth = Blueprint('auth', __name__)

db = db.db

@auth.route("/Login", methods = ['POST'])
def home():
    UsernameForm = request.json.get('Username')
    passwordForm = request.json.get('password')
    UserMongoDB = db.Users.find_one({"Username": UsernameForm})
    if UserMongoDB and UserMongoDB['password'] == passwordForm:
        result = True
    else:
        result = False
    return Response(json.dumps(result), status=200, mimetype='application/json')




@auth.route("/Signup", methods = ['POST'])
def Register():
    data = request.json