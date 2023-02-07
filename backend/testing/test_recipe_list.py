"""
Testing file for development purposes.
"""

import requests
import time
import pytest

s = requests.Session()

BASE_URL = 'http://localhost:3001/app'


class Request:

    def __init__(self, method, endpoint, params=None, data=None, files=None) -> None:
        if method == 'POST':
            resp = s.request(method=method, url=f'{BASE_URL}{endpoint}', params=params, data=data, files=files)
        else:
            resp = s.request(method=method, url=f'{BASE_URL}{endpoint}', params=params, json=data, files=files)

        self.status = resp.status_code
        self.json = resp.json()


# Sign up
print('TEST 1: SIGN UP\n')
resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "gordonramsay@email.com", "username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# Log in
print('TEST 2: LOG IN\n')
resp = s.post(f'{BASE_URL}/user/login/', data={"username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# Get recipe list
print('TEST 3: GET LIST OF RECIPES\n')
list_type = 'feed'
resp = s.get(f'{BASE_URL}/recipe/feed')
print(resp.status_code)
# print(resp.json())
# time.sleep(1)

# Upload recipe
print('TEST 4: UPLOAD RECIPE 1\n')
resp = s.post(
    f'{BASE_URL}/recipe/data/',
    data={
        'name':
            'Fish with peas and potatoes',
        'method':
            '1. Cook fish. 2. Boil peas. 3. Bake potatoes. 4. Enjoy!',
        'plating':
            '1. Place potatoes in a circle around the plate. 2. Put a base of peas in the centre of the dish. 3. Placed cooked fish on top of peas.',
    },
    files={'image': open('backend/testing/assets/fish.jpg', 'rb')})
# print(resp.json())
recipe_id = resp.json()['id']
# time.sleep(1)

# # Delete recipe
# print('TEST 4a: DELETE RECIPE')
# resp = s.delete(f'{BASE_URL}/recipe/data/', json = {'id': recipe_id})
# print(resp.json())
# time.sleep(1)

# Upload recipe
print('TEST 5: UPLOAD RECIPE 2\n')
resp = s.post(
    f'{BASE_URL}/recipe/data/',
    data={
        'name':
            'RAW Fish',
        'method':
            '1. Cut fish. 2. Prepare salad. 3. Enjoy!',
        'plating':
            '1. Place a bed of salad on the plate. 2. Place cut fish on top of salad bed. 3. Serve with lemon and soy sauce.',
    },
    files={'image': open('backend/testing/assets/sashimi.jpg', 'rb')})
# print(resp.json())
recipe_id = resp.json()['id']
# time.sleep(1)

# Get recipe list
print('TEST 6: GET LIST OF RECIPES AFTER ADDING RECIPES\n')
resp = s.get(f'{BASE_URL}/recipe/feed')
# print(resp.json())
# time.sleep(1)

# # Delete recipe
# print('TEST 6a: DELETE RECIPE')
# resp = s.delete(f'{BASE_URL}/recipe/data/', json = {'id': recipe_id})
# print(resp.json())
# time.sleep(1)

# Log out
print('TEST 7: LOG OUT USER')
resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# Sign up
print('TEST 8: SIGN UP SECOND USER\n')
resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "jamieoliver@email.com", "username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# Log in
print('TEST 9: LOG IN SECOND USER\n')
resp = s.post(f'{BASE_URL}/user/login/', data={"username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# Upload recipe
print('TEST 10: UPLOAD RECIPE 3\n')
resp = s.post(f'{BASE_URL}/recipe/data/',
              data={
                  'name': 'Delicious steak',
                  'method': '1. Fry steak. 2. Enjoy!',
                  'plating': '1. Pour milk into bowl. 2. Centre steak in milk. 3. Garnish with jellybeans.',
              },
              files={'image': open('backend/testing/assets/steak.jpg', 'rb')})
# print(resp.json())
recipe_id = resp.json()['id']
# time.sleep(1)

# Upload recipe
print('TEST 11: UPLOAD RECIPE 4\n')
resp = s.post(
    f'{BASE_URL}/recipe/data/',
    data={
        'name':
            'Spaghetti-Os',
        'method':
            '1. Place spaghetti-os in mold and refridgerate. 2. Boil frankfurts. 3. Strain water and cut frankfurts. 4. Enjoy!',
        'plating':
            '1. Take spaghetti-os out of mold and place on plate. 2. Stuff cut frankfurts in the centre.',
    },
    files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
# print(resp.json())
recipe_id = resp.json()['id']
# time.sleep(1)

# Get recipe list
print('TEST 12: GET LIST OF RECIPES AFTER ADDING RECIPE FROM SECOND USER\n')
list_type = 'feed'
resp = s.get(f'{BASE_URL}/recipe/feed')
# print(resp.json())
# time.sleep(1)


def test_search_function():
    r = Request('GET', '/recipe/search/', params={'search_query': 'Spaghetti'})
    assert len(r.json) > 0
    assert r.status == 200

    r = Request('GET', '/recipe/search/', params={'search_query': 'DannyDevito'})
    assert len(r.json) == 0
    assert r.status == 200
