import json
import pytest
from util import RequestHelper

r = RequestHelper()


def print_recipe(data):
    new = []
    for i in data:
        del i['image']
        new.append(i)

    print(new)


r.send_request('POST', '/user/signup/', data={"email": "matt1@email.com", "username": "matt1", "password": "123456"})
r.send_request('POST', '/user/login/', data={"username": "matt1", "password": "123456"})
r.send_request('POST',
               '/recipe/data/',
               data={
                   'name':
                       'Spaghetti with tomato sauce',
                   'method':
                       '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                   'plating':
                       'Mix everything and add parsley garnish',
                   'cuisine':
                       'Mexican',
                   'cooking_style':
                       'Boiled',
                   'meal_type':
                       'Dinner',
                   'time':
                       100,
                   'tags':
                       json.dumps(['Fast', 'easy']),
                   'ingredients':
                       json.dumps([{
                           "quantity": 5,
                           "units": "tbsp",
                           "ingredient": "pepper"
                       }, {
                           "quantity": 5,
                           "units": "cups",
                           "ingredient": "pasta"
                       }, {
                           "quantity": 15,
                           "units": "kg",
                           "ingredient": "beef"
                       }])
               },
               files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

# print(r.status)

r.send_request('GET', 'recipe/advanced_search/', params={'tag': 'Easy'})
print_recipe(r.json)
