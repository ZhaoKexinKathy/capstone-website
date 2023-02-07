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

        # upload recipe 1
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name':
                               'Spaghetti with tomato sauce but better',
                           'method':
                               '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating':
                               'Mix everything and add parsley garnish',
                           'servings':
                               2,
                           'ingredients':
                               json.dumps([{
                                   "quantity": 2,
                                   "units": "tbsp",
                                   "ingredient": "pepper"
                               }, {
                                   "quantity": 500,
                                   "units": "gram",
                                   "ingredient": "pasta"
                               }, {
                                   "quantity": 1,
                                   "units": "",
                                   "ingredient": "tomato"
                               }])
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
        recipe0_id = r.json['id']
        assert r.status == 200 or r.status == 201

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

        # post comment on recipe that does not exist
        recipe1_id = recipe0_id + 4729382
        r.send_request('POST', '/comment/list/', data={"rid": recipe1_id, "comment": "First comment."})
        assert r.status == 404

        # post comment
        r.send_request('POST', '/comment/list/', data={"rid": recipe0_id, "comment": "First comment."})
        assert r.status == 201

        # get comments
        r.send_request('GET', '/comment/list/', data={"rid": recipe0_id})
        assert r.status == 200
        assert len(r.json) == 1
        cid0 = r.json[0]['id']

        # post comment
        r.send_request('POST',
                       '/comment/list/',
                       data={
                           "rid":
                               recipe0_id,
                           "comment":
                               """His palms are sweaty, knees weak arms spaghetti
                                    There’s vomit on his spaghetti already, mom’s spaghetti
                                    He’s spaghetti, but on the surface he looks calm and ready
                                    To drop spaghetti but he keeps on forgetting what he spaghetti"""
                       })
        assert r.status == 201

        # get comments
        r.send_request('GET', '/comment/list/', data={"rid": recipe0_id})
        assert r.status == 200
        assert len(r.json) == 2
        cid1 = r.json[1]['id']

        # amend comment
        r.send_request('PUT', '/comment/list/', data={"rid": recipe0_id, "cid": cid1, "comment": "Spaget"})
        assert r.status == 200

        # get comments
        r.send_request('GET', '/comment/list/', data={"rid": recipe0_id})
        assert r.status == 200
        assert len(r.json) == 2
        assert r.json[1]['comment'] == "Spaget"

        # amend comment that does not exist
        cid2 = cid1 + 485933
        r.send_request('PUT', '/comment/list/', data={"rid": recipe0_id, "cid": cid2, "comment": "Spaget"})
        assert r.status == 404

        # delete comment
        r.send_request('DELETE', '/comment/list/', data={"rid": recipe0_id, "cid": cid0})
        assert r.status == 200

        # get comments
        r.send_request('GET', '/comment/list/', data={"rid": recipe0_id})
        assert r.status == 200
        assert len(r.json) == 1

        # delete comment that does not exist
        r.send_request('DELETE', '/comment/list/', data={"rid": recipe0_id, "cid": cid0})
        assert r.status == 404


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

# # Upload recipe ingredient
# print('\nTEST 3: UPLOAD RECIPE 1')
# resp = s.post(f'{BASE_URL}/recipe/data/',
#               data={
#                   'name':
#                       'Spaghetti with tomato sauce',
#                   'method':
#                       '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
#                   'plating':
#                       'Mix everything and add parsley garnish',
#                   'servings':
#                       1,
#                   'ingredients':
#                       json.dumps([{
#                           "quantity": 5,
#                           "units": "tbsp",
#                           "ingredient": "pepper"
#                       }, {
#                           "quantity": 500,
#                           "units": "gram",
#                           "ingredient": "pasta"
#                       }, {
#                           "quantity": 15,
#                           "units": "gram",
#                           "ingredient": "tomato"
#                       }])
#               },
#               files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
# print(resp.json())
# recipe1_id = resp.json()['id']
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

# # Post comment
# print('\nTEST 7: POST COMMENT')
# resp = s.post(f'{BASE_URL}/comment/list/', data={"rid": recipe1_id, "comment":
#                                     "First comment."})
# print(resp.json())
# time.sleep(1)

# # Get comments
# print('\nTEST 8: GET COMMENTS')
# resp = s.get(f'{BASE_URL}/comment/list/', params={"rid": recipe1_id})
# cid0 = resp.json()[0]['id']
# print(resp.json())
# time.sleep(1)

# # Post comment
# print('\nTEST 9: POST COMMENT')
# resp = s.post(f'{BASE_URL}/comment/list/', data={"rid": recipe1_id, "comment":
#                                     """His palms are sweaty, knees weak arms spaghetti
#                                     There’s vomit on his spaghetti already, mom’s spaghetti
#                                     He’s spaghetti, but on the surface he looks calm and ready
#                                     To drop spaghetti but he keeps on forgetting what he spaghetti"""})
# print(resp.json())
# time.sleep(1)

# # Get comments
# print('\nTEST 10: GET COMMENTS')
# resp = s.get(f'{BASE_URL}/comment/list/', params={"rid": recipe1_id})
# cid1 = resp.json()[1]['id']
# print(resp.json())
# time.sleep(1)

# # Amend comment
# print('\nTEST 11: AMEND COMMENT')
# resp = s.put(f'{BASE_URL}/comment/list/', json={"rid": recipe1_id, "cid": cid1, "comment": "Spaget"})
# print(resp.json())
# time.sleep(1)

# # Get comments
# print('\nTEST 12: GET COMMENTS')
# resp = s.get(f'{BASE_URL}/comment/list/', params={"rid": recipe1_id})
# print(resp.json())
# time.sleep(1)

# # Amend comment that does not exist
# cid2 = cid1 + 47392
# print('\nTEST 13: AMEND COMMENT')
# resp = s.put(f'{BASE_URL}/comment/list/', json={"rid": recipe1_id, "cid": cid2, "comment": "Spaget"})
# print(resp.json())
# time.sleep(1)

# # Delete comment
# print('\nTEST 14: DELETE COMMENT')
# resp = s.delete(f'{BASE_URL}/comment/list/', json={"rid": recipe1_id, "cid": cid0})
# print(resp.json())
# time.sleep(1)

# # Get comments
# print('\nTEST 15: GET COMMENTS')
# resp = s.get(f'{BASE_URL}/comment/list/', params={"rid": recipe1_id})
# print(resp.json())
# time.sleep(1)

# # Delete comment that does not exist
# print('\nTEST 16: DELETE COMMENT')
# resp = s.delete(f'{BASE_URL}/comment/list/', json={"rid": recipe1_id, "cid": cid0})
# print(resp.json())
# time.sleep(1)
