"""
Testing file for development purposes.
"""

import pytest
from util import RequestHelper

r = RequestHelper()


class TestSubscribeEndpoint:

    def test_subscribe_endpoints(self):
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

        # get user 1 details
        r.send_request('GET', '/user/data/')
        u1_id = r.json['id']
        u1_username = r.json['username']
        assert r.status == 200

        # logout user 1
        r.send_request('POST', '/user/logout/')
        assert r.status == 200

        # sign up first user 2
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "jaimeoliver@email.com",
                           "username": "JMan",
                           "password": "BitofSalt"
                       })

        # login user 2
        r.send_request('POST', '/user/login/', data={"username": "JMan", "password": "BitofSalt"})
        assert r.status == 200

        # get user 2 details
        r.send_request('GET', '/user/data/')
        u2_id = r.json['id']
        assert r.status == 200

        # JMan subscribed to GMoney
        r.send_request('POST', '/subscribe/list/', data={"subscribed_to": u1_id})
        assert r.status == 201
        assert r.json['message'] == str(u2_id) + ' subscribed to ' + str(u1_id)

        # list of users JMan's subscribed to
        r.send_request('GET', '/subscribe/list/')
        assert r.status == 200
        assert r.json['subscribed'][0]['id'] == u1_id
        assert r.json['subscribed'][0]['name'] == u1_username

        # JMan unsubscribed from GMoney
        r.send_request('DELETE', '/subscribe/list/', data={"unsubscribe": u1_id})
        assert r.status == 200
        assert r.json['message'] == str(u2_id) + ' unsubscribed from ' + str(u1_id)

        # list of users JMan's subscribed to (should be empty)
        r.send_request('GET', '/subscribe/list/')
        assert r.status == 200
        assert r.json['subscribed'] == []


# import requests
# import time

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

# # Get user 1 data
# print('\nTEST 3: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u1_id = resp.json()['id']
# print(resp.json())
# time.sleep(1)

# # Log out user 1
# print('\nTEST 4: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# # Sign up user 2
# print('\nTEST 5: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "jaimeoliver@email.com", "username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # Log in user 2
# print('\nTEST 6: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # User 2 subscribes to user 1
# print('\nTEST 7: SUBSCRIBE TO USER')
# resp = s.post(f'{BASE_URL}/subscribe/list/', data={"subscribed_to": u1_id})
# print(resp.json())
# time.sleep(1)

# # Get user 1 data
# print('\nTEST 8: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/', params={'id': u1_id})
# subscribed = resp.json()['subscribed']
# print(resp.json())
# print(subscribed)
# time.sleep(1)

# # Get list of contributors user 2 is subscribed to
# print('\nTEST 9: LIST OF SUBSCRIBED USERS')
# resp = s.get(f'{BASE_URL}/subscribe/list/')
# print(resp.json())
# time.sleep(1)

# # Unsubscribe from user 1
# print('\nTEST 10: UNSUBSCRIBE')
# resp = s.delete(f'{BASE_URL}/subscribe/list/', json={"unsubscribe": u1_id})
# print(resp.json())
# time.sleep(1)

# # Get list of contributors user 2 is subscribed to
# print('\nTEST 11: LIST OF SUBSCRIBED USERS')
# resp = s.get(f'{BASE_URL}/subscribe/list/')
# print(resp.json())
# time.sleep(1)