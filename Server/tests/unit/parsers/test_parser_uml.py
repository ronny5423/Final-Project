from modules.parsers.parserUML import *


def test_base_uml_parser():
    json_uml_for_test = {
        "class": "GraphLinksModel",
        "copiesArrays": True,
        "copiesArrayObjects": True,
        "linkKeyProperty": "key",
        "linkLabelKeysProperty": "labelKeys",
        "modelData": {"position": "-209 -431.83671875"},
        "nodeDataArray": [
            {"type": "Class", "name": "Class", "properties": [], "methods": [], "key": -1,
             "loc": "-20 -80"},
            {"type": "Class", "name": "Bss", "properties": [], "methods": [], "key": -2,
             "loc": "-120 10"}
        ],
        "linkDataArray": [
            {
                "category": "Linkble",
                "name": "association",
                "RoleFrom": "from",
                "RoleTo": "to",
                "MultiFrom": "0",
                "MultiTo": "1", "toArrow": "",
                "points": [4.84765625, -80, 14.84765625, -80, 14.84765625, -50.83671874999999,
                           -2.576171875,
                           -50.83671874999999, -20, -50.83671874999999, -20, -60.83671874999999],
                "from": -1,
                "to": -1,
                "labelKeys": [],
                "key": -1},
            {
                "name": "generalization",
                "toArrow": "Triangle",
                "points": [-120, 29.16328125, -120, 39.16328125, -93.82421875, 39.16328125, -93.82421875,
                           -19.16328125,
                           -120, -19.16328125, -120, -9.16328125],
                "from": -2,
                "to": -2,
                "labelKeys": [],
                "key": -2}
        ]
    }

    expected_results = np.zeros((2, 2))
    expected_results[0][0] = 1
    expected_results[1][1] = 1

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))

    result = uml_parser(uml_json=json_uml_for_test)

    assert result.get('matrix_classes') == expected_matrix


def test_uml_parser_one_class():
    json_uml_for_test = {
        "class": "GraphLinksModel",
        "copiesArrays": True,
        "copiesArrayObjects": True,
        "linkKeyProperty": "key",
        "linkLabelKeysProperty": "labelKeys",
        "modelData": {"position": "-209 -431.83671875"},
        "nodeDataArray": [
            {"type": "Class", "name": "Class", "properties": [], "methods": [], "key": -1,
             "loc": "-20 -80"},
        ],
        "linkDataArray": [
            {"category": "Linkble", "name": "association", "RoleFrom": "from", "RoleTo": "to",
             "MultiFrom": "0",
             "MultiTo": "1",
             "toArrow": "",
             "points": [4.84765625, -80, 14.84765625, -80, 14.84765625, -50.83671874999999,
                        -2.576171875,
                        -50.83671874999999, -20, -50.83671874999999, -20, -60.83671874999999],
             "from": -1,
             "to": -1,
             "labelKeys": [],
             "key": -1}
        ]
    }

    expected_results = np.zeros((1, 1))
    expected_results[0][0] = 1

    expected_matrix = json.dumps(dict(enumerate(expected_results.flatten(), 1)))

    result = uml_parser(uml_json=json_uml_for_test)

    assert result.get('matrix_classes') == expected_matrix
