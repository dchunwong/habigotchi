from flask import Flask, render_template, request, redirect, abort
from flask.ext.pymongo import PyMongo
import pymongo


#for authentications
from functools import wraps
from flask import request, Response
#end authentication
app = Flask(__name__)
app.config["MONGO_DBNAME"] = "habigotchi"
app.config["MONGO_HOST"] = "oceanic.mongohq.com"
app.config["MONGO_PORT"] = 10008
app.config["MONGO_USERNAME"] = "admin"
app.config["MONGO_PASSWORD"] = "1234"
mongo = PyMongo(app)

@app.route('/', methods=['GET', 'POST'])
def landing():
    if request.method == 'POST':
        user = {"Name": request.form['Name'], 
        "number": request.form['number'], "email": request.form['email']}
        users = mongo.db.users
        user_id = users.insert(user)
        return redirect('/')
    else:
        return render_template('signup.html')
"""
@app.route('/')
def landing():
    return 'Hello World!'
"""

#authentication
def check_auth(username, password):
	"""This function is called to check if a username / password
	   combination is valid.
	"""
	return username == "admin" and password == "secret"

def authenticate():
	"""Sends a 401 response that enables basic auth"""
	return Response(
	'Could not verify your access level for that URL.\n'
	'You have to login with proper credentials', 401,
	{'WWW-Authenticate': 'Basic realm="Login Required"'})




# Main Page landing.
@app.route('/main')
def tama_page():
    return render_template('main.html')

# New Habits
@app.route('/new_habit')
def add_habit():
    return 'Hello World!'

#remove a habit
@app.route('/remove_habits')
def remove_habit():
    return 'Hello World!'

#finish a habit
@app.route('/finish_habit')
def finish_habit():
    return 'Hello World!'



if __name__ == '__main__':
    app.run()
