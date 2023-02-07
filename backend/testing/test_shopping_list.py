# """
# Testing file for development purposes.
# """

# import pytest
# import json
# from util import RequestHelper

# r = RequestHelper()

# class TestShoppingList:

#     def test_shopping_list(self):
#         # sign up first user 1
#         r.send_request('POST',
#                        '/user/signup/',
#                        data={
#                            "email": "gordonramsay@email.com",
#                            "username": "GMoney",
#                            "password": "Donkey"
#                        })

#         # login user 1
#         r.send_request('POST', '/user/login/', data={"username": "GMoney", "password": "Donkey"})
#         assert r.status == 200

import requests
import time
import json

s = requests.Session()

BASE_URL = 'http://localhost:3001/app'

# Sign up user 1
print('\nTEST 1: SIGN UP')
resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "gordonramsay@email.com", "username": "GMoney", "password": "Donkey"})
print(resp.json())
time.sleep(1)

# Log in user 1
print('\nTEST 2: LOG IN')
resp = s.post(f'{BASE_URL}/user/login/', data={"username": "GMoney", "password": "Donkey"})
print(resp.json())
time.sleep(1)

# Show empty shopping list
print('\nTEST 3: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Show empty shopping list
print('\nTEST 4: DELETE SHOPPING LIST')
resp = s.delete(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Show empty shopping list
print('\nTEST 5: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Upload recipe ingredient
print('\nTEST 6: UPLOAD RECIPE 1')
resp = s.post(f'{BASE_URL}/recipe/data/',
              data={
                  'name':
                      'Spaghetti with tomato sauce',
                  'method':
                      '1. Boil pasta. 2. Cook sauce. 3. Combine and serve',
                  'plating':
                      'Mix everything and add parsley garnish',
                  'servings':
                      1,
                  'ingredients':
                      json.dumps([{
                          "quantity": 5,
                          "units": "tbsp",
                          "ingredient": "pepper"
                      }, {
                          "quantity": 500,
                          "units": "gram",
                          "ingredient": "pasta"
                      }, {
                          "quantity": 15,
                          "units": "gram",
                          "ingredient": "tomato"
                      }])
              },
              files={'image': open('backend/testing/assets/spaghetti.jpg', 'rb')})
print(resp.json())
recipe1_id = resp.json()['id']
time.sleep(1)

# Add recipe to shopping list
print('\nTEST 7: ADD RECIPE TO SHOPPING LIST')
resp = s.put(f'{BASE_URL}/shoppinglist/recipes/', json={'rid': recipe1_id, 'servings': 1})
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 8: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Delete recipe from shopping list
print('\nTEST 9: DELETE RECIPE FROM SHOPPING LIST')
resp = s.put(f'{BASE_URL}/shoppinglist/recipes/', json={'rid': recipe1_id, 'servings': 0})
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 10: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Add recipe to shopping list
print('\nTEST 11: ADD RECIPE TO SHOPPING LIST')
resp = s.put(f'{BASE_URL}/shoppinglist/recipes/', json={'rid': recipe1_id, 'servings': 2})
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 12: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Add ingredient shopping list
print('\nTEST 13: ADD INGREDIENT TO SHOPPING LIST')
resp = s.post(f'{BASE_URL}/shoppinglist/ingredients/',
              data={
                  'rid':
                      recipe1_id,
                  'ingredients':
                      json.dumps([{
                          "quantity": 1,
                          "units": "cup",
                          "ingredient": "flour"
                      }, {
                          "quantity": 300,
                          "units": "gram",
                          "ingredient": "pasta"
                      }, {
                          "quantity": 1,
                          "units": "",
                          "ingredient": "tomato"
                      }])
              })
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 14: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
iid0 = resp.json()[0]['ingredients'][3]['id']
iid1 = resp.json()[0]['ingredients'][5]['id']
iid2 = resp.json()[0]['ingredients'][0]['id']
iid3 = resp.json()[0]['ingredients'][2]['id']
time.sleep(1)

# amend ingredient
print('\nTEST 15: AMEND INGREDIENTS SHOPPING LIST')
resp = s.put(f'{BASE_URL}/shoppinglist/ingredients/',
             json={
                 'rid':
                     recipe1_id,
                 'ingredients':
                     json.dumps([{
                         "id": iid0,
                         "quantity": 0.5,
                         "units": "cup",
                         "ingredient": "flour"
                     }, {
                         "id": iid1,
                         "quantity": 10,
                         "units": "",
                         "ingredient": "tomato"
                     }])
             })
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 16: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# delete ingredient
print('\nTEST 17: DELETE INGREDIENTS SHOPPING LIST')
resp = s.delete(f'{BASE_URL}/shoppinglist/ingredients/', json={'rid': recipe1_id, 'iid': [iid2, iid3]})
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 18: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# add ingredient not linked to recipe
print('\nTEST 19: ADD INGREDIENT TO SHOPPING LIST')
resp = s.post(f'{BASE_URL}/shoppinglist/ingredients/',
              data={
                  'rid':
                      None,
                  'ingredients':
                      json.dumps([{
                          "quantity": 1,
                          "units": "",
                          "ingredient": "apple"
                      }, {
                          "quantity": 1,
                          "units": "kg",
                          "ingredient": "pasta"
                      }, {
                          "quantity": 1,
                          "units": "cup",
                          "ingredient": "apple"
                      }])
              })
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 20: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
iid4 = resp.json()[1]['ingredients'][0]['id']
iid5 = resp.json()[1]['ingredients'][2]['id']
time.sleep(1)

# amend ingredient
print('\nTEST 21: AMEND INGREDIENTS SHOPPING LIST')
resp = s.put(f'{BASE_URL}/shoppinglist/ingredients/',
             json={
                 'rid': None,
                 'ingredients': json.dumps([{
                     "id": iid4,
                     "quantity": 4,
                     "units": "",
                     "ingredient": "apple"
                 }])
             })
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 22: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# delete ingredient
print('\nTEST 23: DELETE INGREDIENTS SHOPPING LIST')
resp = s.delete(f'{BASE_URL}/shoppinglist/ingredients/', json={'rid': None, 'iid': [iid5]})
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 24: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# show aggregate ingredients
print('\nTEST 25: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/ingredients/')
print(resp.json())
time.sleep(1)

# delete shopping list
print('\nTEST 26: DELETE SHOPPING LIST')
resp = s.delete(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)

# Show shopping list
print('\nTEST 27: SHOW SHOPPING LIST')
resp = s.get(f'{BASE_URL}/shoppinglist/recipes/')
print(resp.json())
time.sleep(1)
