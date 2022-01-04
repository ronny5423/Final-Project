import numpy as np
import pandas as pd
import pymongo
import json
from sklearn.cluster import DBSCAN
from database import *


def inverse(x):
    return 1 - x


def calculate_uml_or_sql_matrix(uml_or_sql):
    shape = uml_or_sql['convertedData']['shape']
    matrix = json.loads(uml_or_sql['convertedData']['matrix_classes'])
    matrix_idx = 1
    classes = json.loads(uml_or_sql['convertedData']['classes'])
    classes_arr_col = [cls_arr[0] for cls_arr in classes.values()]
    classes_arr_col = ["Class"] + classes_arr_col
    classes_arr_row = [[cls_arr[0]] for cls_arr in classes.values()]
    for row in classes_arr_row:
        for i in range(shape):
            row.append(matrix[str(matrix_idx)])
            matrix_idx += 1
    classes_arr_row = [classes_arr_col] + classes_arr_row

    np_matrix = np.array(classes_arr_row)

    df_matrix = pd.DataFrame(data=np_matrix[1:, 1:].astype(float),  # values
                             index=np_matrix[1:, 0],  # 1st column as index
                             columns=np_matrix[0, 1:])  # 1st row as the column names

    return df_matrix


def calculate_nfr_matrix(nfr):
    shape = nfr['convertedData']['shape']
    matrix = json.loads(nfr['convertedData']['matrix_classes'])
    matrix_idx = 1
    classes = nfr['convertedData']['classes']
    classes_arr_col = [cls_arr[0] for cls_arr in classes]
    classes_arr_col = ["Class"] + classes_arr_col
    classes_arr_row = [[cls_arr[0]] for cls_arr in classes]
    for row in classes_arr_row:
        for i in range(shape):
            row.append(matrix[str(matrix_idx)])
            matrix_idx += 1
    classes_arr_row = [classes_arr_col] + classes_arr_row

    np_matrix = np.array(classes_arr_row)

    nfr_matrix = pd.DataFrame(data=np_matrix[1:, 1:].astype(float),  # values
                              index=np_matrix[1:, 0],  # 1st column as index
                              columns=np_matrix[0, 1:])  # 1st row as the column names

    return nfr_matrix


def calculate_final_matrix(uml_matrix, sql_matrix, nfr_matrix, ahp_weights):
    final_matrix = uml_matrix * ahp_weights["UML"]
    final_matrix += sql_matrix * ahp_weights["SQL"]
    final_matrix += nfr_matrix * ahp_weights["NFR"]
    return final_matrix


def assign_cluster(final_matrix):
    final_clusters = {}

    dist = final_matrix.apply(inverse)
    e = round(dist.mean().mean(), 2)
    db = DBSCAN(eps=e, min_samples=1, metric='precomputed').fit(dist)
    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_
    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise_ = list(labels).count(-1)
    clustersRange = range(0, n_clusters_, 1)
    for j in clustersRange:
        final_clusters[j] = list(dist.index[np.nonzero(labels == j)[0]])

    noise_classes = list(dist.index[np.nonzero(labels == -1)[0]])
    for cls in noise_classes:
        final_clusters[n_noise_] = [cls]
        n_noise_ += 1

    return final_clusters


def get_nfr_value(nfr_att_val):
    if type(nfr_att_val) is list:
        return nfr_att_val[1]
    else:
        return nfr_att_val


def calculate_clusters_profiles(final_clusters, sql, nfr):
    clusters_profiles = {}
    map_nfr = nfr['undecipheredJson']
    queries_complexities = sql['convertedData']['queries_complexity']
    classes_queries = json.loads(sql['convertedData']['classes_queries'])
    for cluster_key, cluster in final_clusters.items():
        clusters_profiles[cluster_key] = {}
        clusters_profiles[cluster_key]["Query Complexity"] = 0
        for cls in cluster:
            for nfr_att, nfr_val in map_nfr[cls].items():
                if nfr_att in clusters_profiles[cluster_key]:
                    clusters_profiles[cluster_key][nfr_att] += (get_nfr_value(nfr_val) / len(cluster))
                else:
                    clusters_profiles[cluster_key][nfr_att] = (get_nfr_value(nfr_val) / len(cluster))
            if cls in classes_queries:
                for query in classes_queries[cls]:
                    complexity = queries_complexities[query]
                    clusters_profiles[cluster_key]["Query Complexity"] += (complexity / len(classes_queries[cls]))
        clusters_profiles[cluster_key]["Query Complexity"] /= len(cluster)
    return clusters_profiles


def calculate_distance_from_clusters_to_db_profiles(clusters_profiles, db_profiles):
    cluster_to_db_vectors = {}
    for cluster_key, cluster_profile in clusters_profiles.items():
        cluster_to_db_vectors[cluster_key] = {}
        for nfr_key, nfr_val in cluster_profile.items():
            for db_name, db_profile in db_profiles.items():
                mann_dist = abs(nfr_val - get_nfr_value(db_profile[nfr_key]))
                if db_name in cluster_to_db_vectors[cluster_key]:
                    cluster_to_db_vectors[cluster_key][db_name][nfr_key] = mann_dist
                else:
                    cluster_to_db_vectors[cluster_key][db_name] = {nfr_key: mann_dist}
    return cluster_to_db_vectors


def get_dataframe_for_cluster(cluster_obj):
    data = []
    ind = []
    colmn = []
    for name, prof in cluster_obj.items():
        ind.append(name)
        data.append(list(prof.values()))
        if len(colmn) == 0:
            colmn = list(prof.keys())

    df = pd.DataFrame(data, index=ind, columns=colmn)
    return df


def get_dist_dict_of_each_cluster_to_db(cluster_to_db_vectors):
    cluster_df_dict = {}
    # create dict of cluster_key as key and dataframe of nfr's and db's as value
    for clstr in cluster_to_db_vectors:
        cluster_obj = cluster_to_db_vectors[clstr]
        cluster_df = get_dataframe_for_cluster(cluster_obj)
        cluster_df_dict[clstr] = cluster_df

    # normalize the values in the dataframe
    cluster_to_db_distances = {}
    for cluster_key in cluster_df_dict:
        max_dist = []  # array of max distance for each nfr in a cluster
        for nfr in cluster_df_dict[cluster_key]:
            column = cluster_df_dict[cluster_key][nfr]
            max_value = column.max()
            max_value = max(max_value, 1)
            max_dist.append(max_value)
        cluster_df_dict[cluster_key] /= max_dist
        # calculating the distance for each DB
        avg = cluster_df_dict[cluster_key].mean(axis=1)
        avg_obj = avg.to_dict()
        cluster_to_db_distances[cluster_key] = avg_obj
    return cluster_to_db_distances


def calculate_algorithm(projectID):
    if projectID is None:
        return

    project = db.getOneProject({"ProjectID": projectID})

    if not hasattr(project, 'Weights'):
        ahp = db.getAHPWeights()
    else:
        ahp = project.Weights

    editors = db.get_editors_project(projectID)

    sql, nfr, uml = {}, {}, {}
    for editor in editors:
        if editor['type'] == 'UML':
            uml = editor
        elif editor['type'] == 'SQL':
            sql = editor
        elif editor['type'] == 'NFR':
            nfr = editor

    final_matrix = calculate_final_matrix(calculate_uml_or_sql_matrix(uml), calculate_uml_or_sql_matrix(sql),
                                          calculate_nfr_matrix(nfr), ahp)
    final_clusters = assign_cluster(final_matrix)

    clusters_profiles = calculate_clusters_profiles(final_clusters, sql, nfr)

    # TODO change to load DB profiles when can
    db_profiles = {'RDBMS': {'Query Complexity': 3, 'Integrity': 2, 'Consistency': ['b', 2]},
                   'Document': {'Query Complexity': 4, 'Integrity': 1, 'Consistency': ['a', 1]}}

    dist_vec_obj = calculate_distance_from_clusters_to_db_profiles(clusters_profiles, db_profiles)

    cluster_to_db_distances = get_dist_dict_of_each_cluster_to_db(dist_vec_obj)

    return {'final_clusters': json.dumps(final_clusters), 'DB_distance': json.dumps(cluster_to_db_distances)}


