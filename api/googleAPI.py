import googlemaps
from datetime import datetime
import random
import time

class findRestaurants:
    def __init__(self, client, location, min_price=1, max_price=4, radius=3000, type="restaurant"):
        self.location = location
        self.min_price = min_price
        self.max_price = max_price
        self.radius = radius
        self.type = type
        self.client = client
        self.results = []

    def getRandom(self):
        return random.choice(self.results)

    def getPages(self, pages=3):
        i = 0
        results = []
        next_page = None

        try:
            full_result = self.client.places_nearby(location = self.location,
                                      min_price = self.min_price,
                                      max_price = self.max_price,
                                      open_now = True,
                                      radius = self.radius,
                                      type = "restaurant")

        except ApiError as err:
            return "Api Error: {0}".format(err)
        except Exception as e:
            return "Uncaught Error: {0}".format(e)
            
        if full_result['status'] == 'OK':
            results = results + full_result['results']
            if 'next_page_token' in full_result:
                next_page = full_result['next_page_token']

        else:
            return "Error"

        while (i < 20) and (next_page != None):
            time.sleep(3)
            full_result = self.client.places_nearby(location = self.location,
                                      min_price = self.min_price,
                                      max_price = self.max_price,
                                      open_now = True,
                                      radius = self.radius,
                                      type = "restaurant",
                                      page_token=next_page)
            
            if full_result['status'] == 'OK':
                results = results + full_result['results']
                if 'next_page_token' in full_result:
                    next_page = full_result['next_page_token']
                else:
                    next_page = None
                    break

            else:
                return

            i = i+1
        
        self.results = results
        return results
 