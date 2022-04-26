from modules.parsers.parserSQL import *

uml_json_for_test = {"class": "GraphLinksModel",
                     "copiesArrays": True,
                     "copiesArrayObjects": True,
                     "linkKeyProperty": "key",
                     "linkLabelKeysProperty": "labelKeys",
                     "modelData": {"position": "-209 -431.83671875"},
                     "nodeDataArray": [
                         {"type": "Class", "name": "Class", "properties": [], "methods": [], "key": -1,
                          "loc": "-20 -80"},
                         {"type": "Class", "name": "Bss", "properties": [], "methods": [], "key": -2, "loc": "-120 10"},
                         {"type": "Class", "name": "User", "properties": [], "methods": [], "key": -3,
                          "loc": "-20 -80"},
                         {"type": "Class", "name": "Person A", "properties": [], "methods": [], "key": -4,
                          "loc": "-120 10"}
                     ],
                     "linkDataArray": [
                         {"category": "Linkble", "name": "association", "RoleFrom": "from", "RoleTo": "to",
                          "MultiFrom": "0",
                          "MultiTo": "1", "toArrow": "",
                          "points": [4.84765625, -80, 14.84765625, -80, 14.84765625, -50.83671874999999, -2.576171875,
                                     -50.83671874999999, -20, -50.83671874999999, -20, -60.83671874999999], "from": -3,
                          "to": -4,
                          "labelKeys": [], "key": -1},
                         {"name": "generalization", "toArrow": "Triangle",
                          "points": [-120, 29.16328125, -120, 39.16328125, -93.82421875, 39.16328125, -93.82421875,
                                     -19.16328125,
                                     -120, -19.16328125, -120, -9.16328125], "from": -2, "to": -2, "labelKeys": [],
                          "key": -2}
                     ]}


def test_base_parser_sql():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 45,
            "selectable": True,
            "query": "return all from User, Person A as s, Person A as b"
        }
    }

    expected_results = np.zeros((4, 4))
    expected_results[3][3] = 1
    expected_results[2][3] = 2
    expected_results[3][2] = 2

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_base_parser_sql_query1():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 35,
            "selectable": True,
            "query": "Update User Set Person A"
        }
    }

    expected_results = np.zeros((4, 4))
    expected_results[2][3] = 1
    expected_results[3][2] = 1

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_base_parser_sql_query2():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 0,
            "selectable": True,
            "query": "Update User Set Person A"
        }
    }

    expected_results = np.zeros((4, 4))
    expected_results[2][3] = 1
    expected_results[3][2] = 1

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_base_parser_sql_query3():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 35,
            "selectable": True,
            "query": "Insert into Person A where count(all)= ?"
        }
    }

    expected_results = np.zeros((4, 4))

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_base_parser_sql_query_not_existing_class():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 35,
            "selectable": True,
            "query": "Delete NotExistingClass where all=?"
        }
    }

    expected_results = np.zeros((4, 4))

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_base_parser_sql_query5():
    sql_json_for_test = {
        "0": {
            "name": "abc",
            "tpm": 35,
            "selectable": True,
            "query": "CONNECT Person A, User WHERE name = ? and title = ? SET REL=actor"
        }
    }

    expected_results = np.zeros((4, 4))
    expected_results[2][3] = 1
    expected_results[3][2] = 1

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))
    result = sql_parser(sql_json=sql_json_for_test, uml_json=uml_json_for_test)

    assert result.get('matrix_classes') == expected_matrix
