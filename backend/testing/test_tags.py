"""
Testing file for development purposes.
"""

import json
import pytest
from util import RequestHelper

r = RequestHelper()


# Sign up
class TestTagEndpoints:

    def test_recipe_with_and_without_tags(self):
        # sign up first user 1
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay@email.com",
                           "username": "GMoney",
                           "password": "Donkey"
                       })

        # login user 1
        r.send_request('POST', '/user/login/', data={"username": "GMoney", "password": "Donkey"})
        assert r.status == 200

        # upload recipe no tags
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Smiling Fish by GR',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe1_id = r.json['id']
        assert r.status == 201

        # get recipe tags
        r.send_request('GET', '/recipe/data/', params={'id': recipe1_id})
        tags = r.json['tags']
        assert r.status == 200
        assert len(tags) == 0

        # delete recipe
        r.send_request('DELETE', '/recipe/data/', data={'id': recipe1_id})
        assert r.status == 200

        # upload recipe - nutrition tags
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name':
                               'Spaghetti with tomato sauce',
                           'method':
                               '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating':
                               'Mix everything and add parsley garnish',
                           'ingredients':
                               json.dumps([{
                                   "quantity": 5,
                                   "units": "tbsp",
                                   "ingredient": "pepper"
                               }, {
                                   "quantity": 1,
                                   "units": "cups",
                                   "ingredient": "pasta"
                               }, {
                                   "quantity": 15,
                                   "units": "grams",
                                   "ingredient": "tomato"
                               }])
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
        recipe2_id = r.json['id']
        assert r.status == 201

        # get recipe tags
        r.send_request('GET', '/recipe/data/', params={'id': recipe2_id})
        tags = r.json['tags']
        assert r.status == 200
        assert len(tags) == 2

        # delete recipe
        r.send_request('DELETE', '/recipe/data/', data={'id': recipe2_id})
        assert r.status == 200

        # upload recipe - nutrition tags + manual tags
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name':
                               'Spaghetti with tomato sauce',
                           'method':
                               '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating':
                               'Mix everything and add parsley garnish',
                           'ingredients':
                               json.dumps([{
                                   "quantity": 5,
                                   "units": "tbsp",
                                   "ingredient": "pepper"
                               }, {
                                   "quantity": 1,
                                   "units": "cups",
                                   "ingredient": "pasta"
                               }, {
                                   "quantity": 15,
                                   "units": "grams",
                                   "ingredient": "tomato"
                               }]),
                           'tags':
                               json.dumps(['Healthy', 'Easy', 'Super-Tasty'])
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
        recipe3_id = r.json['id']
        assert r.status == 201

        # get recipe tags
        r.send_request('GET', '/recipe/data/', params={'id': recipe3_id})
        tags = r.json['tags']
        assert r.status == 200
        assert len(tags) == 5

        # delete recipe
        r.send_request('DELETE', '/recipe/data/', data={'id': recipe3_id})
        assert r.status == 200


# import requests
# import time
# import json

# s = requests.Session()

# BASE_URL = 'http://localhost:3001/app'

# # Sign up user 1
# print('\nTEST 1: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "gordonramsay@email.com", "username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# # Log in user 1
# print('\nTEST 2: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# # Upload recipe no tags
# print('\nTEST 3: UPLOAD RECIPE 1')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Smiling Fish by GR'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe1_id = resp.json()['id']
# time.sleep(1)

# # Get recipe
# print('\nTEST 4: GET RECIPE 1')
# resp = s.get(f'{BASE_URL}/recipe/data/', params={'id': recipe1_id})
# print(resp.json()['tags'])
# time.sleep(1)

# # Delete recipe
# print('\nTEST 5: DELETE RECIPE 1')
# resp = s.delete(f'{BASE_URL}/recipe/data/', json={'id': recipe1_id})
# print(resp.json())
# time.sleep(1)

# # Upload recipe ingredient tags
# print('\nTEST 6: UPLOAD RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={
#                             'name':
#                                'Spaghetti with tomato sauce',
#                             'method':
#                                '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
#                             'plating':
#                                'Mix everything and add parsley garnish',
#                             'servings': 10,
#                             'ingredients':
#                                json.dumps([{
#                                    "quantity": 5,
#                                    "units": "tbsp",
#                                    "ingredient": "pepper"
#                                    }, {
#                                    "quantity": 1,
#                                    "units": "cups",
#                                    "ingredient": "pasta"
#                                    }, {
#                                    "quantity": 15,
#                                    "units": "grams",
#                                    "ingredient": "tomato"
#                                     }])
#                        },
#                        files={'image': open('testing/assets/spaghetti.jpg', 'rb')})
# print(resp.json())
# recipe2_id = resp.json()['id']
# time.sleep(1)

# # Get recipe
# print('\nTEST 7: GET RECIPE 2')
# resp = s.get(f'{BASE_URL}/recipe/data/', params={'id': recipe2_id})
# print(resp.json()['tags'])
# time.sleep(1)

# # Delete recipe
# print('\nTEST 8: DELETE RECIPE 2')
# resp = s.delete(f'{BASE_URL}/recipe/data/', json={'id': recipe2_id})
# print(resp.json())
# time.sleep(1)

# # Upload recipe ingredient tags
# print('\nTEST 9: UPLOAD RECIPE 3')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={
#                             'name':
#                                'Spaghetti with tomato sauce',
#                             'method':
#                                '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
#                             'plating':
#                                'Mix everything and add parsley garnish',
#                             'servings': 10,
#                             'ingredients':
#                                json.dumps([{
#                                    "quantity": 5,
#                                    "units": "tbsp",
#                                    "ingredient": "pepper"
#                                    }, {
#                                    "quantity": 1,
#                                    "units": "cups",
#                                    "ingredient": "pasta"
#                                    }, {
#                                    "quantity": 15,
#                                    "units": "grams",
#                                    "ingredient": "tomato"
#                                     }]),
#                             'tags':
#                                 json.dumps(['Healthy', 'Easy', 'Super-Tasty'])
#                        },
#                        files={'image': open('testing/assets/spaghetti.jpg', 'rb')})
# print(resp.json())
# recipe3_id = resp.json()['id']
# time.sleep(1)

# # Get recipe
# print('\nTEST 10: GET RECIPE 3')
# resp = s.get(f'{BASE_URL}/recipe/data/', params={'id': recipe3_id})
# print(resp.json()['tags'])
# time.sleep(1)

# # Delete recipe
# print('\nTEST 11: DELETE RECIPE 3')
# resp = s.delete(f'{BASE_URL}/recipe/data/', json={'id': recipe3_id})
# print(resp.json())
# time.sleep(1)
