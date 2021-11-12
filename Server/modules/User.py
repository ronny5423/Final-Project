
UsersID = 1

class User:
    def __init__(self, Username, Password, UserID=UsersID):
        self.Username = Username
        self.Password = Password
        # Manage Users ID
        global UsersID
        if UserID == UsersID:
            UsersID += 1
        self.UserID = UserID

    def comparePassword(self, toCompare):
        return self.Password == toCompare

    def changePassword(self, newPass):
        self.Password = newPass