class RunConfig:
    MONGO_HOST = 'localhost'
    MONGO_PORT = 27017
    MONGO_DBNAME = 'DBSelection'
    MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DBNAME}"


class TestConfig:
    MONGO_HOST = 'localhost'
    MONGO_PORT = 27018
    MONGO_DBNAME = 'DBSelection'
    MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DBNAME}"
