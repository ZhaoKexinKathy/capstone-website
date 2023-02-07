"""
Testing file for development purposes.
"""

import requests
import time

s = requests.Session()

BASE_URL = 'http://localhost:3001/app'

# Log in
resp = s.post(f'{BASE_URL}/user/login/', data={"username": "matt", "password": "123456"})
print(resp.json())
time.sleep(1)

# Upload recipe
resp = s.post(f'{BASE_URL}/recipe/data/',
              data={
                  'name': 'Spaghetti with tomato sauce',
                  'method': '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                  'plating': 'Mix everything and add parsley garnish',
              },
              files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
print(resp.json())
recipe_id = resp.json()['id']
time.sleep(1)

# Upload recipe
resp = s.post(f'{BASE_URL}/recipe/data/',
              data={
                  'name': 'Smiling fishies ',
                  'method': '1. Steam the fish. 2. Scatter some peas. 3. Give it a big smile!',
                  'plating': 'Smile when you serve it.',
              },
              files={'image': open('backend/testing/assets/fish.jpg', 'rb')})
print(resp.json())
recipe_id = resp.json()['id']
time.sleep(1)

# Get user info
resp = s.get(f'{BASE_URL}/user/data/')
# print(resp.json())
time.sleep(1)
