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
            "password":m(request.form['Name']+request.form['password']).hexdigest(),
            "habigotchi":{}
            
            }
            users.insert(user)
            return jsonify({"success": True, "message":"Sign-up successful."})
    else:
        return render_template('signup.html')

# Main Page landing.
@app.route('/main')
def tama_page():
    return render_template('main.html')

# New Habits
@app.route('/new_habit')
def add_habit():
    received = literal_eval(request.data)
    habits = mongo.db[received['name']]
    check = habits.find_one({"habit":received["habit"]})
    if check != None:
        return jsonify({"success": False, "message": "Habit exists!"})
    else: 
        habits.insert(received.to_dict())
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
    received = literal_eval(request.data)
    users = mongo.db.users
    auth = authenticate(received['name'], received['password'])
    if not auth:
        return jsonify({"success": False, "message": "Invalid Name/Password."})
    else:
        habits = mongo.db[received['name']]
        user =users.find_one({"password": m(received['name']+received['password']).hexdigest()})

        return jsonify({"success": True, "user":user, "habits":habits})

@app.route('/update', methods=["POST"])
def update():
    received =  request.form
    users = mongo.db.users
    return jsonify({"success":True})
    find = users.find_one({"name":received['owner']})
    header("Content-type: json")
    if find == None:
        return jsonify({"success":False,"message":"User doesn't exist."})
    else:
        users.update({"name":received['owner']}, {"$set":{"habigotchi":request.data}})
        return jsonify({"success":True})

if __name__ == '__main__':
    app.run()
