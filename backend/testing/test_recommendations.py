"""
Testing file for development purposes.
"""

import pytest
import json
from util import RequestHelper

r = RequestHelper()


class TestComments:

    def test_comments(self):
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

        # find recipe recommendations
        r.send_request('GET', '/recipe/recommendation/', data={"rid": 1})
        assert r.status == 200


# import requests
# import time
# import json

# s = requests.Session()

# BASE_URL = 'http://localhost:3001/app'

# # request recipes using the recommendation_recipes.py file

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

# # find recipe recommendations
# print('\nTEST 3: RECIPE RECOMMENDATION')
# resp = s.get(f'{BASE_URL}/recipe/recommendation/', params={"rid": 1})
# print(resp.json())
# time.sleep(1)
