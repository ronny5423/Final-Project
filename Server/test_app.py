from app import get_app_with_config
from config import TestConfig

app = get_app_with_config(TestConfig)

if __name__ == '__main__':
    app.run(debug=True)
