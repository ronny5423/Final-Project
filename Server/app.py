from flask import Flask, request
from flask.wrappers import Response
from flask_pymongo import PyMongo

import json

app = Flask(__name__, static_url_path='')
app.config["MONGO_URI"] = "mongodb://localhost:27017/DBSelection"

from database import db
db.initMongoDB(app)

# import routes
from routes.auth import auth
from routes.editors import editors
app.register_blueprint(auth, '/auth')
app.register_blueprint(editors, '/editors')

@app.route("/")
def default():
    return app.send_static_file('index.html')

@app.route("/testArea")
def testArea():
    return "This is a Test Area."


if __name__ == "__main__":
    app.run(debug=True)
