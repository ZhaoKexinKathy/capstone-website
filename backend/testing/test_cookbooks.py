"""
Testing file for development purposes..
"""

import pytest
from util import RequestHelper

r = RequestHelper()


class TestCookbookEndpoints:

    def test_cookbook(self):
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

        # create cookbook 1
        r.send_request('POST',
                       '/cookbook/data/',
                       data={
                           'name': 'Easy recipes',
                           'description': 'Easy recipes that anyone can make.'
                       })
        cookbook1_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # get cookbook 1 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook1_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes'
        assert r.json[0]['cookbook_des'] == 'Easy recipes that anyone can make.'
        assert r.status == 200

        # delete cookbook 1
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook1_id})
        assert r.status == 200
        assert r.json['cid'] == cookbook1_id
        assert r.json['deleted_recipes'] == []
        assert r.json['non_deleted_recipes'] == []

        # get cookbook when there is none
        r.send_request('GET', '/cookbook/data/')
        assert r.json == []
        assert r.status == 200

        # create cookbook 2
        r.send_request('POST',
                       '/cookbook/data/',
                       data={
                           'name': 'Easy recipes',
                           'description': 'Easy recipes that anyone can make.'
                       })
        cookbook2_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes'
        assert r.json[0]['cookbook_des'] == 'Easy recipes that anyone can make.'
        assert r.status == 200

        # update cookbook 2 metadata (no update)
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook2_id})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes'
        assert r.json[0]['cookbook_des'] == 'Easy recipes that anyone can make.'
        assert r.status == 200

        # update cookbook 2 metadata (name update)
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook2_id, 'name': 'Easy recipes 2'})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes 2'
        assert r.json[0]['cookbook_des'] == 'Easy recipes that anyone can make.'
        assert r.status == 200

        # update cookbook 2 metadata (description update)
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook2_id, 'description': 'Part 2'})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes 2'
        assert r.json[0]['cookbook_des'] == 'Part 2'
        assert r.status == 200

        # update cookbook 2 metadata (name and description update)
        r.send_request('PUT',
                       '/cookbook/data/',
                       data={
                           'id': cookbook2_id,
                           'name': 'Easy recipes 3',
                           'description': 'Final Chapter'
                       })
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes 3'
        assert r.json[0]['cookbook_des'] == 'Final Chapter'
        assert r.status == 200

        recipe_list = []

        # upload recipe 1
        r.send_request(
            'POST',
            '/recipe/data/',
            data={
                'name':
                    'Smiling fishies',
                'method':
                    '1. Cook fish. 2. Boil peas. 3. Bake potatoes. 4. Enjoy!',
                'plating':
                    '1. Place potatoes in a circle around the plate. 2. Put a base of peas in the centre of the dish. 3. Placed cooked fish on top of peas.'
            },
            files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe1_id = r.json['id']
        recipe_list.append(recipe1_id)
        assert r.status == 200 or r.status == 201

        # add recipe 1 to cookbook 2
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook2_id, 'rid': recipe1_id})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # upload recipe 2
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Delicious steak',
                           'method': '1. Fry steak. 2. Enjoy!',
                           'plating': '1. Pour milk into bowl. 2. Centre steak in milk. 3. Garnish with jellybeans.'
                       },
                       files={'image': open('backend/testing/assets/steak.jpg', 'rb')})
        recipe2_id = r.json['id']
        recipe_list.append(recipe2_id)
        assert r.status == 200 or r.status == 201

        # add recipe 2 to cookbook 2
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook2_id, 'rid': recipe2_id})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes 3'
        assert r.json[0]['cookbook_des'] == 'Final Chapter'
        assert len(r.json[0]['recipes']) == 2
        assert r.status == 200

        recipe_list.append(recipe2_id * 2)

        # delete recipes from cookbook
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook2_id, 'rid': recipe_list})
        assert r.status == 200
        assert r.json['cid'] == cookbook2_id
        assert r.json['deleted_recipes'] == [recipe1_id, recipe2_id]
        assert r.json['non_deleted_recipes'] == [recipe2_id * 2]

        # get cookbook 2 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook2_id
        assert r.json[0]['cookbook_name'] == 'Easy recipes 3'
        assert r.json[0]['cookbook_des'] == 'Final Chapter'
        assert len(r.json[0]['recipes']) == 0
        assert r.status == 200

        # delete cookbook
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook2_id})
        assert r.status == 200
        assert r.json['message'] == 'Cookbook deleted successfully.'
        assert r.json['cid'] == cookbook2_id

        # create cookbook 3
        r.send_request('POST',
                       '/cookbook/data/',
                       data={
                           'name': 'Best recipes',
                           'description': 'Simply the best. Better than all the rest.'
                       })
        cookbook3_id = r.json['id']
        assert r.status == 200 or r.status == 201

        recipe_list = []

        # upload recipe 3
        r.send_request(
            'POST',
            '/recipe/data/',
            data={
                'name':
                    'Smiling fishies 2',
                'method':
                    '1. Cook fish. 2. Boil peas. 3. Bake potatoes. 4. Enjoy!',
                'plating':
                    '1. Place potatoes in a circle around the plate. 2. Put a base of peas in the centre of the dish. 3. Placed cooked fish on top of peas.'
            },
            files={'image': open('backend/testing/assets/spaghettios.jpg', 'rb')})
        recipe3_id = r.json['id']
        recipe_list.append(recipe3_id)
        assert r.status == 200 or r.status == 201

        # add recipe 3 to cookbook 3
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook3_id, 'rid': recipe3_id})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # upload recipe 4
        r.send_request('POST',
                       '/recipe/data/',
                       data={
                           'name': 'Delicious steak 2',
                           'method': '1. Fry steak. 2. Enjoy!',
                           'plating': '1. Pour milk into bowl. 2. Centre steak in milk. 3. Garnish with jellybeans.'
                       },
                       files={'image': open('backend/testing/assets/steak.jpg', 'rb')})
        recipe4_id = r.json['id']
        recipe_list.append(recipe4_id)
        assert r.status == 200 or r.status == 201

        # add recipe 4 to cookbook 3
        r.send_request('PUT', '/cookbook/data/', data={'id': cookbook3_id, 'rid': recipe4_id})
        assert r.json['message'] == 'Cookbook updated successfully'
        assert r.status == 200

        # get cookbook 3 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook3_id
        assert r.json[0]['cookbook_name'] == 'Best recipes'
        assert r.json[0]['cookbook_des'] == 'Simply the best. Better than all the rest.'
        assert len(r.json[0]['recipes']) == 2
        assert r.status == 200

        # delete recipes from cookbook
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook3_id, 'rid': recipe_list})
        assert r.status == 200
        assert r.json['cid'] == cookbook3_id
        assert r.json['deleted_recipes'] == [recipe3_id, recipe4_id]
        assert r.json['non_deleted_recipes'] == []

        # delete cookbook
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook3_id})
        assert r.status == 200
        assert r.json['message'] == 'Cookbook deleted successfully.'
        assert r.json['cid'] == cookbook3_id

        # create cookbook 4
        r.send_request('POST', '/cookbook/data/', data={'name': 'Final cookbook', 'description': 'The last cookbook.'})
        cookbook4_id = r.json['id']
        assert r.status == 200 or r.status == 201

        # get cookbook 4 data
        r.send_request('GET', '/cookbook/data/')
        assert r.json[0]['cookbook_id'] == cookbook4_id
        assert r.json[0]['cookbook_name'] == 'Final cookbook'
        assert r.json[0]['cookbook_des'] == 'The last cookbook.'
        assert len(r.json[0]['recipes']) == 0
        assert r.status == 200

        # get user 1 details
        r.send_request('GET', '/user/data/')
        u1_id = r.json['id']
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

        # get user 2 cookbook data
        r.send_request('GET', '/cookbook/data/')
        assert r.json == []
        assert r.status == 200

        # get user 1 cookbook data
        r.send_request('GET', '/cookbook/data/', data={'id': u1_id})
        assert r.json[0]['cookbook_id'] == cookbook4_id
        assert r.json[0]['cookbook_name'] == 'Final cookbook'
        assert r.json[0]['cookbook_des'] == 'The last cookbook.'
        assert len(r.json[0]['recipes']) == 0
        assert r.status == 200

        # logout user 2
        r.send_request('POST', '/user/logout/')
        assert r.status == 200

        # login user 1
        r.send_request('POST', '/user/login/', data={"username": "GMoney", "password": "Donkey"})
        assert r.status == 200

        # delete recipes from cookbook
        r.send_request('DELETE', '/cookbook/data/', data={'id': cookbook4_id})
        assert r.status == 200
        assert r.json['cid'] == cookbook4_id
        assert r.json['deleted_recipes'] == []
        assert r.json['non_deleted_recipes'] == []

        # get user 1 cookbook data
        r.send_request('GET', '/cookbook/data/')
        assert r.json == []
        assert r.status == 200

        # get user 2 cookbook data
        r.send_request('GET', '/cookbook/data/', data={'id': u2_id})
        assert r.json == []
        assert r.status == 200


# import requests
# import time
# s = requests.Session()
# BASE_URL = 'http://localhost:3001/app'

# # Sign up
# print('\nTEST 1: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "gordonramsay@email.com", "username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# # Log in
# print('\nTEST 2: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# # Create cookbook
# print('\nTEST 3: CREATE COOKBOOK')
# resp = s.post(f'{BASE_URL}/cookbook/data/', data={
#     'name': 'Easy recipes',
#     'description': 'Easy recipes that anyone can make.',})
# cookbook_id = resp.json()['id']
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 4: GET COOKBOOK METADATA FROM COOKBOOKS THAT EXISTS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Delete cookbook
# print('\nTEST 5: DELETE COOKBOOK')
# resp = s.delete(f'{BASE_URL}/cookbook/data/', json={'id': cookbook_id})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 6: GET COOKBOOK METADATA FROM COOKBOOKS THAT DOES NOT EXIST')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Create cookbook
# print('\nTEST 7: CREATE COOKBOOK')
# resp = s.post(f'{BASE_URL}/cookbook/data/', data={
#     'name': 'Easy recipes',
#     'description': 'Easy recipes that anyone can make.',
# })
# cookbook1_id = resp.json()['id']
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 8: GET COOKBOOK METADATA FROM COOKBOOKS THAT EXISTS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Update cookbook metadata
# print('\nTEST 9: UPDATE COOKBOOK METADATA NO CHANGES')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 10: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Update cookbook metadata
# print('\nTEST 11: UPDATE COOKBOOK NAME')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'name': 'Easy recipes 2'})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 12: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Update cookbook metadata
# print('\nTEST 13: UPDATE COOKBOOK DESCRIPTION')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'description': 'Part 2'})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 14: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Update cookbook metadata
# print('\nTEST 15: UPDATE COOKBOOK NAME & DESCRIPTION')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'name': 'Easy recipes 3', 'description': 'Final Chapter'})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 16: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# recipe_list = []

# # Upload recipe
# print('\nTEST 17: UPLOAD RECIPE 1')
# resp = s.post(
#     f'{BASE_URL}/recipe/data/',
#     data={
#         'name':
#             'Smiling fishies',
#         'method':
#             '1. Cook fish. 2. Boil peas. 3. Bake potatoes. 4. Enjoy!',
#         'plating':
#             '1. Place potatoes in a circle around the plate. 2. Put a base of peas in the centre of the dish. 3. Placed cooked fish on top of peas.'
#     },
#     files={'image': open('testing/assets/fish.jpg', 'rb')})
# print(resp.json())
# recipe1_id = resp.json()['id']
# recipe_list.append(recipe1_id)
# time.sleep(1)

# # Add recipe to cookbook
# print('\nTEST 18: ADD RECIPE TO COOKBOOK')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'rid': recipe1_id})
# print(resp.json())
# time.sleep(1)

# # Upload recipe
# print('\nTEST 19: UPLOAD RECIPE 2')
# resp = s.post(f'{BASE_URL}/recipe/data/',
#               data={
#                   'name': 'Delicious steak',
#                   'method': '1. Fry steak. 2. Enjoy!',
#                   'plating': '1. Pour milk into bowl. 2. Centre steak in milk. 3. Garnish with jellybeans.'
#               },
#               files={'image': open('testing/assets/steak.jpg', 'rb')})
# print(resp.json())
# recipe2_id = resp.json()['id']
# recipe_list.append(recipe2_id)
# time.sleep(1)

# # Add recipe to cookbook
# print('\nTEST 20: ADD RECIPE TO COOKBOOK')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'rid': recipe2_id})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 21: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Delete recipe from cookbook
# print('\nTEST 22: DELETE RECIPE FROM COOKBOOK')
# recipe_list.append(recipe2_id * 2)
# resp = s.delete(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id, 'rid': recipe_list})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 23: GET COOKBOOK METADATA AFTER RECIPE DELETION')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Delete cookbook
# print('\nTEST 24: DELETE COOKBOOK')
# resp = s.delete(f'{BASE_URL}/cookbook/data/', json={'id': cookbook1_id})
# print(resp.json())
# time.sleep(1)

# # Create cookbook
# print('\nTEST 25: CREATE COOKBOOK')
# resp = s.post(f'{BASE_URL}/cookbook/data/',
#               data={
#                   'name': 'Best recipes',
#                   'description': 'Simply the best. Better than all the rest.',
#               })
# cookbook2_id = resp.json()['id']
# print(resp.json())
# time.sleep(1)

# recipe_list = []

# # Upload recipe
# print('\nTEST 26: UPLOAD RECIPE 3')
# resp = s.post(
#     f'{BASE_URL}/recipe/data/',
#     data={
#         'name':
#             'Smiling fishies',
#         'method':
#             '1. Cook fish. 2. Boil peas. 3. Bake potatoes. 4. Enjoy!',
#         'plating':
#             '1. Place potatoes in a circle around the plate. 2. Put a base of peas in the centre of the dish. 3. Placed cooked fish on top of peas.'
#     },
#     files={'image': open('testing/assets/fish.jpg', 'rb')})
# print(resp.json())
# recipe3_id = resp.json()['id']
# recipe_list.append(recipe3_id)
# time.sleep(1)

# # Add recipe to cookbook
# print('\nTEST 27: ADD RECIPE TO COOKBOOK')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook2_id, 'rid': recipe3_id})
# print(resp.json())
# time.sleep(1)

# # Upload recipe
# print('\nTEST 28: UPLOAD RECIPE 4')
# resp = s.post(f'{BASE_URL}/recipe/data/',
#               data={
#                   'name': 'Delicious steak',
#                   'method': '1. Fry steak. 2. Enjoy!',
#                   'plating': '1. Pour milk into bowl. 2. Centre steak in milk. 3. Garnish with jellybeans.'
#               },
#               files={'image': open('testing/assets/steak.jpg', 'rb')})
# print(resp.json())
# recipe4_id = resp.json()['id']
# recipe_list.append(recipe4_id)
# time.sleep(1)

# # Add recipe to cookbook
# print('\nTEST 29: ADD RECIPE TO COOKBOOK')
# resp = s.put(f'{BASE_URL}/cookbook/data/', json={'id': cookbook2_id, 'rid': recipe4_id})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 30: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Delete cookbook
# print('\nTEST 31: DELETE COOKBOOK')
# resp = s.delete(f'{BASE_URL}/cookbook/data/', json={'id': cookbook2_id})
# print(resp.json())
# time.sleep(1)

# # Create cookbook
# print('\nTEST 32: CREATE COOKBOOK')
# resp = s.post(f'{BASE_URL}/cookbook/data/',
#               data={
#                   'name': 'Final cookbook',
#                   'description': 'The last cookbook.',
#               })
# cookbook3_id = resp.json()['id']
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 33: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Get user 1 data
# print('\nTEST 34: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u1_id = resp.json()['id']
# print(u1_id)
# time.sleep(1)

# # Log out user 1
# print('\nTEST 35: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# # Sign up user 2
# print('\nTEST 36: SIGN UP')
# resp = s.post(f'{BASE_URL}/user/signup/', data={"email": "jaimeoliver@email.com", "username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # Log in user 2
# print('\nTEST 37: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "JMan", "password": "BitofSalt"})
# print(resp.json())
# time.sleep(1)

# # Get user 2 data
# print('\nTEST 38: GET USER DATA')
# resp = s.get(f'{BASE_URL}/user/data/')
# u2_id = resp.json()['id']
# print(u2_id)
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 39: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 40: GET COOKBOOK METADATA FROM OTHER USER')
# resp = s.get(f'{BASE_URL}/cookbook/data/', params={'id': u1_id})
# print(resp.json())
# time.sleep(1)

# # Log out user 2
# print('\nTEST 41: LOG OUT')
# resp = s.post(f'{BASE_URL}/user/logout/')
# print(resp.json())
# time.sleep(1)

# # Log in
# print('\nTEST 42: LOG IN')
# resp = s.post(f'{BASE_URL}/user/login/', data={"username": "GMoney", "password": "Donkey"})
# print(resp.json())
# time.sleep(1)

# # Delete cookbook
# print('\nTEST 43: DELETE COOKBOOK')
# resp = s.delete(f'{BASE_URL}/cookbook/data/', json={'id': cookbook3_id})
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 44: GET COOKBOOK METADATA FROM UPDATED COOKBOOKS')
# resp = s.get(f'{BASE_URL}/cookbook/data/')
# print(resp.json())
# time.sleep(1)

# # Fetch cookbook data
# print('\nTEST 45: GET COOKBOOK METADATA FROM OTHER USER')
# resp = s.get(f'{BASE_URL}/cookbook/data/', params={'id': u2_id})
# print(resp.json())
# time.sleep(1)
