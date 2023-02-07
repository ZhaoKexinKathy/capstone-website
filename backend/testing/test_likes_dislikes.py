"""
Testing file for development purposes..
"""

import pytest
from util import RequestHelper

r = RequestHelper()


class TestSignupEndpoint:

    def test_get_likes(self):
        # sign up
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay@email.com",
                           "username": "GMoney",
                           "password": "Donkey"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney", "password": "Donkey"})

        # upload recipe
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        recipe_id = r.json['id']

        # GET recipe likes
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['total_rating'] == 0
        assert r.json['user_rating'] == 0

    def test_post_likes(self):
        # signup
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay@email.com",
                           "username": "GMoney",
                           "password": "Donkey"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney", "password": "Donkey"})

        # upload recipe
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        recipe_id = r.json['id']

        # POST user likes that recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': True})
        assert r.status == 200

        # GET recipe likes
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['total_rating'] == 1
        assert r.json['user_rating'] == 1

        # POST user dislikes recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': False})
        assert r.status == 200

        # GET recipe likes
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['total_rating'] == -1
        assert r.json['user_rating'] == -1

        # DELETE user likes for that recipe
        r.send_request('DELETE', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200

        # GET recipe likes
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['total_rating'] == 0
        assert r.json['user_rating'] == 0

    def test_multiple_users_like(self):
        # USER 1 test
        # signup
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay1@email.com",
                           "username": "GMoney1",
                           "password": "Donkey1"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney1", "password": "Donkey1"})

        # upload recipe
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        recipe_id = r.json['id']

        # POST user likes that recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': True})
        assert r.status == 200

        # logout
        r.send_request('POST', '/user/logout/')

        # USER 2 test
        # signup
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay2@email.com",
                           "username": "GMoney2",
                           "password": "Donkey2"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney2", "password": "Donkey2"})

        # POST user likes that recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': True})
        assert r.status == 200

        # logout
        r.send_request('POST', '/user/logout/')

        # USER 3 test
        # signup
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay3@email.com",
                           "username": "GMoney3",
                           "password": "Donkey3"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney3", "password": "Donkey3"})

        # POST user likes that recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': True})
        assert r.status == 200

        # logout
        r.send_request('POST', '/user/logout/')

        # USER 4 test
        # signup
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "gordonramsay4@email.com",
                           "username": "GMoney4",
                           "password": "Donkey4"
                       })

        # login
        r.send_request('POST', '/user/login/', data={"username": "GMoney4", "password": "Donkey4"})

        # recipe should have 3 likes by now
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['user_rating'] == 0
        assert r.json['total_rating'] == 3

        # POST user likes that recipe
        r.send_request('POST', '/recipe/like/', data={'rid': recipe_id, 'opinion': False})
        assert r.status == 200

        # recipe should have 2 likes total now
        r.send_request('GET', '/recipe/like/', data={'rid': recipe_id})
        assert r.status == 200
        assert r.json['user_rating'] == -1
        assert r.json['total_rating'] == 2

        # logout
        r.send_request('POST', '/user/logout/')
