from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager

from database import db
from modules.User import User
from routes.admin import admin
from routes.auth import auth
from routes.editors import editors
from routes.projects import projects
from routes.users import users


def get_app_with_config(config):
    app = Flask(__name__, static_url_path='')

    app.config.from_object(config)
    app.config['SECRET_KEY'] = 'some-very-strong-confidential-mosad-bibi-netanyahu-secret-key'
    app.config['SERVR_NAME'] = 'https://rps.ise.bgu.ac.il/njsw27'

    CORS(app, supports_credentials=True)
    app.config['CORS_HEADERS'] = 'Content-Type'

    db.initMongoDB(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User(user_id, None, None)

    app.register_blueprint(auth, url_prefix='/auth')
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

    return app
