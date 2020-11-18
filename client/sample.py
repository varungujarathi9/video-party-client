import flask
from flask import *

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Hello World!</h1>'

app.run(port=8000,host="0.0.0.0",debug=True)