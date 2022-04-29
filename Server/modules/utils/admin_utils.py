from database import *


def updateAHP(data):
    db.updateAHPWeights(data.get('AHP'))


def getAHP():
    return db.getAHPWeights()

def find_added_nfrs(old_nfr_att, new_nfr_att):
    new_att_list = list(set(new_nfr_att) - set(old_nfr_att))
    return new_att_list

def updateDBprofilesNFR(new_nfr_obj, added_nfrs):
    db_profiles = db.getDBProfiles()
    for profile in db_profiles:
        for new_att in added_nfrs:
            db_profiles[profile][new_att] = new_nfr_obj[new_att]['defaultValue']
    db.updateDBProfile(db_profiles)

def updateAllNFREditors(new_nfr_obj, added_nfrs):
    nfr_editors = db.get_all_nfr_editors()
    for editor in nfr_editors:
        for cls in editor['undecipheredJson']:
            for new_att in added_nfrs:
                editor['undecipheredJson'][cls][new_att] = new_nfr_obj[new_att]['defaultValue']
        db.update_nfr_editor_undecipheredJson(editor)

def updateNFR(data):
    db.updateNFRWeights(data.get('nfrWeights'))
    old_nfr_att = db.getNFRAttributes()
    added_nfrs = find_added_nfrs(old_nfr_att['Attributes'] ,data.get('nfrAttributes'))
    updateDBprofilesNFR(data.get('nfrAttributes'), added_nfrs)
    updateAllNFREditors(data.get('nfrAttributes'), added_nfrs)
    db.updateNFRAttributes(data.get('nfrAttributes'))

def getNFRWeights():
    return db.getNFRWeights()['Weights']

def getNFRAttributes():
    return db.getNFRAttributes()['Attributes']

def getNFR():
    return {'Weights': getNFRWeights(), 'Attributes': getNFRAttributes()}

def getUsers(indexes):
    users = db.getUsernamesByIndexes(indexes)
    return users


def getProjects(indexes):
    projects = db.getProjectsByIndexes(indexes)
    proj = []
    for p in projects['Projects']:
        if not hasattr(p, 'Weights'):
            p.setWeights(db.getAHPWeights())
        proj.append(p.project_preview())
    projects['Projects'] = proj
    return projects

def getDBProfiles():
    return db.getDBProfiles()

def updateDBProfiles(profiles):
    db.updateDBProfile(profiles)
