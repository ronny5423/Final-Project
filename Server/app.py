from flask import Flask, request
from flask.wrappers import Response
from flask_mongoengine import MongoEngine
from flask_pymongo import PyMongo
import time
import json

app = Flask(__name__, static_url_path='')


# app.config['SERVER_NAME'] = 'https://rps.ise.bgu.ac.il/njsw27'

app.config['MONGODB_SETTINGS'] = {
    'db': 'your_database',
    'host': 'localhost',
    'port': 27017
}

app.config["MONGO_URI"] = "mongodb://localhost:27017/DBSelection"
mongodb_client = PyMongo(app)
db = mongodb_client.db

@app.route("/")
def default():
    return app.send_static_file('index.html')

@app.route("/Login", methods = ['POST'])
def home():
    UsernameForm = request.json.get('Username')
    passwordForm = request.json.get('password')
    UserMongoDB = db.Users.find_one({"Username": UsernameForm})
    if UserMongoDB and UserMongoDB['password'] == passwordForm:
        result = True
    else:
        result = False
    return Response(json.dumps(result), status=200, mimetype='application/json')


@app.route("/Signup", methods = ['POST'])
def Register():
    data = request.json
    

@app.route("/testArea")
def testArea():
    return "This is a Test Area."


if __name__ == "__main__":
    app.run(debug=True)
