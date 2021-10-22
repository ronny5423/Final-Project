from flask import Flask, request
from flask_mongoengine import MongoEngine
import time

app = Flask(__name__, static_url_path='')


# app.config['SERVER_NAME'] = 'https://rps.ise.bgu.ac.il/njsw27'

app.config['MONGODB_SETTINGS'] = {
    'db': 'your_database',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()

db.init_app(app)

class User(db.Document):
    Username = db.StringField()
    password = db.StringField()

@app.route("/")
def default():
    return app.send_static_file('index.html')

@app.route("/Login", methods = ['POST'])
def home():
    UsernameForm = request.form['Username']
    passwordForm = request.form['password']
    UserMongoDB = User.objects(name=UsernameForm).first()
    if UserMongoDB and UserMongoDB['password'] == passwordForm:
        return True
    else:
        return False


@app.route("/testArea")
def testArea():
    return "This is a Test Area."


if __name__ == "__main__":
    app.run(debug=True)
