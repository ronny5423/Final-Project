import numpy as np

def nfr_parser(classes, nfrValues, ahpValues):
    """
    This function convers nfr input to nfr matrix
    :param classes: set, a set of classes in project
    :param nfrValues: dict, a odict that stores the classes and a dict of nfr weight and it's value as it's value
    :param ahpValues: dictionary, a dictionary that map each nfr to it's ahp
    :return: tuple holds dictionary that map each class to it's index in nfr matrix and numpy matrix that represents nfr
     matrix
    """
    classesMap = {}
    i = 0
    for className in classes:
        classesMap[className] = i
        i += 1

    nfrMatrix = [[0 for x in range(len(classes))] for y in range(len(classes))]  # fill matrix with 0
    for i, class1 in enumerate(classes):
        nfrMatrix[classesMap[class1]][classesMap[class1]] = 1
        for j, class2 in enumerate(classes, i + 1):
            nfrDimValue = 0
            for nfr in ahpValues:
                nfrDimValue += (ahpValues[nfr] * (1 - abs((nfrValues[class1][nfr] - nfrValues[class2][nfr]))))

            nfrMatrix[classesMap[class1]][classesMap[class2]] = nfrDimValue
            nfrMatrix[classesMap[class2]][classesMap[class1]] = nfrDimValue

    return {'classes': classesMap, 'matrix_classes' :np.matrix(nfrMatrix)}