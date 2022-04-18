from app import get_app_with_config
from config import RunConfig


app = get_app_with_config(RunConfig)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=443, ssl_context='adhoc')
