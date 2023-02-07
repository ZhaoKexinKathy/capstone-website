"""
Helper functions for app
"""
import base64
import json
import pathlib

import requests
from django.forms.models import model_to_dict

from . import models

# HTTP status codes

HTTP_200_OK = 200
HTTP_201_CREATED = 201
HTTP_202_ACCEPTED = 202
HTTP_204_NO_CONTENT = 204
HTTP_400_BAD_REQUEST = 400
HTTP_401_UNAUTHORIZED = 401
HTTP_403_FORBIDDEN = 403
HTTP_404_NOT_FOUND = 404
HTTP_405_METHOD_NOT_ALLOWED = 405
HTTP_500_INTERNAL_SERVER_ERROR = 500
HTTP_501_NOT_IMPLEMENTED = 501


def check_exists(db_class, **kwargs):
    """
    Checks whether a resulting query exists. Returns `None` if no record is found
    """
    try:
        return db_class.objects.filter(**kwargs)[0]
    except IndexError:
        return None


def get_request_data(request):
    """
    Handler for getting request data from either POST data fields or body
    """

    if request.method == 'GET':
        return request.GET.dict()

    if request.POST:
        return request.POST.dict()
    else:
        return json.loads(request.body.decode('utf-8'))


def get_single_recipe(uid, rid):
    """
    Helper function for getting all data related to a single recipe
    """
    ret = model_to_dict(models.Recipe.objects.get(id=rid))
    if ret['image']:
        ret['image'] = 'data:image/*;base64, ' + str(base64.b64encode(ret['image'].read()))[2:-1]
    else:
        ret['image'] = ''

    creator_user_model = models.User.objects.get(id=ret['uid'])
    ret['uploaded_by'] = creator_user_model.username
    ret['is_subscribed'] = is_subscribed(uid, ret['uid'])
    ret['user_rating'] = get_user_like(uid, rid)
    ret['total_rating'] = calc_total_likes(rid)

    ret['ingredients'] = []
    for i in models.Ingredients.objects.filter(rid=rid):
        ret['ingredients'].append(model_to_dict(i))

    ret['tags'] = []
    for tag in models.Tags.objects.filter(rid=rid):
        ret['tags'].append(tag.tag)

    # change nutrition to per serving
    ret['calories'] = float(ret['calories']) / float(ret['servings'])
    ret['protein'] = float(ret['protein']) / float(ret['servings'])
    ret['carbs'] = float(ret['carbs']) / float(ret['servings'])
    ret['fats'] = float(ret['fats']) / float(ret['servings'])

    return ret


def calc_total_user_likes(id, cid):
    """
    Calculate the number of likes that a user has for some contributors recipes
    """
    total_user_likes = 0
    for recipe in models.Recipe.objects.filter(uid=cid):
        if check_exists(models.RecipeLikes, uid=id, rid=recipe.id):
            likes = models.RecipeLikes.objects.get(uid=id, rid=recipe.id)
            if likes.opinion:
                total_user_likes = total_user_likes + 1
            else:
                total_user_likes = total_user_likes - 1
    return total_user_likes


def calc_total_likes(recipe_id):
    """
    Calculate the number of likes minus dislikes that a recipe has
    """
    total_likes = 0
    for likes in models.RecipeLikes.objects.filter(rid=recipe_id):
        if likes.opinion:
            total_likes += 1
        else:
            total_likes -= 1
    return total_likes


def get_user_like(user_id, recipe_id):
    """
    Return whether the user likes or dislikes a recipe (or no opinion)
    """

    user_likes = 0

    if check_exists(models.RecipeLikes, uid=user_id, rid=recipe_id):
        obj = models.RecipeLikes.objects.get(uid=user_id, rid=recipe_id)
        if obj.opinion:
            user_likes = 1
        else:
            user_likes = -1

    return user_likes


def new_and_trending():
    trending = []
    for recipe in models.Recipe.objects.filter():
        recipe_id = recipe.id
        recipe_likes = calc_total_likes(recipe_id)
        trending.append([recipe_likes, recipe_id])
    return trending


def query_nutrition(ingredients):
    """
    Get nutritional information for an ingredients list from the nutritionix API
    """
    keys = get_api_keys()

    ingredient_strs = []
    for i in ingredients:
        ingredient_strs.append(' '.join([str(i['quantity']), i['units'], i['ingredient']]))

    formatted_ingredients = ', '.join(ingredient_strs)

    headers = {
        'x-app-id': keys['APP_ID'],
        'x-app-key': keys['APP_KEY'],
        'x-remote-user-id': '0',
    }

    body = {"query": formatted_ingredients}

    r = requests.post('https://trackapi.nutritionix.com/v2/natural/nutrients', headers=headers, data=body)

    nutrition = {'calories': 0, 'protein': 0, 'carbs': 0, 'fats': 0, 'weight': 0}

    if r.status_code == 200:
        for i in r.json()['foods']:
            nutrition['calories'] += i['nf_calories']
            nutrition['protein'] += i['nf_protein']
            nutrition['carbs'] += i['nf_total_carbohydrate']
            nutrition['fats'] += i['nf_total_fat']
            nutrition['weight'] += i['serving_weight_grams']
    else:
        print(f'Nutritionix API returned status code {r.status_code}')

    return nutrition


def get_api_keys():
    """
    Read API key file
    """
    path = pathlib.Path(__file__).parent.parent.parent.resolve()  # get project base directory
    path = pathlib.Path(path, 'keys.json')  # get keys.json file path

    try:
        with open(path, 'r') as f:
            return json.load(f)
    except:
        raise FileNotFoundError(
            'keys.json not found in the project root directory. Please email ScrumLegends for relevant 3rd party API keys')


def calc_nutrition_tags(calories, fats, protein, weight, servings):
    """
    Add tags based on nutritional information
    """
    # based on https://www.foodstandards.gov.au/code/Documents/Sched%204%20Nutrition%20and%20health%20claims%20v159.pdf
    tags = []

    # High protein >10g/serving
    if protein / servings >= 10.0:
        tags.append('High Protein')

    if weight == 0:
        return tags

    else:
        # Low fat <3g/100g
        if (fats / weight) * 100 <= 3.0:
            tags.append('Low fat')

        # Low calorie <40cal/100g
        if (calories / weight) * 100 <= 40.0:
            tags.append('Low Calories')
    return tags


def aggregate_list(total_ingredients, ingredient):
    """
    Aggregate ingredients into a normalised list
    """
    quantity = ingredient.quantity
    units = ingredient.units
    name = ingredient.ingredient

    # Convert units into lowest common denominator (grams, mL, other)
    quantity, units = unit_conversion(quantity, units)

    # Check in ingredient is already in list
    place, exists = ingredient_exists(total_ingredients, name, units)

    if exists:
        # add ingredient to existing
        total_ingredients[place]['quantity'] += quantity
    else:
        # add new ingredient
        total_ingredients.append({'quantity': quantity, 'units': units, 'name': name})

    return total_ingredients


def unit_conversion(amount, units):
    """
    Convert user-inputted units into grams and millilitres
    """
    units = units.lower().replace(' ', '')
    if units in ['tsp', 'tsps', 'teaspoon', 'teaspoons']:
        # Convert to grams: 1tsp = 5 gram
        amount = amount * 5
        units = 'g'
    elif units in ['tbsp', 'tbsps', 'tablespoon', 'tablespoons']:
        # Convert to grams: 1tbsp = 20 gram
        amount = amount * 20
        units = 'g'
    elif units in ['kg', 'kgs', 'kilo', 'kilos', 'kilogram', 'kilograms']:
        # Convert to grams: 1kg = 1000 gram
        amount = amount * 1000
        units = 'g'
    elif units in ['cup', 'cups']:
        # Convert to mL: 1cup = 250 mL
        amount = amount * 250
        units = 'mL'
    elif units in ['l', 'ls', 'litre', 'litres', 'liter', 'liters']:
        # Convert to mL: 1L = 1000 mL
        amount = amount * 1000
        units = 'mL'
    elif units in ['g', 'gs', 'gram', 'grams']:
        # No conversion
        units = 'g'
    elif units in ['ml', 'mls', 'millilitre', 'millilitres', 'milliliter', 'milliliters']:
        # No conversion
        units = 'mL'
    else:
        # No conversion
        pass
    return amount, units


def ingredient_exists(total_ingredients, name, units):
    """
    Return the index and existence of a specific ingredient
    """
    exists = False
    place = 0
    for i, ingredient in enumerate(total_ingredients):
        if ingredient['name'] == name and ingredient['units'] == units:
            place = i
            exists = True
            break
    return place, exists


def adjust_units(total_ingredients):
    """
    Normalise units to kg and L
    """
    for i, ingredient in enumerate(total_ingredients):
        if ingredient['quantity'] >= 1000.0:
            if ingredient['units'] == 'g':
                total_ingredients[i]['quantity'] = total_ingredients[i]['quantity'] / 1000
                total_ingredients[i]['units'] = 'kg'
            elif ingredient['units'] == 'mL':
                total_ingredients[i]['quantity'] = total_ingredients[i]['quantity'] / 1000
                total_ingredients[i]['units'] = 'L'
    return total_ingredients


def is_subscribed(id1, id2):
    """
    Return whether user with id=id1 is subscribed to a user with id=id2
    """
    return bool(check_exists(models.Subscribed, u1=id1, u2=id2))
