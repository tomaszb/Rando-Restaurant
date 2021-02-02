from flask import Flask
from flask import request, jsonify
import os
from dotenv import load_dotenv
import time
import googlemaps
from googleAPI import findRestaurants

app = Flask(__name__)
load_dotenv(dotenv_path="./.flaskenv")

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/getRestaurant', methods=['POST'])
def get_restaurant():
    gmaps = googlemaps.Client(key=os.getenv('GOOGLE_KEY')) 
    request_json = request.get_json()
    longitude = request_json['longitude']
    latitude = request_json['latitude']
    location = (float(latitude), float(longitude))
    
    randoRest = findRestaurants(gmaps, location)
    randoRest.getPages()
    toReturn = randoRest.getRandom()

    return {'rando': toReturn}


    