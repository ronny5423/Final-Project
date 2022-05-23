import pymongo
import json
import re
import copy
import itertools
from modules.parsers.parserSQL import get_classes_return_query, get_classes_update_query, get_classes_insert_query, \
    get_classes_delete_query, get_classes_connect_query

from database import *

def remove_list_duplicates(lst):
    return list(dict.fromkeys(lst))


def find_object_by_key_in_list(arr, key):
    for x in arr:
        if "key" in x and x["key"] == key:
            return x
    return None


def get_query_to_class_list_obj(sql):
    query_to_class_list_obj = {}
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    for cls, queries_arr in classes_queries.items():
        for query_key in queries_arr:
            if query_key in query_to_class_list_obj:
                query_to_class_list_obj[query_key].append(cls)
            else:
                query_to_class_list_obj[query_key] = [cls]
    return query_to_class_list_obj


def convert_classes_queries_for_hierarchy(classes_queries, hierarchy_dict):
    def add_class_to_obj(cls_name, qrs_arr):
        if cls_name in classes_queries_converted:
            dup_list = classes_queries_converted[cls_name].extend(qrs_arr)
            classes_queries_converted[cls_name] = remove_list_duplicates(dup_list)
        else:
            classes_queries_converted[cls_name] = qrs_arr

    classes_queries_converted = {}
    for class_name, queries_arr in classes_queries.items():
        if class_name in hierarchy_dict:
            for cls in hierarchy_dict[class_name]:
                add_class_to_obj(cls, queries_arr)
        else:
            add_class_to_obj(class_name, queries_arr)
    return classes_queries_converted


def convert_query_to_class_list_for_hierarchy(query_to_class_list_obj, hierarchy_dict):
    query_to_class_list_obj_converted = {}
    for query_key, classes_query in query_to_class_list_obj.items():
        new_classes_list = []
        for cls in classes_query:
            if cls in hierarchy_dict:
                new_classes_list.extend(hierarchy_dict[cls])
            else:
                new_classes_list.append(cls)
        query_to_class_list_obj_converted[query_key] = remove_list_duplicates(new_classes_list)
    return query_to_class_list_obj_converted


def init_transformation_nodes_from_uml(transformation_nodes, uml):
    nodes_data_arr = uml.undecipheredJson["nodeDataArray"]
    for cls in nodes_data_arr:
        if 'type' not in cls:
            continue
        if cls['type'] == "Association Class":
            continue

        transformation_nodes[cls['name']] = {"Properties": cls['properties']}


def add_association_class_in_graph(transformation_edges, uml, edge_to_edge_dict):
    nodes_data_arr = uml.undecipheredJson["nodeDataArray"]
    links_data_arr = uml.undecipheredJson["linkDataArray"]

    swap_edge_dict = {k: oldk for oldk, oldv in edge_to_edge_dict.items() for k in oldv}

    for e_key in transformation_edges.keys():
        curr_e_key = e_key
        if e_key in swap_edge_dict:
            curr_e_key = swap_edge_dict[e_key]
        edge = find_object_by_key_in_list(links_data_arr, curr_e_key)

        if len(edge['labelKeys']) == 0:
            continue

        labelKey = edge['labelKeys'][0]
        link_ass_cls = next((x for x in links_data_arr if (x['to'] == labelKey or x['from'] == labelKey)), None)
        if link_ass_cls is None:
            continue

        ass_cls_key = link_ass_cls['to'] if link_ass_cls['to'] != labelKey else link_ass_cls['from']
        ass_cls = find_object_by_key_in_list(nodes_data_arr, ass_cls_key)
        # if ass_cls['name'] not in cluster_classes:
        #     continue
        transformation_edges[curr_e_key]['Properties'] = ass_cls['properties']
        transformation_edges[curr_e_key]['Edge_Name'] = ass_cls['name']


def convert_hierarchy_value_to_obj_list(hierarchy_dict_value, uml):
    new_obj_list = []
    for cls_obj in uml.undecipheredJson["nodeDataArray"]:
        if 'name' in cls_obj and cls_obj['name'] in hierarchy_dict_value:
            new_obj_list.append(cls_obj)
    return new_obj_list


def get_all_hierarchy_connections(uml, query_to_classes=None):
    hierarchy_connections_obj = {}  # {'from': ['to']}
    links_data_arr = uml.undecipheredJson["linkDataArray"]
    nodes_data_arr = uml.undecipheredJson["nodeDataArray"]

    for edge_obj in links_data_arr:
        if edge_obj['name'] == "generalization":
            if edge_obj['from'] == edge_obj['to']:
                continue
            class_to = find_object_by_key_in_list(nodes_data_arr, edge_obj['to'])
            class_from = find_object_by_key_in_list(nodes_data_arr, edge_obj['from'])
            if query_to_classes is not None:
                is_no_rel = hierarchy_document_find_no_rel_in_query(class_to['name'], query_to_classes)
                if is_no_rel:
                    tmp = class_to
                    class_to = class_from
                    class_from = tmp
            if class_from['name'] in hierarchy_connections_obj:
                if class_to['name'] not in hierarchy_connections_obj[class_from['name']]:
                    hierarchy_connections_obj[class_from['name']].append(class_to['name'])
            else:
                hierarchy_connections_obj[class_from['name']] = [class_to['name']]
    return hierarchy_connections_obj


def append_to_hierarchy_dict(hierarchy_dict, prev, cls):
    to_append = [prev]
    if prev in hierarchy_dict:
        to_append.extend(hierarchy_dict[prev])
    if prev in hierarchy_dict:
        hierarchy_dict[cls].extend(to_append)
    else:
        hierarchy_dict[cls] = to_append


def apply_hierarchy_rule_graph(hierarchy_connections_obj, cls, prev, visited, transformation_nodes, hierarchy_dict):
    if cls in visited:
        if len(prev) > 0:
            transformation_nodes[prev]['Properties'].extend(transformation_nodes[cls]['Properties'])
            append_to_hierarchy_dict(hierarchy_dict, prev, cls)

    elif cls not in hierarchy_connections_obj.keys():
        if len(prev) > 0:
            transformation_nodes[prev]['Properties'].extend(transformation_nodes[cls]['Properties'])
            append_to_hierarchy_dict(hierarchy_dict, prev, cls)
        visited.add(cls)

    else:
        for sub_class in hierarchy_connections_obj[cls]:
            if sub_class not in visited:
                apply_hierarchy_rule_graph(hierarchy_connections_obj, sub_class, cls, visited, transformation_nodes,
                                           hierarchy_dict)


def add_hierarchy_rule_graph(transformation_nodes, uml, hierarchy_dict):
    hierarchy_connections_obj = get_all_hierarchy_connections(uml)
    visited = set()
    roots = list(hierarchy_connections_obj.keys())
    for root in roots:
        apply_hierarchy_rule_graph(hierarchy_connections_obj, root, '', visited, transformation_nodes, hierarchy_dict)

    for cls_to_del in hierarchy_dict.keys():
        del transformation_nodes[cls_to_del]
    return hierarchy_connections_obj


def create_new_edge(transformation_edges, edge, class_from, class_to, edge_to_edge_dict=None):
    edge_new_key = max(max(transformation_edges.keys(), default=0), 0) + 1
    if edge_to_edge_dict is None:
        edge_new_key = edge['key']
    else:
        if edge['key'] in edge_to_edge_dict:
            edge_to_edge_dict[edge['key']].append(edge_new_key)
        else:
            edge_to_edge_dict[edge['key']] = [edge_new_key]
    transformation_edges[edge_new_key] = {
        "Class_From": class_from['name'],
        "Class_To": class_to['name'],
        "Edge_Name": edge['LinkName'],
        "Cardinal_From": edge['MultiFrom'],
        "Cardinal_To": edge['MultiTo'],
        "Properties": []
    }


def init_transformation_edges_from_uml(transformation_edges, uml, hierarchy_dict, edge_to_edge_dict):
    nodes_data_arr = uml.undecipheredJson["nodeDataArray"]
    links_data_arr = uml.undecipheredJson["linkDataArray"]

    for edge in links_data_arr:
        if edge["name"] != "association":
            continue

        class_from = find_object_by_key_in_list(nodes_data_arr, edge['from'])
        class_to = find_object_by_key_in_list(nodes_data_arr, edge['to'])

        # if class_from['name'] not in cluster_classes or class_to['name'] not in cluster_classes:
        #     continue

        if class_from['name'] not in hierarchy_dict and class_to['name'] not in hierarchy_dict:
            create_new_edge(transformation_edges, edge, class_from, class_to)
            continue

        class_from_arr = [class_from] if class_from[
                                             'name'] not in hierarchy_dict else convert_hierarchy_value_to_obj_list(
            hierarchy_dict[class_from['name']], uml)
        class_to_arr = [class_to] if class_to['name'] not in hierarchy_dict else convert_hierarchy_value_to_obj_list(
            hierarchy_dict[class_to['name']], uml)

        for r in itertools.product(class_from_arr, class_to_arr):
            create_new_edge(transformation_edges, edge, r[0], r[1], edge_to_edge_dict)


#  Data rules - for document ------------------------------

def hierarchy_document_find_no_rel_in_query(class_to, query_to_classes):
    for query_classes_list in query_to_classes.values():
        if len(query_classes_list) == 1 and class_to in query_classes_list:
            return True
    return False


def add_hierarchy_rule_document(transformation_nodes, uml, sql, hierarchy_dict):
    query_to_classes = get_query_to_class_list_obj(sql)
    hierarchy_connections_obj = get_all_hierarchy_connections(uml, query_to_classes)
    visited = set()
    roots = list(hierarchy_connections_obj.keys())
    for root in roots:
        apply_hierarchy_rule_graph(hierarchy_connections_obj, root, '', visited, transformation_nodes, hierarchy_dict)

    for cls_to_del in hierarchy_dict.keys():
        del transformation_nodes[cls_to_del]
    return hierarchy_connections_obj


def create_new_ass_cls_to_classes_links(transformation_edges, edge, cls_from, cls_to, ass_cls):
    edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
    transformation_edges[edge_new_key + 1] = {
        "Class_From": ass_cls['name'],
        "Class_To": cls_to['name'],
        "Edge_Name": edge['LinkName'],
        "Cardinal_From": edge['MultiFrom'],
        "Cardinal_To": edge['MultiTo'],
        "Properties": []
    }
    transformation_edges[edge_new_key + 2] = {
        "Class_From": cls_from['name'],
        "Class_To": ass_cls['name'],
        "Edge_Name": edge['LinkName'],
        "Cardinal_From": edge['MultiFrom'],
        "Cardinal_To": edge['MultiTo'],
        "Properties": []
    }


def add_association_class_in_document(transformation_nodes, transformation_edges, uml, hierarchy_dict, rel_ass_dict):
    nodes_data_arr = uml.undecipheredJson["nodeDataArray"]
    links_data_arr = uml.undecipheredJson["linkDataArray"]

    for edge in links_data_arr:

        if len(edge['labelKeys']) == 0:
            continue

        labelKey = edge['labelKeys'][0]
        link_ass_cls = next((x for x in links_data_arr if (x['to'] == labelKey or x['from'] == labelKey)), None)
        if link_ass_cls is None:
            continue

        ass_cls_key = link_ass_cls['to'] if link_ass_cls['to'] != labelKey else link_ass_cls['from']
        ass_cls = find_object_by_key_in_list(nodes_data_arr, ass_cls_key)
        transformation_nodes[ass_cls['name']] = {"Properties": ass_cls['properties']}
        class_from = find_object_by_key_in_list(nodes_data_arr, edge['from'])
        class_to = find_object_by_key_in_list(nodes_data_arr, edge['to'])
        class_from_arr = [class_from] if class_from[
                                             'name'] not in hierarchy_dict else convert_hierarchy_value_to_obj_list(
            hierarchy_dict[class_from['name']], uml)
        class_to_arr = [class_to] if class_to['name'] not in hierarchy_dict else convert_hierarchy_value_to_obj_list(
            hierarchy_dict[class_to['name']], uml)

        for r in itertools.product(class_from_arr, class_to_arr):
            create_new_ass_cls_to_classes_links(transformation_edges, edge, r[0], r[1], ass_cls)
            if ass_cls['name'] in rel_ass_dict:
                rel_ass_dict[ass_cls['name']].add((r[0], r[1]))
            else:
                rel_ass_dict[ass_cls['name']] = set([(r[0]['name'], r[1]['name'])])


def map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name):
    data = [cls_from, cls_to, edge_name, "ID"]
    separator = "-"
    new_link_name = separator.join(data)

    transformation_nodes[cls_from]['Properties'].append({
        "name": new_link_name,
        "type": "Number"
    })

    transformation_nodes[cls_to]['Properties'].append({
        "name": new_link_name,
        "type": "Number"
    })


def convert_cardinal_exp_to_general_cardinal(cardinal_exp):
    def single_converter(num):
        if num == '*':
            return num
        int_num = int(num)
        if int_num > 1:
            return "*"
        else:
            return num

    if '..' in cardinal_exp:
        bounds = cardinal_exp.split('..')
        min_bound = bounds[0]
        max_bound = bounds[1]
        return single_converter(min_bound) + ".." + single_converter(max_bound)
    else:
        return single_converter(cardinal_exp)


def get_min_bound_from_cardinal(cardinal_exp):
    if '..' in cardinal_exp:
        bounds = cardinal_exp.split('..')
        return bounds[0]
    else:
        return cardinal_exp


def count_read_query_for_class(sql, cls):
    queries = sql.undecipheredJson
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    count = 0
    if cls in classes_queries:
        for query_key in classes_queries[cls]:
            query_obj = queries[query_key]
            if query_obj['selectable']:
                query = query_obj['query']
                query_type = query.split(' ', 1)[0]
                if query_type.lower() == 'return':
                    count += 1
    return count


def embed_class_in_class(cls_to_embed, cls_embed_in, embedded_dict):
    if cls_to_embed in embedded_dict:
        if cls_embed_in not in embedded_dict[cls_to_embed]:
            embedded_dict[cls_to_embed].append(cls_embed_in)
    else:
        embedded_dict[cls_to_embed] = [cls_embed_in]


def one_to_one_embed_by_queries(sql, cls_from, cls_to, embedded_dict):
    from_count = count_read_query_for_class(sql, cls_from)
    to_count = count_read_query_for_class(sql, cls_to)
    if from_count >= to_count:
        embed_class_in_class(cls_to, cls_from, embedded_dict)
    else:
        embed_class_in_class(cls_from, cls_to, embedded_dict)


def map_one_to_one(transformation_nodes, sql, cls_from, cls_to, edge_name, card_to, card_from, embedded_dict):
    card_to_min = get_min_bound_from_cardinal(card_to)
    card_from_min = get_min_bound_from_cardinal(card_from)
    if card_from_min == '0' and card_to_min == '0':
        map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name)  # acts as a 2-way relationship
    elif card_from_min == '1' and card_to_min == '1':
        one_to_one_embed_by_queries(sql, cls_from, cls_to, embedded_dict)
    else:
        if card_to_min > card_from_min:
            embed_class_in_class(cls_from, cls_to, embedded_dict)
        else:
            embed_class_in_class(cls_to, cls_from, embedded_dict)


# TODO: change for when query subject change
def get_query_subject(query_obj, query_key=None, query_to_classes=None):
    if query_obj['selectable']:
        if 'subject' in query_obj:
            return query_obj['subject']
        return query_to_classes[query_key][0]


def count_subject_queries_for_class(sql, cls):
    queries = sql.undecipheredJson
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    count = 0
    if cls in classes_queries:
        for query_key in classes_queries[cls]:
            query_obj = queries[query_key]
            if query_obj['selectable']:
                query = query_obj['query']
                query_type = query.split(' ', 1)[0]
                if query_type.lower() == 'return':
                    # TODO: change for when query subject change
                    query_to_classes = get_query_to_class_list_obj(sql)
                    if get_query_subject(query_obj, query_key, query_to_classes) == cls:
                        count += 1
    return count


def get_list_joined_queries_for_classes(sql, cls_to, cls_from):
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    if cls_to not in classes_queries or cls_from not in classes_queries:
        return []
    cls_to_list = classes_queries[cls_to]
    cls_from_list = classes_queries[cls_from]
    joined_queries_list = list(set(cls_to_list) & set(cls_from_list))
    return joined_queries_list


def count_subject_joined_queries_for_class(sql, cls_sub, cls_join):
    joined_queries = get_list_joined_queries_for_classes(sql, cls_sub, cls_join)
    queries = sql.undecipheredJson
    query_to_classes = get_query_to_class_list_obj(sql)
    count = 0
    for query_key in joined_queries:
        # TODO: change for when query subject change
        subject_cls = get_query_subject(queries[query_key], query_key, query_to_classes)
        if subject_cls == cls_sub:
            count += 1
    return count


def map_ont_to_many(transformation_nodes, sql, cls_from, cls_to, edge_name, card_to, card_from, embedded_dict):
    cls_to_count_subject_queries = count_subject_queries_for_class(sql, cls_to)
    cls_to_count_subject_joined_queries = count_subject_joined_queries_for_class(sql, cls_to, cls_from)
    cls_from_count_subject_queries = count_subject_queries_for_class(sql, cls_from)
    cls_from_count_subject_joined_queries = count_subject_joined_queries_for_class(sql, cls_from, cls_to)
    classes_count_joined_queries = len(get_list_joined_queries_for_classes(sql, cls_to, cls_from))

    is_embedded = False

    if classes_count_joined_queries > 0:
        if cls_to_count_subject_joined_queries > cls_from_count_subject_joined_queries:
            min_bound = get_min_bound_from_cardinal(card_to)
            # TODO check significant size
            if cls_to_count_subject_queries > 2 * classes_count_joined_queries:
                map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name)
                is_embedded = True
            elif min_bound != '0':
                embed_class_in_class(cls_from, cls_to, embedded_dict)
                is_embedded = True
        if cls_to_count_subject_joined_queries <= cls_from_count_subject_joined_queries:
            min_bound = get_min_bound_from_cardinal(card_from)
            if cls_from_count_subject_queries > 2 * classes_count_joined_queries:
                map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name)
                is_embedded = True
            elif min_bound != '0':
                embed_class_in_class(cls_to, cls_from, embedded_dict)
                is_embedded = True
        if not is_embedded:
            map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name)
    else:
        if cls_to_count_subject_queries > cls_from_count_subject_queries:
            min_bound = get_min_bound_from_cardinal(card_to)
            if min_bound != '0':
                embed_class_in_class(cls_from, cls_to, embedded_dict)
                is_embedded = True
        if cls_from_count_subject_queries <= cls_to_count_subject_queries:
            min_bound = get_min_bound_from_cardinal(card_from)
            if min_bound != '0':
                embed_class_in_class(cls_to, cls_from, embedded_dict)
                is_embedded = True
        if not is_embedded:
            map_many_to_many(transformation_nodes, cls_from, cls_to, edge_name)


def embed_class_in_transformation_nodes(transformation_nodes, to_embed, embed_in):
    if 'embedded_classes' not in transformation_nodes[embed_in]:
        transformation_nodes[embed_in]['embedded_classes'] = {to_embed: transformation_nodes[to_embed]}
    else:
        transformation_nodes[embed_in]['embedded_classes'][to_embed] = transformation_nodes[to_embed]


def embed_nodes_by_dict(transformation_nodes, embedded_dict, rel_ass_dict):
    embedded = set()
    for to_embed, embed_in_list in embedded_dict.items():
        for embed_in in embed_in_list:
            if embed_in in embedded and to_embed in embedded_dict[embed_in]:
                continue
            embed_class_in_transformation_nodes(transformation_nodes, to_embed, embed_in)
            embedded.add(to_embed)

    embedded_ass = set()
    for ass_cls, rel_arr in rel_ass_dict.items():
        for rel in rel_arr:
            cls_1 = rel[0]
            cls_2 = rel[1]
            if cls_1 in embedded_dict and cls_2 in embedded_dict[cls_1]:
                embed_class_in_transformation_nodes(transformation_nodes, ass_cls, cls_1)
                embedded_ass.add(ass_cls)
            elif cls_2 in embedded_dict and cls_1 in embedded_dict[cls_2]:
                embed_class_in_transformation_nodes(transformation_nodes, ass_cls, cls_2)
                embedded_ass.add(ass_cls)
            else:
                map_many_to_many(transformation_nodes, cls_1, ass_cls, "association-ID")
                map_many_to_many(transformation_nodes, cls_2, ass_cls, "association-ID")

    to_del_set = embedded_ass.union(set(embedded))
    for to_del in to_del_set:
        del transformation_nodes[to_del]


def transform_edges_to_nodes(transformation_nodes, transformation_edges, sql, rel_ass_dict):
    embedded_dict = {}
    one_rel = ['1', '0', '0..1', '1..1', '0..0']
    for edge in transformation_edges.values():
        card_to = edge['Cardinal_To']
        card_from = edge['Cardinal_From']
        general_card_to = convert_cardinal_exp_to_general_cardinal(card_to)
        general_card_from = convert_cardinal_exp_to_general_cardinal(card_from)
        cls_to = edge['Class_To']
        cls_from = edge['Class_From']
        if cls_to in rel_ass_dict or cls_from in rel_ass_dict:
            continue
        if '*' in general_card_to and '*' in general_card_from:
            map_many_to_many(transformation_nodes, cls_from, cls_to, edge['Edge_Name'])
        elif card_to in one_rel and card_from in one_rel:
            map_one_to_one(transformation_nodes, sql, cls_from, cls_to, edge['Edge_Name'], card_to, card_from,
                           embedded_dict)
        else:
            map_ont_to_many(transformation_nodes, sql, cls_from, cls_to, edge['Edge_Name'], card_to, card_from,
                            embedded_dict)

    embed_nodes_by_dict(transformation_nodes, embedded_dict, rel_ass_dict)


# Functional rules ----------------------------------------

def get_where_section(query):
    split_query = re.split("where", query, flags=re.IGNORECASE)
    if len(split_query) == 1:
        return []
    return split_query[1]


def get_property_to_edge_dict(transformation_edges):
    property_to_edge_dict = {}
    for edge_key, edge_obj in transformation_edges.items():
        for property_obj in edge_obj['Properties']:
            property_name = property_obj['name']
            if property_name in property_to_edge_dict:
                if edge_key not in property_to_edge_dict[property_name]:
                    property_to_edge_dict[property_name].append(edge_key)
            else:
                property_to_edge_dict[property_name] = [edge_key]
    return property_to_edge_dict


def find_edge_to_split_g2(edges_list, transformation_edges, classes_queries, query_key):
    for edge_key in edges_list:
        edge_obj = transformation_edges[edge_key]
        class_to = edge_obj['Class_To']
        class_from = edge_obj['Class_From']
        if str(query_key) in classes_queries[class_to] and str(query_key) in classes_queries[class_from]:
            return edge_key
    return None


def split_edge_g2(edge_key, transformation_edges, transformation_nodes):
    edge_obj = copy.deepcopy(transformation_edges[edge_key])
    transformation_nodes[edge_obj["Edge_Name"]] = {"Properties": edge_obj['Properties']}
    edge_obj['Properties'] = []
    edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
    transformation_edges[edge_new_key + 1] = copy.deepcopy(edge_obj)
    transformation_edges[edge_new_key + 1]['Class_To'] = edge_obj["Edge_Name"]
    transformation_edges[edge_new_key + 1]['Edge_Name'] += "-" + edge_obj["Class_From"]

    transformation_edges[edge_new_key + 2] = copy.deepcopy(edge_obj)
    transformation_edges[edge_new_key + 2]['Class_From'] = edge_obj["Edge_Name"]
    transformation_edges[edge_new_key + 2]['Edge_Name'] += "-" + edge_obj["Class_To"]


def rule_g2(sql, transformation_nodes, transformation_edges):
    property_to_edge_dict = get_property_to_edge_dict(transformation_edges)
    edges_to_delete = []
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    for query_key, query_obj in sql.undecipheredJson.items():
        if not query_obj['selectable']:
            continue
        query = query_obj['query']
        where_section = get_where_section(query)
        for edge_property in property_to_edge_dict.keys():
            if edge_property in where_section:
                edge_to_split = find_edge_to_split_g2(property_to_edge_dict[edge_property], transformation_edges,
                                                      classes_queries, query_key)
                if edge_to_split is None or edge_to_split in edges_to_delete:
                    continue

                split_edge_g2(edge_to_split, transformation_edges, transformation_nodes)
                edges_to_delete.append(edge_to_split)
    for edge_to_delete in edges_to_delete:
        if edge_to_delete in transformation_edges:
            del transformation_edges[edge_to_delete]


def get_counter_per_links_pair_classes(transformation_edges):
    classes_link_counter = {}
    for edge_obj in transformation_edges.values():
        class_from = edge_obj['Class_From']
        class_to = edge_obj['Class_To']
        if class_to == class_from:
            continue
        pair = [class_from, class_to]
        pair.sort()
        class_pair = tuple(pair)
        if class_pair in classes_link_counter:
            classes_link_counter[class_pair] += 1
        else:
            classes_link_counter[class_pair] = 1
    return classes_link_counter


def rule_g1(transformation_edges, sql, hierarchy_dict):
    classes_queries = json.loads(sql.convertedData['classes_queries'])
    classes_link_counter = get_counter_per_links_pair_classes(transformation_edges)
    classes_pair_more_than_one = [k for k in classes_link_counter if classes_link_counter[k] > 1]
    classes_queries_converted = convert_classes_queries_for_hierarchy(classes_queries,
                                                                      hierarchy_dict)
    for (class_from, class_to) in classes_pair_more_than_one:
        if class_from not in classes_queries_converted or len(classes_queries_converted[class_from]) < 2:
            continue
        if class_to not in classes_queries_converted or len(classes_queries_converted[class_to]) < 2:
            continue

        queries_class_to = classes_queries_converted[class_to]
        queries_class_from = classes_queries_converted[class_from]

        shared_queries_list = list(set(queries_class_to) & set(queries_class_from))
        if len(shared_queries_list) > 1:
            edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
            transformation_edges[edge_new_key + 1] = {
                "Class_From": class_from,
                "Class_To": class_to,
                "Edge_Name": "generic_" + class_from + "_" + class_to,
                "Cardinal_From": "*",
                "Cardinal_To": "*",
                "Properties": []
            }


def get_limited_value_attributes(transformation_nodes):
    limited_attributes_obj = {}  # {'att name': ['list of classes with att']}
    limited_attributes_set = {}
    for class_name, class_obj in transformation_nodes.items():
        for attribute_obj in class_obj['Properties']:
            if "Boolean" in attribute_obj['type']:
                if attribute_obj['name'] in limited_attributes_obj:
                    limited_attributes_obj[attribute_obj['name']].append(class_name)
                else:
                    limited_attributes_obj[attribute_obj['name']] = [class_name]
                limited_attributes_set[attribute_obj['name']] = attribute_obj

    return limited_attributes_obj, limited_attributes_set


def rule_g3(sql, transformation_nodes, transformation_edges, hierarchy_dict):
    query_to_class_list = get_query_to_class_list_obj(sql)
    query_to_class_list_hrr = convert_query_to_class_list_for_hierarchy(query_to_class_list, hierarchy_dict)
    queries = sql.undecipheredJson
    limited_attributes_obj, limited_attributes_set = get_limited_value_attributes(transformation_nodes)
    att_to_del_obj = {}  # {att_name: [classes list to del from]}
    for query_key, query_obj in queries.items():
        if not query_obj['selectable']:
            continue
        query = query_obj['query']
        where_section = get_where_section(query)
        for att_name, att_classes_list in limited_attributes_obj.items():
            if att_name in where_section:
                query_classes = query_to_class_list_hrr[query_key]
                shared_classes_list = list(set(query_classes) & set(att_classes_list))
                if len(shared_classes_list) > 0:
                    new_cls_name = att_name if att_name not in transformation_nodes else att_name + '_att'
                    att_obj = limited_attributes_set[att_name]
                    transformation_nodes[new_cls_name] = {"Properties": [att_obj]}
                    att_to_del_obj[att_name] = shared_classes_list
                    for cls in shared_classes_list:
                        edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
                        transformation_edges[edge_new_key + 1] = {
                            "Class_From": new_cls_name,
                            "Class_To": cls,
                            "Edge_Name": new_cls_name + "_of_" + cls,
                            "Cardinal_From": '1',
                            "Cardinal_To": '1',
                            "Properties": []
                        }

    for att_to_del, att_classes in att_to_del_obj.items():
        for att_cls in att_classes:
            if att_cls in transformation_nodes:
                for i, prop in enumerate(transformation_nodes[att_cls]['Properties']):
                    if prop['name'] == att_to_del:
                        del transformation_nodes[att_cls]['Properties'][i]
                        break



def get_classes_amount_per_query(sql, uml, key):
    classes_names = {}
    query_classes = {}

    for node in uml.undecipheredJson["nodeDataArray"]:
        if "type" in node and (node["type"] == "Class" or node["type"] == "Association Class"):
            classes_names[node["name"]] = node["key"]

    if sql.undecipheredJson[key]['selectable']:
        query = sql.undecipheredJson[key]['query']
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
    return query_classes


def check_if_sequences_in_query(query, class_name):
    query = ' '.join(query.split())
    query = query.replace(" =", "=")
    query = query.replace("= ", "=")
    query = query.replace(" -", "-")
    query = query.replace("- ", "-")
    query = query.replace(" +", "+")
    query = query.replace("+ ", "+")
    space_sensitive_c_name = class_name.replace(" ", "_")
    query = query.replace(class_name, space_sensitive_c_name)
    query_arr = re.split("[, ]", query)
    classes_as_names = set()
    for i, word in enumerate(query_arr):
        if word == space_sensitive_c_name:
            if i < len(query_arr) - 2 and query_arr[i + 1].lower() == 'as':
                classes_as_names.add(query_arr[i + 2])
        elif '=' in word:
            count_cls = sum(y in word for y in classes_as_names)
            if count_cls >= 2 and any(exp in word for exp in ['+', '-']):
                return True
    return False


def rule_g4(sql, uml, transformation_edges, hierarchy_dict):
    queries = sql.undecipheredJson
    for query_key, query_obj in queries.items():
        if not query_obj['selectable']:
            continue
        query = query_obj['query']
        query_classes = get_classes_amount_per_query(sql, uml, query_key)
        for class_name, class_amount in query_classes.items():
            if class_amount >= 2:
                is_seq = check_if_sequences_in_query(query, class_name)
                if is_seq:
                    seq_clses = [class_name] if class_name not in hierarchy_dict else hierarchy_dict[class_name]
                    for seq_cls in seq_clses:
                        edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
                        transformation_edges[edge_new_key] = {
                            "Class_From": class_name,
                            "Class_To": class_name,
                            "Edge_Name": "sequences_link",
                            "Cardinal_From": '1',
                            "Cardinal_To": '1',
                            "Properties": []
                        }


def get_classes_in_query(sql, uml, query_key):
    query_classes = get_classes_amount_per_query(sql, uml, query_key)
    query = sql.undecipheredJson[query_key]['query']
    query = ' '.join(query.split())
    classes_in_query = {}
    for class_name in query_classes.keys():
        space_sensitive_c_name = class_name.replace(" ", "_")
        classes_in_query[space_sensitive_c_name] = class_name
        query = query.replace(class_name, space_sensitive_c_name)
    query_arr = re.split("[, ]", query)
    for i, word in enumerate(query_arr):
        if word in classes_in_query.keys():
            if i < len(query_arr) - 2 and query_arr[i + 1].lower() == 'as':
                classes_in_query[query_arr[i + 2]] = classes_in_query[word]

    # get_classes in where section
    classes_in_where = set()
    where_sec = get_where_section(query)
    for class_as, class_og in classes_in_query.items():
        if class_as in where_sec:
            classes_in_where.add(class_og)

    return classes_in_query, classes_in_where


def is_valid_edge_path(edge_key, edge_obj, set_classes_in_query, visited_edges, curr_path_obj, source):
    if edge_key in visited_edges:
        return False
    cls_from = edge_obj['Class_From']
    cls_to = edge_obj['Class_To']
    if cls_to == cls_from:
        return False
    if cls_to not in set_classes_in_query or cls_from not in set_classes_in_query:
        return False
    visited_nodes = list(curr_path_obj.keys())
    visited_nodes.append(source)
    if cls_to not in visited_nodes and cls_from not in visited_nodes:
        return False
    return True


def add_edge_to_path(edge_key, edge_obj, visited_edges, curr_path_obj):
    visited_edges.add(edge_key)
    cls_from = edge_obj['Class_From']
    cls_to = edge_obj['Class_To']

    if cls_to in curr_path_obj:
        curr_path_obj[cls_to] += 1
    else:
        curr_path_obj[cls_to] = 1

    if cls_from in curr_path_obj:
        curr_path_obj[cls_from] += 1
    else:
        curr_path_obj[cls_from] = 1


def remove_edge_from_path(edge_key, edge_obj, visited_edges, curr_path_obj):
    if edge_key in visited_edges:
        visited_edges.remove(edge_key)
    cls_from = edge_obj['Class_From']
    cls_to = edge_obj['Class_To']
    if cls_from in curr_path_obj:
        curr_path_obj[cls_from] -= 1
        if curr_path_obj[cls_from] <= 0:
            del curr_path_obj[cls_from]
    if cls_to in curr_path_obj:
        curr_path_obj[cls_to] -= 1
        if curr_path_obj[cls_to] <= 0:
            del curr_path_obj[cls_to]


def find_path_between_two_classes(transformation_edges, set_classes_in_query, visited_edges, curr_path_obj, source,
                                  target):
    if source in curr_path_obj and target in curr_path_obj:
        return True

    for edge_key, edge_obj in transformation_edges.items():
        if is_valid_edge_path(edge_key, edge_obj, set_classes_in_query, visited_edges, curr_path_obj, source):
            add_edge_to_path(edge_key, edge_obj, visited_edges, curr_path_obj)
            if find_path_between_two_classes(transformation_edges, set_classes_in_query, visited_edges, curr_path_obj,
                                             source, target):
                return True
            remove_edge_from_path(edge_key, edge_obj, visited_edges, curr_path_obj)
    return False


def rule_g5(sql, uml, transformation_edges, hierarchy_dict):
    queries = sql.undecipheredJson
    for query_key, query_obj in queries.items():
        if query_obj['selectable']:
            classes_in_query, classes_in_where = get_classes_in_query(sql, uml, query_key)
            set_classes_in_query = set(classes_in_query.values())

            for rem_cls, add_clses in hierarchy_dict.items():
                if rem_cls in set_classes_in_query:
                    set_classes_in_query.remove(rem_cls)
                    set_classes_in_query.update(add_clses)

            if len(classes_in_where) == 2:
                if any(edge['Class_From'] != edge['Class_To'] and edge['Class_From'] in classes_in_where and edge[
                        'Class_To'] in classes_in_where for edge in transformation_edges.values()):
                    continue
                classes_in_where_arr = list(classes_in_where)
                source_arr = [classes_in_where_arr[0]] if classes_in_where_arr[0] not in hierarchy_dict else \
                    hierarchy_dict[classes_in_where_arr[0]]
                target_arr = [classes_in_where_arr[1]] if classes_in_where_arr[1] not in hierarchy_dict else \
                    hierarchy_dict[classes_in_where_arr[1]]
                for r in itertools.product(source_arr, target_arr):
                    is_path_exist = find_path_between_two_classes(transformation_edges, set_classes_in_query, set(), {},
                                                                  r[0], r[1])
                    if is_path_exist:
                        edge_new_key = max(max(transformation_edges.keys(), default=0), 0)
                        transformation_edges[edge_new_key + 1] = {
                            "Class_From": r[0],
                            "Class_To": r[1],
                            "Edge_Name": "implicit_" + r[0] + "_" + r[1],
                            "Cardinal_From": '*',
                            "Cardinal_To": '*',
                            "Properties": []
                        }


# ---------------------------------------------------------

def transformation_graph(project):
    if project is None:
        return

    uml, sql = getTransData(project)
    # final_clusters = json.loads(project["Results"]["final_clusters"])
    # cluster_classes = final_clusters[str(cluster_id)]

    hierarchy_dict = {}  # {'name of hierarchy class': [list of classes that contain it after hierarchy rule]}
    edge_to_edge_dict = {}  # {'key of uml edge': [list of edges that became it after hierarchy rule]}

    transformation_nodes = {}
    transformation_edges = {}

    init_transformation_nodes_from_uml(transformation_nodes, uml)
    add_hierarchy_rule_graph(transformation_nodes, uml, hierarchy_dict)
    init_transformation_edges_from_uml(transformation_edges, uml, hierarchy_dict, edge_to_edge_dict)
    add_association_class_in_graph(transformation_edges, uml, edge_to_edge_dict)
    rule_g1(transformation_edges, sql, hierarchy_dict)
    rule_g2(sql, transformation_nodes, transformation_edges)
    rule_g3(sql, transformation_nodes, transformation_edges, hierarchy_dict)
    rule_g4(sql, uml, transformation_edges, hierarchy_dict)
    rule_g5(sql, uml, transformation_edges, hierarchy_dict)
    return {"transformation": json.dumps({"nodes": transformation_nodes, "edges": transformation_edges})}


def transformation_document(project):
    if project is None:
        return

    uml, sql = getTransData(project)
    #final_clusters = json.loads(project["Results"]["final_clusters"])
    # cluster_classes = final_clusters[str(cluster_id)]

    hierarchy_dict = {}  # {'name of hierarchy class': [list of classes that contain it after hierarchy rule]}
    edge_to_edge_dict = {}  # {'key of uml edge': [list of edges that became it after hierarchy rule]}
    rel_ass_dict = {}  # {'ass_cls_name': set([(cls_from, cls_to)]}

    transformation_nodes = {}
    transformation_edges = {}

    init_transformation_nodes_from_uml(transformation_nodes, uml)
    add_hierarchy_rule_document(transformation_nodes, uml, sql, hierarchy_dict)
    init_transformation_edges_from_uml(transformation_edges, uml, hierarchy_dict, edge_to_edge_dict)
    add_association_class_in_document(transformation_nodes, transformation_edges, uml, hierarchy_dict, rel_ass_dict)
    rule_g1(transformation_edges, sql, hierarchy_dict)
    rule_g2(sql, transformation_nodes, transformation_edges)
    rule_g3(sql, transformation_nodes, transformation_edges, hierarchy_dict)
    rule_g4(sql, uml, transformation_edges, hierarchy_dict)
    rule_g5(sql, uml, transformation_edges, hierarchy_dict)
    transform_edges_to_nodes(transformation_nodes, transformation_edges, sql, rel_ass_dict)

    return {"transformation": json.dumps({"nodes": transformation_nodes})}

def getTransData(project):
    uml = db.getOneEditor({"EditorID": project.UMLEditorID})
    sql = db.getOneEditor({"EditorID": project.SQLEditorID})
    return uml, sql


