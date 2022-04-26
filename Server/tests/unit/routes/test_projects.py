import pytest


def test_successful_save_project(client, setup_user_projects):
    test_project: dict = {
        "ProjectID": 2,
        "name": "project",
        "Description": "project for saving the humanity"
    }

    response = client.post("/projects/saveProject", json=test_project)
    assert response.status_code == 200


def test_failed_save_project_empty_data(client, setup_user_projects):
    response = client.post("/projects/saveProject")
    assert response.status_code == 400


def test_failed_save_project_not_logged_in(client):
    response = client.post("/projects/saveProject")
    assert response.status_code == 401


def test_successful_load_project(client, setup_user_projects):
    response = client.get("/projects/loadProject/9999")

    assert response.status_code == 400


def test_failed_load_project_not_logged_in(client):
    response = client.get("/projects/loadProject/1")

    assert response.status_code == 401


def test_failed_load_project(client, setup_user_projects):
    response = client.get("/projects/loadProject/some_not_existing_project_number")

    assert response.status_code == 400


def test_successful_update_details(client, setup_user_projects):
    new_data = {
        "projectID": 1,
        "details": {
            "Description": "new description"
        }
    }

    response = client.post("/projects/updateDetails", json=new_data)
    response.status_code = 200


def test_failed_update_details(client, setup_user_projects):
    response = client.post("/projects/updateDetails", json={})
    assert response.status_code == 400


def test_failed_update_details_not_logged_in(client):
    response = client.post("/projects/updateDetails", json={})
    assert response.status_code == 401


def test_failed_get_project_members(client, setup_user_projects):
    response = client.get("/projects/getMembers/9999?startIndex=0&endIndex=1")

    assert response.status_code == 400


def test_failed_get_project_members_not_logged_in(client):
    response = client.get("/projects/getMembers/1?startIndex=0&endIndex=1")

    assert response.status_code == 401


@pytest.fixture
def setup_new_member(client, setup_user_projects):
    new_member_credentials = {
        "Username": "new_member_for_project",
        "password": "12345"
    }

    client.post("/auth/Signup", json=new_member_credentials)
    return new_member_credentials


def test_failed_add_member(client, setup_user_projects, setup_new_member):
    new_member = {
        "ProjectID": 9999,
        "Member": f"{setup_new_member.get('Username')}"
    }
    response = client.post("/projects/addMember", json=new_member)

    assert response.status_code == 400


def test_successful_update_weights(client, setup_user_projects, get_last_project_id):
    new_data = {
        "ProjectID": get_last_project_id,
        "Weights": {
            "UML": 0.1,
            "SQL": 0.8,
            "NFR": 0.1
        }
    }

    response = client.post("/projects/updateWeights", json=new_data)
    assert response.status_code == 200


def test_successful_update_weights_zeros(client, setup_user_projects, get_last_project_id):
    new_data = {
        "ProjectID": get_last_project_id,
        "Weights": {
            "UML": 0,
            "SQL": 0,
            "NFR": 0
        }
    }

    response = client.post("/projects/updateWeights", json=new_data)
    assert response.status_code == 200


def test_failed_update_weights(client, setup_user_projects):
    new_data = {
        "ProjectID": 999999,
        "Weights": {
            "UML": 0.1,
            "SQL": 0.8,
            "NFR": 0.1
        }
    }

    response = client.post("/projects/updateWeights", json=new_data)
    assert response.status_code == 400
