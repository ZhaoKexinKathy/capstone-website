"""
Testing file for development purposes.
"""

import pytest
from util import RequestHelper

r = RequestHelper()


class TestUserFeed:

    def test_user_feed(self):
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
        assert r.status == 200

        # upload recipe 1
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Smiling Fish by GR',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe1_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 2
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Delicious Steak by GR',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe2_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 3
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaget by GR',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe3_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # logout user 1
        r.send_request('POST', '/user/logout/')
        assert r.status == 200

        # user 2
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

        # upload recipe 4
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Steak by JO',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe4_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 5
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Fish by JO',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe5_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 6
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Chicken by JO',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe6_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 7
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Vegetable by JO',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe7_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 8
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Pasta by JO',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe8_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # user 2 likes recipe 1
        r.send_request('POST', '/recipe/like/', data={'rid': recipe1_id, 'opinion': True})
        assert r.status == 200

        # user 2 likes recipe 2
        r.send_request('POST', '/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
        assert r.status == 200

        # user 2 likes recipe 3
        r.send_request('POST', '/recipe/like/', data={'rid': recipe3_id, 'opinion': True})
        assert r.status == 200

        # logout user 2
        r.send_request('POST', '/user/logout/')
        assert r.status == 200

        # user 3
        # sign up first user 3
        r.send_request('POST', '/user/signup/', data={"email": "yeschef@email.com", "username": "Chef", "password": "YeScHeF"})

        # login user 3
        r.send_request('POST', '/user/login/', data={"username": "Chef", "password": "YeScHeF"})
        assert r.status == 200

        # get user 3 details
        r.send_request('GET', '/user/data/')
        u3_id = r.json['id']
        assert r.status == 200

        # upload recipe 9
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Chocolate by Chef',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe9_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # upload recipe 10
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Icecubes by Chef',
                       },
                       files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe10_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # user 3 likes recipe 2
        r.send_request('POST', '/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
        assert r.status == 200

        # user 3 likes recipe 3
        r.send_request('POST', '/recipe/like/', data={'rid': recipe3_id, 'opinion': True})
        assert r.status == 200

        # user 2 likes recipe 4
        r.send_request('POST', '/recipe/like/', data={'rid': recipe4_id, 'opinion': True})
        assert r.status == 200

        # user 2 likes recipe 7
        r.send_request('POST', '/recipe/like/', data={'rid': recipe7_id, 'opinion': True})
        assert r.status == 200

        # logout user 3
        r.send_request('POST', '/user/logout/')
        assert r.status == 200

        # user 4
        # sign up first user 4
        r.send_request('POST', '/user/signup/', data={"email": "champion@email.com", "username": "Champ", "password": "qazwsx"})

        # login user 4
        r.send_request('POST', '/user/login/', data={"username": "Champ", "password": "qazwsx"})
        assert r.status == 200

        # get user 4 details
        r.send_request('GET', '/user/data/')
        u4_id = r.json['id']
        assert r.status == 200

        # user 4 likes recipe 2
        r.send_request('POST', '/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
        assert r.status == 200

        # user 4 likes recipe 4
        r.send_request('POST', '/recipe/like/', data={'rid': recipe4_id, 'opinion': True})
        assert r.status == 200

        # user 4 likes recipe 5
        r.send_request('POST', '/recipe/like/', data={'rid': recipe5_id, 'opinion': True})
        assert r.status == 200

        # user 4 likes recipe 6
        r.send_request('POST', '/recipe/like/', data={'rid': recipe6_id, 'opinion': True})
        assert r.status == 200

        # user 4 likes recipe 7
        r.send_request('POST', '/recipe/like/', data={'rid': recipe7_id, 'opinion': True})
        assert r.status == 200

        # user 4 likes recipe 8
        r.send_request('POST', '/recipe/like/', data={'rid': recipe8_id, 'opinion': True})
        assert r.status == 200

        # user 4 subscribed to user 1
        r.send_request('POST', '/subscribe/list/', data={"subscribed_to": u1_id})
        assert r.status == 201 or r.status == 200
        assert r.json['message'] == str(u4_id) + ' subscribed to ' + str(u1_id) or r.json['message'] == str(
            u4_id) + ' already subscribed to ' + str(u1_id)

        # user 4 subscribed to user 2
        r.send_request('POST', '/subscribe/list/', data={"subscribed_to": u2_id})
        assert r.status == 201 or r.status == 200
        assert r.json['message'] == str(u4_id) + ' subscribed to ' + str(u2_id) or r.json['message'] == str(
            u4_id) + ' already subscribed to ' + str(u2_id)

        # user feed (feed)
        r.send_request('GET', '/recipe/feed/')
        assert r.status == 200
        # assert r.json == [4, 7, 5, 6, 8, 2, 3, 1] # this test was run only outputting recipe ids rather than recipe objects

        # user feed (trending)
        r.send_request('GET', '/recipe/trending/')
        assert r.status == 200
        # assert r.json == [2, 3, 4, 7, 1, 5, 6, 8, 9, 10] # this test was run only outputting recipe ids rather than recipe objects


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
# print(u1_id)
# time.sleep(1)

# # Upload recipe 1
# print('\nTEST 4a: UPLOAD RECIPE 1')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Smiling Fish by GR'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe1_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 2
# print('\nTEST 4b: UPLOAD RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Delicious Steak by GR'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe2_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 3
# print('\nTEST 4c: UPLOAD RECIPE 3')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Spaget by GR'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe3_id = resp.json()['id']
# time.sleep(1)

# # Log out user 1
# print('\nTEST 5: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# # Sign up user 2
# print('\nTEST 6: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "jaimeoliver@email.com", "username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # Log in user 2
# print('\nTEST 7: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # Get user 2 data
# print('\nTEST 8: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u2_id = resp.json()['id']
# print(u2_id)
# time.sleep(1)

# # Upload recipe 4
# print('\nTEST 9a: UPLOAD RECIPE 4')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Steak by JO'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe4_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 5
# print('\nTEST 9b: UPLOAD RECIPE 5')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Fish by JO'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe5_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 6
# print('\nTEST 9c: UPLOAD RECIPE 6')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Chicken by JO'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe6_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 7
# print('\nTEST 9d: UPLOAD RECIPE 7')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Vegetable by JO'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe7_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 8
# print('\nTEST 9e: UPLOAD RECIPE 8')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Pasta by JO'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe8_id = resp.json()['id']
# time.sleep(1)

# # User 2 likes recipe 1
# print('\nTEST 10a: LIKE RECIPE 1')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe1_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 2 likes recipe 2
# print('\nTEST 10b: LIKE RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 2 likes recipe 3
# print('\nTEST 10c: LIKE RECIPE 3')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe3_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # Log out user 2
# print('\nTEST 11: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# # Sign up user 3
# print('\nTEST 12: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "yeschef@email.com", "username": "Chef", "password": "YeScHeF"})
# print(resp.json())
# time.sleep(1)

# # Log in user 3
# print('\nTEST 13: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "Chef", "password": "YeScHeF"})
# print(resp.json())
# time.sleep(1)

# # Get user 1 data
# print('\nTEST 14: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u3_id = resp.json()['id']
# print(u3_id)
# time.sleep(1)

# # Upload recipe 9
# print('\nTEST 15a: UPLOAD RECIPE 9')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Chocolate by Chef'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe9_id = resp.json()['id']
# time.sleep(1)

# # Upload recipe 10
# print('\nTEST 15b: UPLOAD RECIPE 10')
# resp = s.post(f'{BASE_URL}/recipe/data/', data={'name': 'Icecubes by Chef'},
#     files={'image': open('testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
# recipe10_id = resp.json()['id']
# time.sleep(1)

# # User 3 likes recipe 2
# print('\nTEST 16a: LIKE RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 3 likes recipe 3
# print('\nTEST 16b: LIKE RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe3_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 3 likes recipe 4
# print('\nTEST 16c: LIKE RECIPE 4')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe4_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 3 likes recipe 4
# print('\nTEST 16d: LIKE RECIPE 7')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe7_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # Log out user 3
# print('\nTEST 17: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())

# # Sign up user 4
# print('\nTEST 18: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "champion@email.com", "username": "Champ", "password": "qazwsx"})
# print(resp.json())
# time.sleep(1)

# # Log in user 4
# print('\nTEST 19: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "Champ", "password": "qazwsx"})
# print(resp.json())
# time.sleep(1)

# # Get user 4 data
# print('\nTEST 20: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u4_id = resp.json()['id']
# print(u4_id)
# time.sleep(1)

# # User 4 likes recipe 2
# print('\nTEST 21a: LIKE RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe2_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 likes recipe 4
# print('\nTEST 21b: LIKE RECIPE 4')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe4_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 likes recipe 5
# print('\nTEST 21c: LIKE RECIPE 5')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe5_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 likes recipe 6
# print('\nTEST 21d: LIKE RECIPE 6')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe6_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 likes recipe 7
# print('\nTEST 21e: LIKE RECIPE 7')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe7_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 likes recipe 8
# print('\nTEST 21f: LIKE RECIPE 8')
# resp = s.post(f'{BASE_URL}/recipe/like/', data={'rid': recipe8_id, 'opinion': True})
# print(resp.json())
# time.sleep(1)

# # User 4 subscribes to user 1
# print('\nTEST 22a: SUBSCRIBE TO USER')
# resp = s.post(f'{BASE_URL}/subscribe/list/', data={"subscribed_to": u1_id})
# print(resp.json())
# time.sleep(1)

# # User 4 subscribes to user 2
# print('\nTEST 22b: SUBSCRIBE TO USER')
# resp = s.post(f'{BASE_URL}/subscribe/list/', data={"subscribed_to": u2_id})
# print(resp.json())
# time.sleep(1)

# # User 4 feed
# print('\nTEST 23: USER FEED')
# resp = s.get(f'{BASE_URL}/recipe/feed/')
# print(resp.json())
# time.sleep(1)

# # User 4 feed
# print('\nTEST 24: USER FEED')
# resp = s.get(f'{BASE_URL}/recipe/trending/')
# print(resp.json())
# time.sleep(1)
