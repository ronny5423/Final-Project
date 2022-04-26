import pymongo
import pytest

from app import get_app_with_config
from config import TestConfig

app = get_app_with_config(TestConfig)


@pytest.fixture
def application():
    yield app


@pytest.fixture
def client(application):
    return application.test_client()


@pytest.fixture
def setup_auth_tests(client):
    credentials = {"Username": "test_user",
                   "password": "Aa12345!"}
    mongo_client = pymongo.MongoClient(TestConfig.MONGO_URI)
    db = mongo_client[TestConfig.MONGO_DBNAME]
    if "Users" not in db.list_collection_names():
        db.create_collection("Users")

    client.post("/auth/Signup", json=credentials)
    yield credentials

    for collection in db.list_collection_names():
        db.drop_collection(collection)


@pytest.fixture
def setup_user_projects(application, client):
    credentials = {
        "Username": "some_user",
        "password": "Aa12345!"
    }

    project = {
        "ProjectID": 1,
        "name": "project",
        "Owner": "some_user",
        "Description": "some very cool and interesting project"
    }

    mongo_client = pymongo.MongoClient(TestConfig.MONGO_URI)
    db = mongo_client[TestConfig.MONGO_DBNAME]
    if "Users" not in db.list_collection_names():
        db.create_collection("Users")

    if "Projects" not in db.list_collection_names():
        db.create_collection("Projects")

    if "Constants" not in db.list_collection_names():
        db.create_collection("Constants")

    db["Constants"].insert_one({
        "Constant": "AHPWeights",
        "Weights": {
            "UML": 0.1,
            "SQL": 0.8,
            "NFR": 0.1
        }
    })

    db["Constants"].insert_one({
        "Constant": "NFRWeights",
        "Weights": {
            "Integrity": 0.8,
            "Consistency": 0.2
        }
    })

    db["Constants"].insert_one({
        "Constant": "NFRAttributes",
        "Attributes": {
            "Integrity": {
                "type": "range",
                "values": [
                    0,
                    1
                ],
                "defaultValue": 0.8
            },
            "Consistency": {
                "type": "select box",
                "values": {
                    "a": 1,
                    "b": 2,
                    "c": 3,
                    "d": 4
                },
                "defaultValue": [
                    "a",
                    1
                ]
            }
        }
    })

    db["Constants"].insert_one({
        "Constant": "Admins",
        "Admins": [
            "some_user"
        ]
    })

    client.post("auth/Signup", json=credentials)
    client.post("auth/Login", json=credentials)

    client.post("projects/saveProject", json=project)
    yield credentials

    for collection in db.list_collection_names():
        db.drop_collection(collection)


@pytest.fixture
def get_last_project_id():
    mongo_client = pymongo.MongoClient(TestConfig.MONGO_URI)
    db = mongo_client[TestConfig.MONGO_DBNAME]
    result = db.Projects.find_one(sort=[('ProjectID', pymongo.DESCENDING)])
    if result:
        return result.get('ProjectID')
    else:
        return 0
