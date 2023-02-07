"""
Testing file for development purposes.
"""

import json
import pytest
from util import RequestHelper

r = RequestHelper()


# Sign up
class TestSignupEndpoint:

    def test_signup_initial(self):
        r.send_request('POST', '/user/signup/', data={"email": "matt1@email.com", "username": "matt1", "password": "123456"})
        assert r.status == 201 or r.status == 400

    def test_signup_duplicate_email(self):
        r.send_request('POST', '/user/signup/', data={"email": "matt1@email.com", "username": "matt12345", "password": "123456"})
        assert r.status == 400
        assert r.json['message'] == "A user with that email address already exists"

    def test_signup_duplicate_username(self):
        r.send_request('POST', '/user/signup/', data={"email": "matt124343@email.com", "username": "matt1", "password": "123456"})
        assert r.status == 400
        assert r.json['message'] == "A user with that username already exists"

    def test_signup_invalid_email(self):
        r.send_request('POST', '/user/signup/', data={"email": "matt124343", "username": "matt1456", "password": "123456"})
        assert r.status == 400
        assert r.json['message'] == "Invalid email address"

    def test_signup_password_not_strong_enough(self):
        r.send_request('POST',
                       '/user/signup/',
                       data={
                           "email": "matt124343@email.com",
                           "username": "matt14sad56",
                           "password": "12"
                       })
        assert r.status == 400
        assert r.json['message'] == "Password needs to be 6 characters or longer"


# Log in
class TestLoginEndpoint:

    def test_login_incorrect(self):
        r.send_request('POST', '/user/login/', data={"username": "matt1", "password": "1234567"})
        assert r.status == 400
        assert r.json['message'] == "Username or password is incorrect"

    def test_login_success(self):
        r.send_request('POST', '/user/login/', data={"username": "matt1", "password": "123456"})
        assert r.status == 200
        assert r.json['message'] == "User logged in successfully"


class TestLogoutEndpoint:

    def test_logout(self):
        r.send_request('POST', '/user/logout/')
        assert r.status == 200


class TestUserIsLoggedInEndpoint:

    def test_authenticated_function(self):
        r.send_request('GET', '/user/isloggedin/')
        assert not r.json['user_is_logged_in']

        r.send_request('POST', '/user/login/', data={"username": "matt1", "password": "123456"})

        r.send_request('GET', '/user/isloggedin/')
        assert r.json['user_is_logged_in']


class TestRecipeEndpoints:

    def test_upload_recipe(self):
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        assert r.status == 201

    def test_get_recipe(self):
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        assert r.status == 201
        recipe_id = r.json['id']
        r.send_request('GET', '/recipe/data/', params={'id': recipe_id})

        assert r.status == 200
        assert r.json['image']
        print(r.json['image'])
        assert r.json['name']
        assert r.json['uid']

    def test_get_invalid_recipe(self):
        r.send_request('GET', '/recipe/data/', params={'id': 84634345})

        assert r.status == 404

    def test_delete_recipe(self):
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Spaghetti with tomato sauce',
                           'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                           'plating': 'Mix everything and add parsley garnish',
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        assert r.status == 201
        recipe_id = r.json['id']

        r.send_request('GET', '/recipe/data/', params={'id': recipe_id})

        assert r.status == 200

        r.send_request('DELETE', '/recipe/data/', data={'id': recipe_id})

        assert r.status == 200

        r.send_request('GET', '/recipe/data/', params={'id': recipe_id})

        assert r.status == 404


class TestRecipeWithIngredientsEndpoint:

    def test_recipe_endpoints_with_ingredients(self):
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
                                   "quantity": 5,
                                   "units": "cups",
                                   "ingredient": "pasta"
                               }, {
                                   "quantity": 15,
                                   "units": "grams",
                                   "ingredient": "tomato"
                               }])
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        assert r.status == 201
        recipe_id = r.json['id']

        r.send_request('GET', '/recipe/data/', params={'id': recipe_id})

        assert r.status == 200
        assert r.json['id'] == recipe_id
        assert r.json['name'] == 'Spaghetti with tomato sauce'
        assert r.json['method'] == '1. Boil pasta. 2. Cook sauce. 3. Combine and serve'
        assert r.json['plating'] == 'Mix everything and add parsley garnish'
        assert r.json['ingredients'][0]['rid'] == recipe_id
        assert r.json['ingredients'][1]['rid'] == recipe_id
        assert r.json['ingredients'][2]['rid'] == recipe_id
        assert len(r.json['ingredients']) == 3

        assert r.json['calories'] > 0
        assert r.json['carbs'] > 0
        assert r.json['fats'] > 0
        assert r.json['protein'] > 0

        # Test recipe with no obvious ingredient match
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
                                   "units": "igdfaogadfg",
                                   "ingredient": "43 32 2 2 2asdhsahdjsh a j k d hs a"
                               }])
                       },
                       files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})

        recipe_id = r.json['id']

        r.send_request('GET', '/recipe/data/', params={'id': recipe_id})

        assert r.json['calories'] == 0
        assert r.json['carbs'] == 0
        assert r.json['fats'] == 0
        assert r.json['protein'] == 0
