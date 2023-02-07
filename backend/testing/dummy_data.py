import requests
import json
import time
import random
from util import RequestHelper

r = RequestHelper()


def init(name, email, pwd):
    r.send_request('POST', '/user/signup/', data={"email": email, "username": name, "password": pwd})

    r.send_request('POST', '/user/login/', data={"username": name, "password": pwd})


def add_recipe(data):
    end = 20
    for i in range(1, 20):
        if not data['strIngredient' + str(i)]:
            end = i
            break

    ingredients = []
    for i in range(1, end):
        ingredients.append({
            'quantity': random.randint(1, 500),
            'units': random.choice(['g', 'kg', 'ml', 'l', 'cups', 'units']),
            'ingredient': data['strIngredient' + str(i)]
        })

    img = data['strMealThumb'].replace('\\', '')
    tags = []
    if data['strTags']:
        tags = data['strTags'].split(',')

    r.send_request('POST',
                   '/recipe/data/',
                   data={
                       'name':
                           data['strMeal'],
                       'method':
                           data['strInstructions'],
                       'plating':
                           'Nice plating',
                       'cuisine':
                           data['strArea'],
                       'cooking_style':
                           random.choice(['Broil', 'Grill', 'Roast', 'Bake', 'Poach', 'Fry', 'Boil', 'Steam', 'Braise', 'Stew']),
                       'meal_type':
                           random.choice(['Breakfast', 'Lunch', 'Dinner', 'Dessert']),
                       'time':
                           random.randint(1, 24) * 10,
                       'servings':
                           random.randint(1, 8),
                       'tags':
                           json.dumps(tags),
                       'ingredients':
                           json.dumps(ingredients)
                   },
                   files={'image': requests.get(img).content})


def log_out():
    r.send_request('POST', '/user/logout/')


def like_recipe(rid, like):
    r.send_request('POST', '/recipe/like/', data={'rid': rid, 'opinion': like})


def subscribe(uid):
    r.send_request('POST', '/subscribe/list/', data={"subscribed_to": uid})


def add_cookbook(name, description):
    r.send_request('POST', '/cookbook/data/', data={'name': name, 'description': description})


def add_recipe_to_cookbook(cid, rid):
    r.send_request('PUT', '/cookbook/data/', data={'id': cid, 'rid': rid})


if __name__ == '__main__':
    RECIPE_PER_USER = 5
    URL = 'https://www.themealdb.com/api/json/v1/1/random.php'

    users = [{
        'username': 'Andrew',
        'email': 'andrew@email.com',
        'pwd': '123456',
        'recipes': RECIPE_PER_USER,
        'likes': []
    }, {
        'username': 'Almersy',
        'email': 'almersy@email.com',
        'pwd': '123456',
        'recipes': RECIPE_PER_USER,
        'likes': [i for i in range(1, RECIPE_PER_USER + 1) if i % 2 == 0]
    }, {
        'username': 'Kexin',
        'email': 'kexin@email.com',
        'pwd': '123456',
        'recipes': RECIPE_PER_USER,
        'likes': [i for i in range(1, 2 * RECIPE_PER_USER + 1) if i % 2 == 1]
    }, {
        'username': 'Matt',
        'email': 'matt@email.com',
        'pwd': '123456',
        'recipes': RECIPE_PER_USER,
        'likes': [i for i in range(1, 3 * RECIPE_PER_USER + 1)]
    }, {
        'username': 'Tim',
        'email': 'tim@email.com',
        'pwd': '123456',
        'recipes': RECIPE_PER_USER,
        'likes': [i for i in range(1, 4 * RECIPE_PER_USER + 1) if i % 2 == 0 or i > (3 * RECIPE_PER_USER)]
    }]

    for user in users:
        NUM_RECIPES = user['recipes']
        USER_EMAIL = user['email']
        USER_NAME = user['username']
        USER_PASSWORD = user['pwd']
        LIKES = user['likes']

        # Log in
        init(USER_NAME, USER_EMAIL, USER_PASSWORD)

        # Add recipes
        for i in range(NUM_RECIPES):
            data = requests.get(URL).json()['meals'][0]
            add_recipe(data)

        # Like recipes
        for like in LIKES:
            like_recipe(like, True)

        # Create cookbook and subscribe
        if USER_NAME == 'Matt':
            subscribe(2)
            subscribe(3)
            add_cookbook('Party Recipes', 'For when you want a good time.')
            for i in range(1, 4 * RECIPE_PER_USER + 1):
                if i % 5 == 1:
                    add_recipe_to_cookbook(1, i)
        if USER_NAME == 'Tim':
            subscribe(2)
            subscribe(4)
            add_cookbook('Tasty recipes', 'A list of recipes that I like to cook and eat.')
            for i in range(1, 5 * RECIPE_PER_USER + 1):
                if i % 5 == 0:
                    add_recipe_to_cookbook(2, i)
        # Log out
        log_out()
