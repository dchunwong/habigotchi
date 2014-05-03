habigotchi
==========

Habit tomagotchi 

Dependencies
============

- Flask-PyMongo
- pymongo

How to Run
==========

    python app.py
    
Habigotchi API
==============

## Signing up

- Send POST request to / with JSON object with fields name, number, email, password.
- Returns JSON object with success: bool, and message

## Logging in

- Send POST request to /login with JSON object with fields name and password.
- Returns JSON object with success: bool, and user: object with user info, and habits: list of habit objects. message if fail.

## Updating Habigotchi

- Send POST request with JSON object with fields name: owner, and habigotchi: new habigotchi info.
- Returns JSON object with success: bool, message if fail

## Adding a Habit

- Send POST request to /new_habit with JSON object with fields name, and habit.
- Returns JSON object with fields success: bool, and message

## Finishing and removing a habit

To be implemented.
