def test_successful_save_uml_editor(client, setup_user_projects):
    test_uml_json = {
        "jsonFile": {
            "class": "GraphLinksModel",
            "copiesArrays": True,
            "copiesArrayObjects": True,
            "linkKeyProperty": "key",
            "linkLabelKeysProperty": "labelKeys",
            "modelData": {
                "position": "-277 -54.92470499915396"
            },
            "nodeDataArray": [{
                "type": "Class",
                "name": "Class B",
                "properties": [{
                    "name": "name"
                }],
                "methods": [],
                "key": -1,
                "loc": "-180 60"
            }, {
                "type": "Class",
                "name": "Class A",
                "properties": [],
                "methods": [],
                "key": -2,
                "loc": "200 60"
            }, {
                "type": "Class",
                "name": "Class C",
                "properties": [],
                "methods": [],
                "key": -3,
                "loc": "0 220"
            }, {
                "type": "Class",
                "name": "Class D",
                "properties": [],
                "methods": [],
                "key": -4,
                "loc": "-220 220"
            }],
            "linkDataArray": [{
                "category": "Linkble",
                "name": "association",
                "RoleFrom": "from",
                "RoleTo": "to",
                "MultiFrom": "0",
                "MultiTo": "1",
                "toArrow": "",
                "points": [-119.58134968834604, 60, -109.58134968834604, 60, 23.78549703082698, 60, 23.78549703082698,
                           60.00000000000001, 157.15234375, 60.00000000000001, 167.15234375, 60.00000000000001],
                "from": -1,
                "to": -2,
                "labelKeys": [],
                "key": -1
            }]
        },
        "projectID": 1
    }

    response = client.post("/editors/saveUMLEditor", json=test_uml_json)

    assert response.status_code == 200


def test_failed_save_uml_editor_empty_json(client, setup_user_projects):
    response = client.post("/editors/saveUMLEditor", json={})

    assert response.status_code == 400


def test_failed_update_uml_editor_not_valid(client, setup_user_projects):
    test_uml_json = {"some key": "not valid json"}

    response = client.post("/editors/updateUMLEditor", json=test_uml_json)
    assert response.status_code == 400


def test_failed_save_nfr_editor_not_valid(client, setup_user_projects):
    test_nfr_json = {
        "some key": "not valid json"
    }

    response = client.post("/editors/saveNFREditor", json=test_nfr_json)
    assert response.status_code == 400


def test_failed_save_nfr_editor_empty_json(client, setup_user_projects):
    response = client.post("/editors/saveNFREditor", json={})

    assert response.status_code == 400


def test_failed_save_sql_editor_not_valid(client, setup_user_projects):
    test_sql_json = {"some key": "not valid json"}

    response = client.post("/editors/saveSQLEditor", json=test_sql_json)
    assert response.status_code == 400


def test_failed_save_sql_editor_empty_json(client, setup_user_projects):
    response = client.post("/editors/saveSQLEditor", json={})

    assert response.status_code == 400


def test_successful_get_nfr_weights(client, setup_user_projects):
    response = client.get("/editors/getNFRWeights")
    json_response = response.get_json()
    weights = json_response.get("Weights")

    assert response.status_code == 200
    assert weights.get("Integrity") == 0.8
    assert weights.get("Consistency") == 0.2


def test_failed_get_nfr_weights_not_logged_in(client):
    response = client.get("/editors/getNFRWeights")

    assert response.status_code == 401


def test_successful_get_nfr_attributes(client, setup_user_projects):
    response = client.get("/editors/getNFRAttributes")
    response_json = response.get_json()
    attributes = response_json.get("Attributes")

    assert response.status_code == 200
    assert attributes.get("Integrity").get("defaultValue") == 0.8


def test_failed_get_nfr_attributes_not_logged_in(client):
    response = client.get("/editors/getNFRAttributes")

    assert response.status_code == 401


def test_get_converted_matrix(client, setup_user_projects):
    response = client.get("/editors/matrix")
    assert response.status_code == 400


def test_get_converted_matrix_not_logged_in(client):
    response = client.get("/editors/matrix")
    assert response.status_code == 401


