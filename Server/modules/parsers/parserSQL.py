import re
import itertools as it
import numpy as np

sqlJson = {
    "0": {"name": "abc", "tpm": 45, "selectable": True, "query": "return all from User, Person A as s, Person A as b"},
    "1": {"name": "query", "tpm": 35, "selectable": True, "query": "Update User Set Person A"},
    "2": {"name": "query", "tpm": 35, "selectable": True, "query": "Insert into Person A where count(all)= ?"},
    "3": {"name": "query", "tpm": 35, "selectable": True, "query": "Delete User where all= ?"},
    "4": {"name": "query", "tpm": 35, "selectable": True, "query": "CONNECT Person A, User WHERE name = ? "
                                                                   "and title = ? SET REL=actor"}}

umlJ = {"class": "GraphLinksModel",
        "copiesArrays": True,
        "copiesArrayObjects": True,
        "linkKeyProperty": "key",
        "linkLabelKeysProperty": "labelKeys",
        "modelData": {"position": "-209 -431.83671875"},
        "nodeDataArray": [
            {"type": "Class", "name": "Class", "properties": [], "methods": [], "key": -1, "loc": "-20 -80"},
            {"type": "Class", "name": "Bss", "properties": [], "methods": [], "key": -2, "loc": "-120 10"},
            {"type": "Class", "name": "User", "properties": [], "methods": [], "key": -3, "loc": "-20 -80"},
            {"type": "Class", "name": "Person A", "properties": [], "methods": [], "key": -4, "loc": "-120 10"}
        ],
        "linkDataArray": [
            {"category": "Linkble", "name": "association", "RoleFrom": "from", "RoleTo": "to", "MultiFrom": "0",
             "MultiTo": "1", "toArrow": "",
             "points": [4.84765625, -80, 14.84765625, -80, 14.84765625, -50.83671874999999, -2.576171875,
                        -50.83671874999999, -20, -50.83671874999999, -20, -60.83671874999999], "from": -3, "to": -4,
             "labelKeys": [], "key": -1},
            {"name": "generalization", "toArrow": "Triangle",
             "points": [-120, 29.16328125, -120, 39.16328125, -93.82421875, 39.16328125, -93.82421875, -19.16328125,
                        -120, -19.16328125, -120, -9.16328125], "from": -2, "to": -2, "labelKeys": [], "key": -2}
        ]}


def increment_matrix_table_cell(matrix, class_from, class_to, increase):
    i = max(class_from[1], class_to[1])
    j = min(class_from[1], class_to[1])
    matrix[i][j] += increase


def get_classes_return_query(query_arr, classes_names):
    query_classes = {}
    index = -1
    try:
        index = next(i for i, v in enumerate(query_arr) if v.lower() == 'from')
    except StopIteration:
        return {}

    idx = index + 1
    while idx < len(query_arr) and query_arr[idx].lower() != 'where':
        if query_arr[idx] == '':
            idx += 1
            continue
        class_name = None
        tmp_idx = idx
        exist = False
        for i in range(tmp_idx, tmp_idx + 4):
            if i >= len(query_arr) or query_arr[i].lower() == 'where':
                break
            if class_name is None:
                class_name = query_arr[i]
            else:
                class_name += " " + query_arr[i]

            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
                idx = i
                exist = True
                break
            else:
                idx += 1

        if not exist:
            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
        if idx + 1 < len(query_arr) and query_arr[idx + 1].lower() == "as":
            idx += 2

        idx += 1

    return query_classes


def get_classes_update_query(query_arr, classes_names):
    query_classes = {}
    idx = 1
    while idx < len(query_arr) and query_arr[idx].lower() != 'set':
        if query_arr[idx] == '':
            idx += 1
            continue
        class_name = None
        while idx < len(query_arr) and query_arr[idx].lower() != "set" and query_arr[idx][-1] != ',':
            if query_arr[idx] == '':
                idx += 1
                continue
            if class_name is None:
                class_name = query_arr[idx]
            else:
                class_name += " " + query_arr[idx]
            idx += 1
        if idx >= len(query_arr) or query_arr[idx].lower() == "set":
            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
            break
        else:
            if class_name is None:
                class_name = query_arr[idx][:-1]
            else:
                class_name += " " + query_arr[idx][:-1]
            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
        idx += 1

    if idx < len(query_arr) and query_arr[idx].lower() == 'set':
        idx += 1
        while idx < len(query_arr) and query_arr[idx].lower() != 'where':
            if query_arr[idx] == '':
                idx += 1
                continue
            class_name = None
            while idx < len(query_arr) and query_arr[idx].lower() != "where" and query_arr[idx][-1] != ',':
                if query_arr[idx] == '':
                    idx += 1
                    continue
                if class_name is None:
                    class_name = query_arr[idx]
                else:
                    class_name += " " + query_arr[idx]
                idx += 1
            if idx >= len(query_arr) or query_arr[idx].lower() == "where":
                if class_name in classes_names:
                    if class_name in query_classes:
                        query_classes[class_name] += 1
                    else:
                        query_classes[class_name] = 1
                break
            else:
                if class_name is None:
                    class_name = query_arr[idx][:-1]
                else:
                    class_name += " " + query_arr[idx][:-1]
                if class_name in classes_names:
                    if class_name in query_classes:
                        query_classes[class_name] += 1
                    else:
                        query_classes[class_name] = 1
            idx += 1
    return query_classes


def get_classes_insert_query(query_arr, classes_names):
    query_classes = {}
    idx = 2
    class_name = None
    while idx < len(query_arr) and query_arr[idx].lower() != 'where':
        if query_arr[idx] == '':
            idx += 1
            continue
        if class_name is None:
            class_name = query_arr[idx]
        else:
            class_name += " " + query_arr[idx]
        idx += 1
    if class_name in classes_names:
        if class_name in query_classes:
            query_classes[class_name] += 1
        else:
            query_classes[class_name] = 1
    return query_classes


def get_classes_delete_query(query_arr, classes_names):
    query_classes = {}
    idx = 1
    class_name = None
    while idx < len(query_arr) and query_arr[idx].lower() != 'where':
        if query_arr[idx] == '':
            idx += 1
            continue
        if class_name is None:
            class_name = query_arr[idx]
        else:
            class_name += " " + query_arr[idx]
        idx += 1
    if class_name in classes_names:
        if class_name in query_classes:
            query_classes[class_name] += 1
        else:
            query_classes[class_name] = 1
    return query_classes


def get_classes_connect_query(query_arr, classes_names):
    query_classes = {}
    idx = 1
    while idx < len(query_arr) and query_arr[idx].lower() != 'where':
        if query_arr[idx] == '':
            idx += 1
            continue
        class_name = None
        tmp_idx = idx
        exist = False
        for i in range(tmp_idx, tmp_idx + 4):
            if i >= len(query_arr) or query_arr[i].lower() == 'where':
                break
            if class_name is None:
                class_name = query_arr[i]
            else:
                class_name += " " + query_arr[i]

            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
                idx = i
                exist = True
                break
            else:
                idx += 1

        if not exist:
            if class_name in classes_names:
                if class_name in query_classes:
                    query_classes[class_name] += 1
                else:
                    query_classes[class_name] = 1
        if idx + 1 < len(query_arr) and query_arr[idx + 1].lower() == "as":
            idx += 2

        idx += 1

    return query_classes


def update_sql_matrix(matrix_classes, query_classes, classes, classes_names):
    for class_name in query_classes:
        if query_classes[class_name] > 1:
            class_key = classes_names[class_name]
            increment_matrix_table_cell(matrix_classes, classes[class_key], classes[class_key],
                                        query_classes[class_name] - 1)
    classes_combinations = list(it.combinations(query_classes.keys(), 2))
    for class_comb in classes_combinations:
        first_class = class_comb[0]
        second_class = class_comb[1]
        first_class_key = classes_names[first_class]
        second_class_key = classes_names[second_class]
        increase = max(query_classes[first_class], query_classes[second_class])
        increment_matrix_table_cell(matrix_classes, classes[first_class_key], classes[second_class_key], increase)


def calculate_query_complexity(uml_json, query_classes, classes_names, query):
    classes_indexes = set()
    for class_name in query_classes:
        if query_classes[class_name] > 1:
            return 5
        classes_indexes.add(classes_names[class_name])
    query_lower = query.lower()
    if 'path' in query_lower:
        return 5

    links_array = uml_json["linkDataArray"]
    for link in links_array:
        to_node = link["to"]
        from_node = link["from"]
        if to_node in classes_indexes and from_node in classes_indexes:
            return 4

    operators = ["min", "max", "count", "type", "math"]
    if any(s in query_lower for s in operators):
        return 3

    if 'where' in query_lower:
        return 2

    return 1


def sql_parser(sql_json, uml_json):
    classes = {}
    classes_names = {}
    query_classes = {}
    queries_complexity = {}
    idx = 0  # index of class in matrix
    for node in uml_json["nodeDataArray"]:
        if "type" in node and (node["type"] == "Class" or node["type"] == "Association Class"):
            classes[node["key"]] = [node["name"], idx]
            classes_names[node["name"]] = node["key"]
            idx += 1

    matrix_classes = np.zeros((idx, idx))

    for key in sql_json:
        if sql_json[key]['selectable']:
            query = sql_json[key]['query']
            _RE_COMBINE_WHITESPACE = re.compile(r"\s+")
            query = _RE_COMBINE_WHITESPACE.sub(" ", query).strip()
            query_arr = re.split("[, ]", query)
            if query_arr[0].lower() == 'return':
                query_classes = get_classes_return_query(query_arr, classes_names)
            elif query_arr[0].lower() == 'update':
                query = query.replace(",", ", ")
                query = query.replace(" ,", ",")
                query = _RE_COMBINE_WHITESPACE.sub(" ", query).strip()
                query_arr = query.split(" ")
                query_classes = get_classes_update_query(query_arr, classes_names)
            elif query_arr[0].lower() == 'insert':
                query_classes = get_classes_insert_query(query_arr, classes_names)
            elif query_arr[0].lower() == 'delete':
                query_classes = get_classes_delete_query(query_arr, classes_names)
            elif query_arr[0].lower() == 'connect':
                query_classes = get_classes_connect_query(query_arr, classes_names)
            else:
                continue
            update_sql_matrix(matrix_classes, query_classes, classes, classes_names)
            complexity = calculate_query_complexity(uml_json, query_classes, classes_names, query)
            queries_complexity[key] = complexity

    res = {'classes': classes, 'matrix_classes': matrix_classes, 'queries_complexity': queries_complexity}
    return res

