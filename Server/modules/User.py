
class User:
    def __init__(self, Username, Password, userProjects=[]):
        self.Username = Username
        self.Password = Password
        self.Projects = userProjects

    def comparePassword(self, toCompare):
        return self.Password == toCompare

    def changePassword(self, newPass):
        self.Password = newPass