# import numpy as np

# def nfr_parser(nfrValues, classes, ahpValues):
#     """
#     This function convers nfr input to nfr matrix
#     :param classes: set, a set of classes from the UML in project
#     :param nfrValues: dict, a odict that stores the classes and a dict of nfr weight and it's value as it's value
#     :param ahpValues: dictionary, a dictionary that map each nfr to it's ahp
#     :return: tuple holds dictionary that map each class to it's index in nfr matrix and numpy matrix that represents nfr
#      matrix
     
#      Input example:
#         classesSet = {"A", "B"}
#         ahpDict = {"aa": 0.2, "bb": 0.3, "cc": 0.5}
#         classesObj = {"A": {"aa": 0.1, "bb": 0.4, "cc": 0.5}, "B": {"aa": 0.2, "bb": 0.3, "cc": 0.5}}
#     """
#     classesMap = {}
#     i = 0
#     for className in classes:
#         classesMap[className] = i
#         i += 1

#     nfrMatrix = [[0 for x in range(len(classes))] for y in range(len(classes))]  # fill matrix with 0
#     for i, class1 in enumerate(classes):
#         nfrMatrix[classesMap[class1]][classesMap[class1]] = 1
#         for j, class2 in enumerate(classes, i + 1):
#             nfrDimValue = 0
#             for nfr in ahpValues:
#                 nfrDimValue += (ahpValues[nfr] * (1 - abs((nfrValues[class1][nfr] - nfrValues[class2][nfr]))))

#             nfrMatrix[classesMap[class1]][classesMap[class2]] = nfrDimValue
#             nfrMatrix[classesMap[class2]][classesMap[class1]] = nfrDimValue

#     return {'classes': classesMap, 'matrix_classes' :np.matrix(nfrMatrix)}

import numpy as np
import json

def nfr_parser(nfrValues, uml_json, ahpValues):
    """
    This function convers nfr input to nfr matrix
    :param uml_json: json file contain uml editor
    :param nfrValues: dict, a odict that stores the classes and a dict of nfr weight and it's value as it's value
    :param ahpValues: dictionary, a dictionary that map each nfr to it's ahp
    :return: tuple holds dictionary that map each class to it's index in nfr matrix and numpy matrix that represents nfr
     matrix
     
     Input example:
        uml_json = uml_json from database
        ahpDict = {"aa": 0.2, "bb": 0.3, "cc": 0.5}
        classesObj = {"A": {"aa": 0.1, "bb": 0.4, "cc": 0.5}, "B": {"aa": 0.2, "bb": 0.3, "cc": 0.5}}
    """
    classes = []
    idx = 0  # index of class in matrix
    for node in uml_json["nodeDataArray"]:
        if "type" in node and (node["type"] == "Class" or node["type"] == "Association Class"):
            classes.append([node["name"], idx]) 
            idx += 1
    
    nfrMatrix = [[0 for x in range(len(classes))] for y in range(len(classes))]  # fill matrix with 0
    for i, class1 in enumerate(classes):
        nfrMatrix[class1[1]][class1[1]] = 1.
        for j in range(i + 1, len(classes)):
            class2 = classes[j]
            nfrDimValue = 0
            for nfr in ahpValues:
                nfrValue1 = checkNFRValue(nfrValues[class1[0]][nfr])
                nfrValue2 = checkNFRValue(nfrValues[class2[0]][nfr])
                nfrDimValue += (ahpValues[nfr] * (1 - abs((nfrValue1 - nfrValue2))))

            nfrMatrix[class1[1]][class2[1]] = nfrDimValue
            nfrMatrix[class2[1]][class1[1]] = nfrDimValue
            
    matrix_classes = np.array(nfrMatrix)
    return {
            'classes': classes,
            'matrix_classes': json.dumps(dict(enumerate(matrix_classes.flatten(), 1))),
            'shape': matrix_classes.shape[0]
        }


def checkNFRValue(nfrValue):
    if type(nfrValue) is list:
        return nfrValue[1]
    return nfrValue