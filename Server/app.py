from flask import Flask, render_template, send_from_directory
import time

app = Flask(__name__, static_url_path='')


# app.config['SERVER_NAME'] = ''

@app.route("/")
def default():
    return app.send_static_file('index.html')

@app.route("/home")
def home():
    return {'time': time.time()}


@app.route("/testArea")
def testArea():
    return "This is a Test Area."


if __name__ == "__main__":
    app.run(debug=True)
