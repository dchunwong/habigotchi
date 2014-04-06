from flask import Flask, render_template, request, redirect, abort, jsonify
from flask.ext.pymongo import PyMongo
from ast import literal_eval
import hashlib
import pymongo

#end authentication
app = Flask(__name__)
app.config["MONGO_DBNAME"] = "habigotchi"
app.config["MONGO_HOST"] = "oceanic.mongohq.com"
app.config["MONGO_PORT"] = 10008
app.config["MONGO_USERNAME"] = "admin"
app.config["MONGO_PASSWORD"] = "1234"
app.debug= True
mongo = PyMongo(app)

m = hashlib.sha256

def authenticate(user, pw):
    users = mongo.db.users
    hashed = m(user+pw).hexdigest()
    return users.find_one({"password": hashed}) != None

@app.route('/', methods=['GET', 'POST'])
def landing():
    if request.method == 'POST':
        print request
        users = mongo.db.users
        check = users.find_one({"name":request.form['Name']})
        if check != None:
            return jsonify({"success": False,"message":"Name taken."})
        else:
            user = {"name": request.form['Name'], 
            "number": request.form['number'],
            "email": request.form['email'],
            "password":m(request.form['Name']+request.form['password']).hexdigest()
            }
            users.insert(user)
            return jsonify({"success": True, "message":"Sign-up successful."})
    else:
        return render_template('signup.html')

# Main Page landing.
@app.route('/main')
def tama_page():
    return 'Hello World!'

# New Habits
@app.route('/new_habit')
def add_habit():
    habits = mongo.db[request.form['name']]
    check = habits.find_one({"habit":request.form["habit"]})
    if check != None:
        return jsonify({"success": False, "message": "Habit exists!"})
    else: 
        habits.insert(request.form.to_dict())
        return jsonify({"success": True, "message": "Habit added!"})

#remove a habit
@app.route('/remove_habits')
def remove_habit():
    return 'Hello World!'

#finish a habit
@app.route('/finish_habit')
def finish_habit():
    return 'Hello World!'

@app.route('/login', methods= ["POST"])
def login():
    recieved = literal_eval(request.data)
    users = mongo.db.users
    auth = authenticate(recieved['name'], recieved['password'])
    if not auth:
        return jsonify({"success": False, "message": "Invalid Name/Password."})
    else:
        user =users.find_one({"password": m(recieved['name']+recieved['password']).hexdigest()})
        return jsonify({"success": True, "data":user})



if __name__ == '__main__':
    app.run()
