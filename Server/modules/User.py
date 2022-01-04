from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, Username, Password, userProjects=[]):
        self.Username = Username
        self.Password = Password
        self.Projects = userProjects

    def comparePassword(self, toCompare):
        return self.Password == toCompare

    def changePassword(self, newPass):
        self.Password = newPass

    # override method
    def get_id(self):
        return self.Username
