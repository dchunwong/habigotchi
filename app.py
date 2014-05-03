from flask import Flask, render_template, request, redirect, abort, jsonify
from flask.ext.pymongo import PyMongo
from ast import literal_eval
import json
import pymongo
from bson.json_util import dumps
import hashlib
import datetime

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
        users = mongo.db.users
        print("request: " + request.form['name'])
        check = users.find_one({"name":request.form['name']})
        #print(check)
        if check != None:
            return jsonify({"success": False,"message":"Name taken."})
        else:
            user = {"name": request.form['name'], 
            "number": request.form['number'],
            "email": request.form['email'],
            "password":m(request.form['name']+request.form['password']).hexdigest(),
            "habigotchi":{}
            
            }
            users.insert(user)
            return jsonify({"success": True, "message":"Sign-up successful."})
    else:
        return render_template('index.html')

# Main Page landing.
@app.route('/main')
def tama_page():
    return render_template('main.html')

# New Habits
@app.route('/new_habit', methods=['POST'])
def add_habit():
    received = request.form
    habits = mongo.db[received['name']]
    check = habits.find_one({"habit":received["habit"]})
    if check != None:
        return jsonify({"success": False, "message": "Habit exists!"})
    else: 
        habits.insert(received.to_dict())
        return jsonify({"success": True, "message": "Habit added!"})

#remove a habit
@app.route('/remove_habit')
def remove_habit():
    return 'Hello World!'

#finish a habit
@app.route('/finish_habit')
def finish_habit():
    received = request.get_json()
    habits = mongo.db[received['name']]
    check = habits.find_one({"habit":received["habit"]})
    if check == None:
        return jsonify({"success": False, "message": "Habit does not exist!"})
    else:
        if check.done:
            return jsonify({"success": False, "message": "Habit Checked already."})
        today = datetime.date.today()
        if check.type == "W":
            week = today+datetime.timedelta(days=-today.weekday())
            habits.update({"habit":received["habit"]}, {"$set":{"done":str(week)}})
        else:
            habits.update({"habit":received["habit"]}, {"$set":{"done":str(today)}})

        return jsonify({"success":True})

@app.route('/login', methods= ["POST"])
def login():
    received = request.form
    users = mongo.db.users
    auth = authenticate(received['name'], received['password'])
    if not auth:
        return jsonify({"success": False, "message": "Invalid Name/Password."})
    else:
        habits = mongo.db[received['name']]
        user =users.find_one({"password": m(received['name']+received['password']).hexdigest()})
        all_habits = habits.find()
        for habit in all_habits:
            if check_habit(habit) != 1:
                habit.done = None
        habits_list = [dumps(habit) for habit in all_habits]

        return jsonify({"success": True, "user":dumps(user), "habits":habits_list})

@app.route('/update', methods=["POST"])
def update():
    received =  request.form
    users = mongo.db.users
    find = users.find_one({"name":received['owner']})
    header("Content-type: json")
    if find == None:
        return jsonify({"success":False,"message":"User doesn't exist."})
    else:
        users.update({"name":received['owner']}, {"$set":{"habigotchi":request.data}})
        return jsonify({"success":True})

# Helper functions

def check_habit(habit):
    today = datetime.date.today()
    week = today + datetime.timedelta(days=-today.weekday())
    done = datetime.datetime.strptime(str(habit.done), "%Y-%m-%d")
    if habit.type == "W":
        if week - done > datetime.timedelta(14):
            return -1
        elif week - done >= datetime.timedelta(7):
            return 0
        else:
            return 1
    elif habit.type == "D":
        if today - done >= datetime.timedelta(2):
            return -1
        elif today - done == datetime.timedelta(1):
            return 0
        else:
            return 1

if __name__ == '__main__':
    app.run()
