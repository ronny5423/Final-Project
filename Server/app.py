from flask import Flask, request
from flask.wrappers import Response
from flask_pymongo import PyMongo
from flask_cors import CORS

import json

app = Flask(__name__, static_url_path='')
app.config["MONGO_URI"] = "mongodb://localhost:27017/DBSelection"
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


from database import db
db.initMongoDB(app)

# import routes
from routes.auth import auth
app.register_blueprint(auth, url_prefix='/auth')

# @app.before_request
# def isLoggedUser():
#     if not request.cookies.get('LoggedUser'):
#         return Response('User must logged in.', status=405, mimetype='application/json')

from routes.editors import editors
from routes.projects import projects
from routes.users import users
from routes.admin import admin
app.register_blueprint(editors, url_prefix='/editors')
app.register_blueprint(projects, url_prefix='/projects')
app.register_blueprint(users, url_prefix='/users')
app.register_blueprint(admin, url_prefix='/admin')

@app.route("/")
def default():
    return app.send_static_file('index.html')

@app.route("/testArea")
def testArea():
    return "This is a Test Area."


if __name__ == "__main__":
    app.run(debug=True)
