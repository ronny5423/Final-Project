import pymongo
import pytest

from config import TestConfig


@pytest.fixture
def setup_update_password(client):
    credentials = {"Username": "user_for_password_update",
                   "password": "12345"}

    mongo_client = pymongo.MongoClient(TestConfig.MONGO_URI)
    db = mongo_client[TestConfig.MONGO_DBNAME]
    if "Users" not in db.list_collection_names():
        db.create_collection("Users")

    client.post("/auth/Signup", json=credentials)
    client.post("/auth/Login", json=credentials)
    return credentials


def test_successful_update_password(client, setup_update_password):
    new_credentials = {"password": "54321"}
    update_password_response = client.post("/users/updatePassword", json=new_credentials)
    username = setup_update_password.get("Username")
    new_credentials.update(Username=username)
    login_response = client.post("/auth/Login", json=new_credentials)

    assert update_password_response.status_code == 200
    assert login_response.status_code == 200

    revert_password = {"password": "12345"}
    revert_response = client.post("/users/updatePassword", json=revert_password)
    assert revert_response.status_code == 200


def test_failed_update_password_not_logged_in(client):
    update_password_response = client.post("/users/updatePassword")

    assert update_password_response.status_code == 401


def test_successful_get_project_from_logged_in_user(client, setup_user_projects):
    response = client.get("/users/getProjects?startIndex=0&endIndex=1")

    assert response.status_code == 200


def test_failed_get_project_no_query_params(client, setup_user_projects):
    response = client.get("/users/getProjects")

    assert response.status_code == 400


def test_failed_get_project_not_logged_in(client):
    response = client.get("/users/getProjects")

    assert response.status_code == 401
