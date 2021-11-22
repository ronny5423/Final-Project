import numpy as np

umlJ = {"class": "GraphLinksModel",
        "copiesArrays": True,
        "copiesArrayObjects": True,
        "linkKeyProperty": "key",
        "linkLabelKeysProperty": "labelKeys",
        "modelData": {"position": "-209 -431.83671875"},
        "nodeDataArray": [
            {"type": "Class", "name": "Class", "properties": [], "methods": [], "key": -1, "loc": "-20 -80"},
            {"type": "Class", "name": "Bss", "properties": [], "methods": [], "key": -2, "loc": "-120 10"}
        ],
        "linkDataArray": [
            {"category": "Linkble", "name": "association", "RoleFrom": "from", "RoleTo": "to", "MultiFrom": "0",
             "MultiTo": "1", "toArrow": "",
             "points": [4.84765625, -80, 14.84765625, -80, 14.84765625, -50.83671874999999, -2.576171875,
                        -50.83671874999999, -20, -50.83671874999999, -20, -60.83671874999999], "from": -1, "to": -1,
             "labelKeys": [], "key": -1},
            {"name": "generalization", "toArrow": "Triangle",
             "points": [-120, 29.16328125, -120, 39.16328125, -93.82421875, 39.16328125, -93.82421875, -19.16328125,
                        -120, -19.16328125, -120, -9.16328125], "from": -2, "to": -2, "labelKeys": [], "key": -2}
        ]}


def increment_matrix_table_cell(matrix, class_from, class_to):
    i = max(class_from[1], class_to[1])
    j = min(class_from[1], class_to[1])
    matrix[i][j] += 1


def uml_parser(uml_json):
    classes = {}
    idx = 0  # index of class in matrix
    for node in uml_json["nodeDataArray"]:
        if "type" in node and (node["type"] == "Class" or node["type"] == "Association Class"):
            classes[node["key"]] = [node["name"], idx]
            idx += 1

    matrix_classes = np.zeros((idx, idx))
    for link in uml_json["linkDataArray"]:
        if link["name"] == "generalization" or link["name"] == "association":
            class_to = classes[link["to"]]
            class_from = classes[link["from"]]
            increment_matrix_table_cell(matrix_classes, class_to, class_from)
        else:
            matrix_classes = 0
            asc_class = 0
            if link["to"] not in classes:
                link_label = link["to"]
                asc_class = link["from"]
            else:
                link_label = link["from"]
                asc_class = link["to"]

            for link2 in uml_json["linkDataArray"]:
                if len(link2["labelKeys"]) == 1 and link2["labelKeys"][0] == link_label:
                    asc_to = link2["to"]
                    asc_from = link2["from"]
                    increment_matrix_table_cell(matrix_classes, classes[asc_to], classes[asc_class])
                    increment_matrix_table_cell(matrix_classes, classes[asc_from], classes[asc_class])
                    break

    res = {'classes': classes, 'matrix_classes': matrix_classes}
    return res

