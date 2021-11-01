from flask import Blueprint, render_template, session, abort, request
from flask.wrappers import Response
from flask_mongoengine import MongoEngine
from flask_pymongo import PyMongo
import json


auth = Blueprint('auth', __name__)

auth.config["MONGO_URI"] = "mongodb://localhost:27017/DBSelection"
mongodb_client = PyMongo(auth)
db = mongodb_client.db

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