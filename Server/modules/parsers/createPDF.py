from json2html import *
from database import *
import json
import copy

import pandas as pd
import numpy as np

html_template = """<html>
<head>
<title>Title</title>
</head>
<body>
<h1>{}</h1>
<h2>{}</h2>
{}
<h2>UML Editor</h2>
{}
<h2>SQL Editor</h2>
{}
<h2>NFR Editor</h2> 
{}
<h2>Results</h2> 
<p>Clusters</p>
{}
<p>Distances</p>
{}
</body>
</html>
"""

html_results_template = """<div> 
<h2>{}</h2>
{}
</div>"""

# uml_or_sql - the object of a uml or sql editor from mongo
# shape = uml_or_sql['convertedData']['shape']
# matrix = json.loads(uml_or_sql['convertedData']['matrix_classes'])
# classes = json.loads(uml_or_sql['convertedData']['classes']).values()
#
# nfr - the object of a nfr editor from mongo
# shape = nfr['convertedData']['shape']
# matrix = json.loads(nfr['convertedData']['matrix_classes'])
# classes = nfr['convertedData']['classes']


def create_html_matrix(matrix, classes, shape):
    if not matrix or not classes or not shape:
        return 'No Editor Data.'
    matrix_idx = 1
    classes_arr_col = [cls_arr[0] for cls_arr in classes]
    classes_arr_col = ["Class"] + classes_arr_col
    classes_arr_row = [[cls_arr[0]] for cls_arr in classes]
    for row in classes_arr_row:
        for i in range(shape):
            row.append(matrix[str(matrix_idx)])
            matrix_idx += 1
    classes_arr_row = [classes_arr_col] + classes_arr_row

    np_matrix = np.array(classes_arr_row)

    df_matrix = pd.DataFrame(data=np_matrix[1:, 1:].astype(float),  # values
                             index=np_matrix[1:, 0],  # 1st column as index
                             columns=np_matrix[0, 1:])  # 1st row as the column names

    return df_matrix.to_html()

def createHtmlReport(project):
    projectName = project.name
    projectDescription = project.Description
    results = db.getCalcResults(project.ProjectID)['Results']
    # print(resultsToHtml(json.loads(results['Results'])))
    db_dist = json.loads(results['DB_distance']) if results else {}
    
    new_db_dist = {}
    for clus_key, clust_dist in db_dist.items():
        deepcopy_dist = copy.deepcopy(clust_dist)
        new_dist = {}
        for i in range(len(clust_dist)):
            new_dist[min(deepcopy_dist, key=deepcopy_dist.get)] = str(round(min(deepcopy_dist.values()), 2))
            del deepcopy_dist[min(deepcopy_dist, key=deepcopy_dist.get)]
        new_db_dist[clus_key] = new_dist
    html_results_1 = to_html(results['final_clusters']) if results else 'No Results'
    # html_results_2 = to_html(results['DB_distance']) if results else 'No Results'
    html_results_2 = to_html(new_db_dist) if results else 'No Results'
    projectDetails = to_html(setProjectToHtml(project))
    uml = db.getOneEditor({'EditorID': project.UMLEditorID})
    sql = db.getOneEditor({'EditorID': project.SQLEditorID})
    nfr = db.getOneEditor({'EditorID': project.NFREditorID})
    return html_template.format(projectName, projectDescription, projectDetails, 
                                create_html_matrix(json.loads(uml.convertedData['matrix_classes']), json.loads(uml.convertedData['classes']).values(), uml.convertedData['shape']),
                                create_html_matrix(json.loads(sql.convertedData['matrix_classes']), json.loads(sql.convertedData['classes']).values(), sql.convertedData['shape']),
                                create_html_matrix(json.loads(nfr.convertedData['matrix_classes']), nfr.convertedData['classes'], nfr.convertedData['shape']),
                                html_results_1, html_results_2)
    
        
def to_html(json_doc):
    return json2html.convert(json=json_doc)

def setProjectToHtml(project):
    return {
        'Owner': project.Owner,
        'Members': project.Members,
        'Weights': project.Weights if hasattr(project, 'Weights') else db.getNFRWeights()
    }
    
def resultsToHtml(results):
    if not results:
        return 'No Results'
    else:
        divHolder = """<div>{}</div>"""
        clusters = []
        for key in results.DB_distance:
            clusters.append(html_results_template.format('Cluster' + str(key), results.DB_distance.key))
        return divHolder.format(clusters)
    

