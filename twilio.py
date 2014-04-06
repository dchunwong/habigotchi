from twilio.rest import TwilioRestClient
from pymongo import MongoClient

mongo_client = MongoClient('mongodb://admin:1234@oceanic.mongohq.com:10008/habigotchi')
db = client.habigotchi

account_sid = "AC3ba3ae312fcb6146df7fd56b1dee9f0c"
auth_token  = "12a54623749a4e2aad21aeb7c347b3b0"
twilio_client = TwilioRestClient(account_sid, auth_token)

"""
Sends the message given a user name.
"""
def send_message(user, feeling):
    user_data = db.find_one({"user": user})
    user_number = user_data["phone_number"]
    user_habits = user_data["habits"]
    message = "Hey " + user + "! Don't forget to "
    for h in user_habits:
        message += habit
    message += (" " + user_data["habigotchi"] " feels " + feeling + " right now.")

    try:
        send = client.sms.messages.create(body=message,
              to="+15108597126",    # Replace with user_number
              from_="+14242640939") # Replace with your Twilio number

print message.sid
