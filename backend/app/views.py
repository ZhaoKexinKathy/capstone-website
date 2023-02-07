"""
API Endpoints
"""

import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.forms.models import model_to_dict
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods
from . import models, util
from thefuzz import fuzz

import base64

RECIPE_LIMIT = 33


def test_endpoint(request):
    return JsonResponse({'message': 'Test successful'})


@require_http_methods(["POST"])
def login_user(request):
    """
    Log the user in with the provided credentials
    """
    # Get email and password from POST request fields
    request_data = util.get_request_data(request)
    username = request_data["username"]
    password = request_data["password"]

    # Inbuilt django authentication function to query sqlite db
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)  # stores session token locally
        return JsonResponse({"message": "User logged in successfully", 'user_id': request.user.id}, status=util.HTTP_200_OK)

    else:
        return JsonResponse({"message": "Username or password is incorrect"}, status=util.HTTP_400_BAD_REQUEST)


@require_http_methods(["POST"])
def signup_user(request):
    """
    Create a user account and log the user in
    """
    # Get email and password from POST request fields
    request_data = util.get_request_data(request)
    email = request_data["email"].lower()
    password = request_data["password"]
    username = request_data["username"]

    if util.check_exists(User, email=email):
        return JsonResponse({"message": "A user with that email address already exists"}, status=util.HTTP_400_BAD_REQUEST)

    if util.check_exists(User, username=username):
        return JsonResponse({"message": "A user with that username already exists"}, status=util.HTTP_400_BAD_REQUEST)

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"message": "Invalid email address"}, status=util.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return JsonResponse({"message": "Password needs to be 6 characters or longer"}, status=util.HTTP_400_BAD_REQUEST)

    # Password strength checker to prevent weak passwords (disabled for demonstration and testing purposes)
    # try:
    #     validate_password(password)
    # except ValidationError:
    #     return JsonResponse({"message": "Password not strong enough"}, status=util.HTTP_400_BAD_REQUEST)

    # The Django inbuilt user creation function stores passwords with the PBKDF2 algorithm and a SHA256 hash
    new_user = User.objects.create_user(username=username, email=email, password=password)
    new_user.save()

    login_user(request)

    return JsonResponse({"message": "User created", "user_id": new_user.id}, status=util.HTTP_201_CREATED)


@require_http_methods(["POST"])
def logout_user(request):
    """
    Logout user by deleting the session token
    """
    logout(request)
    return JsonResponse({"message": "User logged out"}, status=util.HTTP_200_OK)


@require_http_methods(['GET'])
def check_user_is_logged_in(request):
    return JsonResponse({'user_is_logged_in': request.user.is_authenticated, 'user_id': request.user.id}, status=util.HTTP_200_OK)


@require_http_methods(['POST', 'GET', 'DELETE'])
def single_recipe_data(request):
    if request.method == 'POST':
        request_data = util.get_request_data(request)
        ingredients = []
        tags = []
        if 'ingredients' in request_data:
            ingredients = json.loads(request_data['ingredients'])
            del request_data['ingredients']  # remove ingredients from recipe request_data
        if 'tags' in request_data:
            tags = json.loads(request_data['tags'])
            del request_data['tags']  # remove tags from recipe request_data

        if 'name' in request_data and request_data['name'] == '':
            return JsonResponse({'message': 'Please input the name of the recipe'}, status=util.HTTP_400_BAD_REQUEST)

        if not request_data['time'].isdigit():
            return JsonResponse({'message': 'Please input correct preparation time of the recipe'},
                                status=util.HTTP_400_BAD_REQUEST)

        if 'image' in request_data and request_data['image'] == '':
            return JsonResponse({'message': 'Please upload a photo of the recipe'}, status=util.HTTP_400_BAD_REQUEST)

        if 'servings' in request_data and request_data['servings'] == '':
            return JsonResponse({'message': 'Please enter the number of servings'}, status=util.HTTP_400_BAD_REQUEST)

        if int(request_data['servings']) <= 0:
            return JsonResponse({'message': 'Number of servings must be positive'}, status=util.HTTP_400_BAD_REQUEST)

        if ingredients == []:
            return JsonResponse({'message': 'Please add the ingredients of the recipe'}, status=util.HTTP_400_BAD_REQUEST)

        if 'method' in request_data and request_data['method'] == '':
            return JsonResponse({'message': 'Please input the steps to prepare the recipe'}, status=util.HTTP_400_BAD_REQUEST)

        if 'meal_type' in request_data and request_data['meal_type'] == '':
            return JsonResponse({'message': 'Meal-type cannot be empty'}, status=util.HTTP_400_BAD_REQUEST)

        new_recipe = models.Recipe.objects.create(**request_data, uid=request.user.id, user_fk=request.user)
        file_ext = request.FILES['image'].name.split('.')[-1]
        new_recipe.image.save(f'{new_recipe.id}.{file_ext}', request.FILES['image'])

        for i in ingredients:
            new_ingredient = models.Ingredients.objects.create(**i, rid=new_recipe.id, recipe_fk=new_recipe)
            new_ingredient.save()

        nutrition = util.query_nutrition(ingredients)
        new_recipe.calories = nutrition['calories']
        new_recipe.carbs = nutrition['carbs']
        new_recipe.fats = nutrition['fats']
        new_recipe.protein = nutrition['protein']
        new_recipe.save()

        # Save tags to tags table
        for tag in tags:
            new_tag = models.Tags.objects.create(tag=tag, rid=new_recipe.id, recipe_fk=new_recipe)
            new_tag.save()

        # Create tags based on recipe nutrition
        if 'servings' in request_data:
            servings = float(request_data['servings'])
        else:
            servings = 1.0
        nutrition_tags = util.calc_nutrition_tags(nutrition['calories'], nutrition['fats'], nutrition['protein'],
                                                  nutrition['weight'], servings)

        for nutrition_tag in nutrition_tags:
            new_tag = models.Tags.objects.create(tag=nutrition_tag, rid=new_recipe.id, recipe_fk=new_recipe)
            new_tag.save()

        return JsonResponse({'message': 'Recipe created successfully', 'id': new_recipe.id}, status=util.HTTP_201_CREATED)

    elif request.method == 'GET':
        request_data = util.get_request_data(request)
        recipe_id = request_data['id']

        if not util.check_exists(models.Recipe, id=recipe_id):
            return JsonResponse({'message': "A recipe with that id doesn't exist in the database"},
                                status=util.HTTP_404_NOT_FOUND)

        ret = util.get_single_recipe(request.user.id, recipe_id)

        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'DELETE':
        request_data = util.get_request_data(request)
        recipe_id = request_data['id']

        if not util.check_exists(models.Recipe, id=recipe_id, uid=request.user.id):
            return JsonResponse({'message': "A recipe with that id, for that user, doesn't exist in the database"},
                                status=util.HTTP_404_NOT_FOUND)

        models.Recipe.objects.get(id=recipe_id, uid=request.user.id).delete()
        return JsonResponse({'message': 'Recipe deleted successfully'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET', 'PUT'])
def user_data(request):
    """
    GET: Retrieve user data
    PUT: Update user data
    """
    if request.method == 'GET':
        subscribed = False

        if not request.GET:
            user_id = request.user.id
        else:
            user_id = request.GET['id']
            subscribed = util.is_subscribed(request.user.id, user_id)

        if not util.check_exists(models.User, id=user_id):
            return JsonResponse({'message': "A user with that id doesn't exist in the database"}, status=util.HTTP_404_NOT_FOUND)

        user_model = model_to_dict(models.User.objects.get(id=user_id))

        ret = {}
        ret['id'] = user_model['id']
        ret['username'] = user_model['username']
        ret['email'] = user_model['email']
        ret['subscribed'] = subscribed
        ret['date_joined'] = user_model['date_joined']
        ret['last_login'] = user_model['last_login']
        ret['recipes'] = []

        for recipe in models.Recipe.objects.filter(uid=user_id):
            ret['recipes'].append(util.get_single_recipe(request.user.id, recipe.id))

        ret['curr_user'] = (request.user.id == int(user_id))
        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'PUT':
        request_data = util.get_request_data(request)

        user = models.User.objects.get(id=request.user.id)
        user.email = request_data['email']
        user.save()

        return JsonResponse({'message': 'User updated successfully'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET'])
def get_cookbook_by_cid(request):
    request_data = util.get_request_data(request)
    ret = []

    for i in models.CookbookMetadata.objects.filter(id=request_data['cid']):
        cookbook = {}
        cookbook['uid'] = i.uid
        cookbook['cookbook_id'] = i.id
        cookbook['cookbook_name'] = i.name
        cookbook['cookbook_des'] = i.description
        cookbook['recipes'] = []
        for j in models.Cookbook.objects.filter(cid=request_data['cid']):
            recipe = util.get_single_recipe(cookbook['uid'], j.rid)
            cookbook['recipes'].append(recipe)

        cookbook['curr_user'] = (cookbook['uid'] == request.user.id)
        ret.append(cookbook)

    if not ret:
        return JsonResponse(ret, status=util.HTTP_404_NOT_FOUND, safe=False)

    return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)


@require_http_methods(['POST', 'GET', 'PUT', 'DELETE'])
# Function that creates a new cookbook for a user
# Function that gets all fields from the CookbookMetaData model for a cookbook id
# Function that edits all fields from the CookbookMetaData model for a cookbook id
# Function that deletes a cookbook from a users cookbook list
def cookbook_data(request):
    if request.method == 'POST':
        request_data = util.get_request_data(request)
        new_cookbook = models.CookbookMetadata.objects.create(**request_data, uid=request.user.id, user_fk=request.user)
        new_cookbook.save()

        return JsonResponse({'message': 'Cookbook created successfully', 'id': new_cookbook.id}, status=util.HTTP_201_CREATED)

    elif request.method == 'GET':
        request_data = util.get_request_data(request)
        ret = []

        if 'id' in request_data:
            uid = request_data['id']
        else:
            uid = request.user.id

        for i in models.CookbookMetadata.objects.filter(uid=uid):
            cookbook = {}
            cookbook['uid'] = uid
            cookbook['cookbook_id'] = i.id
            cookbook['cookbook_name'] = i.name
            cookbook['cookbook_des'] = i.description
            cookbook['recipes'] = []
            for j in models.Cookbook.objects.filter(cid=i.id):
                recipe = util.get_single_recipe(uid, j.rid)
                cookbook['recipes'].append(recipe)
            ret.append(cookbook)

        # ret = model_to_dict(models.CookbookMetadata.objects.get(id = cookbook_id))
        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'PUT':
        # Update cookbook metadata
        request_data = util.get_request_data(request)
        cookbook = models.CookbookMetadata.objects.get(uid=request.user.id, id=request_data['id'])
        if 'name' in request_data:
            cookbook.name = request_data['name']
        if 'description' in request_data:
            cookbook.description = request_data['description']
        cookbook.save()

        # Add recipe
        if 'rid' in request_data:
            if util.check_exists(models.Cookbook, cid=request_data['id'], rid=request_data['rid']):
                return JsonResponse({'message': "This recipe is already in the cookbook"}, status=util.HTTP_200_OK)
            new_cookbook_recipe = models.Cookbook.objects.create(
                cid=request_data['id'],
                rid=request_data['rid'],
                cookbook_fk=models.CookbookMetadata.objects.get(id=request_data['id']),
                recipe_fk=models.Recipe.objects.get(id=request_data['rid']))
            new_cookbook_recipe.save()

        return JsonResponse({'message': 'Cookbook updated successfully'}, status=util.HTTP_200_OK)

    elif request.method == 'DELETE':

        request_data = util.get_request_data(request)
        cookbook_id = request_data['id']
        recipes_deleted = []
        recipes_not_deleted = []

        # Delete specific recipes from cookbook
        if 'rid' in request_data:

            for recipe in request_data['rid']:
                if util.check_exists(models.Cookbook, cid=cookbook_id, rid=recipe):
                    recipes_deleted.append(recipe)
                    models.Cookbook.objects.get(cid=cookbook_id, rid=recipe).delete()
                else:
                    recipes_not_deleted.append(recipe)

            return JsonResponse(
                {
                    'message': 'Recipes deleted from cookbook successfully.',
                    'cid': cookbook_id,
                    'deleted_recipes': recipes_deleted,
                    'non_deleted_recipes': recipes_not_deleted
                },
                status=util.HTTP_200_OK)

        # Delete all recipes from cookbook and cookbook itself
        else:

            if not util.check_exists(models.CookbookMetadata, id=cookbook_id, uid=request.user.id):
                return JsonResponse({'message': "A cookbook with that id doesn't exist in the database"},
                                    status=util.HTTP_404_NOT_FOUND)

            for i in models.Cookbook.objects.filter(cid=cookbook_id):
                models.Cookbook.objects.get(cid=cookbook_id, rid=i.rid).delete()
                recipes_deleted.append(i.rid)
            models.CookbookMetadata.objects.get(id=cookbook_id, uid=request.user.id).delete()
            return JsonResponse(
                {
                    'message': 'Cookbook deleted successfully.',
                    'cid': cookbook_id,
                    'deleted_recipes': recipes_deleted,
                    'non_deleted_recipes': recipes_not_deleted
                },
                status=util.HTTP_200_OK)
    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET'])
def cookbook_list(request):
    """
    Function that gets a lists of cookbook ids associated with a user.
    """
    if request.method == 'GET':

        ret = {}
        ret['cookbook'] = []
        for i in models.CookbookMetadata.objects.filter(uid=request.user.id):
            ret['cookbook'].append(i.id)

        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET'])
def recipe_list_trending(request):
    """
    This case is to show a news feed for users that have not logged in.
    It shows the most liked recipes.
    """
    request_data = util.get_request_data(request)
    trending = util.new_and_trending()
    trending = sorted(trending, key=lambda x: (x[0]), reverse=True)
    ret = []

    for recipe in trending[:RECIPE_LIMIT]:
        ret.append(util.get_single_recipe(request.user.id, recipe[1]))
        # ret.append(recipe[0])
    return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)


@require_http_methods(['GET'])
def recipe_list_feed(request):
    """
    This case is to show a users news feed once they have logged in.
    It shows new recipes from subscribed contributor sorted by date modified and likes.
    """
    request_data = util.get_request_data(request)
    user_id = request.user.id
    recipes = []
    # List of contributors user is subscribed to
    for contributor in models.Subscribed.objects.filter(u1=user_id):
        contributor_id = contributor.u2

        # Calculate total number of likes user has to that contributor
        total_user_likes = util.calc_total_user_likes(user_id, contributor_id)

        # Loop through all recipes for the contributor and pull in needed information
        for recipe in models.Recipe.objects.filter(uid=contributor_id):
            recipe_id = recipe.id
            update_date = recipe.modified_date
            all_likes = util.calc_total_likes(recipe_id)
            recipes.append([contributor_id, recipe_id, total_user_likes, all_likes, update_date])

    if len(recipes) == 0:
        # Show trending recipes if not subscribed to a contributor
        # trending = util.new_and_trending()
        # recipes = sorted(trending, key=lambda x: (x[0]), reverse=True)
        recipes = []
    else:
        # Sort recipes based on modified date, then total_user_likes, then all likes
        recipes = sorted(recipes, key=lambda x: (x[4], x[2], x[3]), reverse=True)

    # Output recipe details
    ret = []
    for recipe in recipes[:RECIPE_LIMIT]:
        ret.append(util.get_single_recipe(request.user.id, recipe[1]))
        # ret.append(recipe[1])

    return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)


@require_http_methods(['GET'])
def recipe_list_search(request):
    """
    Basic search which takes in a query string and attempts to match on it
    """
    request_data = util.get_request_data(request)
    query = request_data['search_query']
    seen = set()
    ret = []

    # The use of a set and list was intentional to ensure recipes are returned based on their relevance
    # Priority of fields:
    # name
    # cuisine
    # cooking_style
    # meal_type
    # tags
    # ingredients
    # method (least relevant)

    for i in models.Recipe.objects.filter(name__icontains=query):
        if i.id not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.id))
            seen.add(i.id)

    # search on recipe cuisine
    for i in models.Recipe.objects.filter(cuisine__icontains=query):
        if i.id not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.id))
            seen.add(i.id)

    # search on recipe cooking_style
    for i in models.Recipe.objects.filter(cooking_style__icontains=query):
        if i.id not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.id))
            seen.add(i.id)

    # search on recipe meal_type
    for i in models.Recipe.objects.filter(meal_type__icontains=query):
        if i.id not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.id))
            seen.add(i.id)

    # search on meal-type
    for i in models.Tags.objects.filter(tag__icontains=query):
        if i.rid not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.rid))
            seen.add(i.rid)

    # search on ingredients
    for i in models.Ingredients.objects.filter(ingredient__icontains=query):
        if i.rid not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.rid))
            seen.add(i.rid)

    # search on recipe method
    for i in models.Recipe.objects.filter(method__icontains=query):
        if i.id not in seen:
            ret.append(util.get_single_recipe(request.user.id, i.id))
            seen.add(i.id)

    return JsonResponse(ret[:RECIPE_LIMIT], status=util.HTTP_200_OK, safe=False)


@require_http_methods(['GET'])
def recipe_list_advanced_search(request):
    """
    advanced search returns recipes which match all the parameters
    available filter options include:
    - cuisine
    - cooking_style
    - meal_type
    - time_low <= time <= time_high
    - protein_low <= protein <= protein_high
    - carbs_low <= carbs <= carbs_high
    - calories_low <= calories <= calories_high
    - fats_low <= fats <= fats_high
    - tag
    - ingredient
    """
    request_data = util.get_request_data(request)
    query = {}

    recipes = models.Recipe.objects.filter()

    def filter_on_all_items(recipes, field, items):
        tmp = []
        for i in items:
            kwargs = {field + '__icontains': i}
            tmp.append(recipes.filter(**kwargs))
        unioned = tmp[0]
        for i in tmp:
            unioned = unioned | i

        return unioned

    if 'cuisine' in request_data and request_data['cuisine']:
        cuisine_list = [i.strip() for i in request_data['cuisine'].split(',')]
        recipes = filter_on_all_items(recipes, 'cuisine', cuisine_list)

    if 'cooking_style' in request_data and request_data['cooking_style']:
        cooking_style_list = [i.strip() for i in request_data['cooking_style'].split(',')]
        recipes = filter_on_all_items(recipes, 'cooking_style', cooking_style_list)

    if 'meal_type' in request_data and request_data['meal_type']:
        meal_type_list = [i.strip() for i in request_data['meal_type'].split(',')]
        recipes = filter_on_all_items(recipes, 'meal_type', meal_type_list)

    if 'time_low' in request_data and request_data['time_low']:
        recipes = recipes.filter(time__gte=int(request_data['time_low']))

    if 'time_high' in request_data and request_data['time_high']:
        recipes = recipes.filter(time__lte=int(request_data['time_high']))

    if 'calories_low' in request_data and request_data['calories_low']:
        recipes = recipes.filter(calories__gte=int(request_data['calories_low']))

    if 'calories_high' in request_data and request_data['calories_high']:
        recipes = recipes.filter(calories__lte=int(request_data['calories_high']))

    if 'protein_low' in request_data and request_data['protein_low']:
        recipes = recipes.filter(protein__gte=int(request_data['protein_low']))

    if 'protein_high' in request_data and request_data['protein_high']:
        recipes = recipes.filter(protein__lte=int(request_data['protein_high']))

    if 'carbs_low' in request_data and request_data['carbs_low']:
        recipes = recipes.filter(carbs__gte=int(request_data['carbs_low']))

    if 'carbs_high' in request_data and request_data['carbs_high']:
        recipes = recipes.filter(carbs__lte=int(request_data['carbs_high']))

    if 'fats_low' in request_data and request_data['fats_low']:
        recipes = recipes.filter(fats__gte=int(request_data['fats_low']))

    if 'fats_high' in request_data and request_data['fats_high']:
        recipes = recipes.filter(fats__lte=int(request_data['fats_high']))

    if 'tag' in request_data and request_data['tag']:
        tag_list = [i.strip() for i in request_data['tag'].split(',')]
        tag_match_rids = set()
        for i in tag_list:
            tag_match = models.Tags.objects.filter(tag__icontains=i)
            for j in tag_match:
                tag_match_rids.add(j.rid)

        recipes = recipes.filter(id__in=tag_match_rids)

    if 'ingredient' in request_data and request_data['ingredient']:
        ingredient_list = [i.strip() for i in request_data['ingredient'].split(',')]
        ingredient_match_rids = set()
        for i in ingredient_list:
            ingredient_match = models.Ingredients.objects.filter(ingredient__icontains=i)
            for j in ingredient_match:
                ingredient_match_rids.add(j.rid)

        recipes = recipes.filter(id__in=ingredient_match_rids)

    ret = []
    for i in recipes:
        ret.append(util.get_single_recipe(request.user.id, i.id))
    return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)


@require_http_methods(['GET', 'POST', 'DELETE'])
def recipe_like(request):
    request_data = util.get_request_data(request)

    if request.method == 'GET':

        return JsonResponse(
            {
                'user_rating': util.get_user_like(request.user.id, request_data['rid']),
                'total_rating': util.calc_total_likes(request_data['rid'])
            },
            status=util.HTTP_200_OK)

    elif request.method == 'POST':

        if util.check_exists(models.RecipeLikes, uid=request.user.id, rid=request_data['rid']):
            obj = models.RecipeLikes.objects.get(uid=request.user.id, rid=request_data['rid'])
            obj.opinion = request_data['opinion']
        else:
            obj = models.RecipeLikes.objects.create(uid=request.user.id,
                                                    rid=request_data['rid'],
                                                    opinion=request_data['opinion'],
                                                    user_fk=request.user,
                                                    recipe_fk=models.Recipe.objects.get(id=request_data['rid']))

        obj.save()
        return JsonResponse({'message': 'Like/dislike recorded'}, status=util.HTTP_200_OK)

    elif request.method == 'DELETE':
        if util.check_exists(models.RecipeLikes, uid=request.user.id, rid=request_data['rid']):
            models.RecipeLikes.objects.get(uid=request.user.id, rid=request_data['rid']).delete()

        return JsonResponse({'message': 'Like/dislike deleted successfully'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['POST', 'GET', 'DELETE'])
# This endpoint is for users to subscribe to contributors. It allows for:
# POST - for a user to subscribe to a contributor
# GET - fetch all contributor ids that a user is subscribed to
# DELETE - unsubscribe from a contributor
def subscribe(request):

    if request.method == 'POST':
        request_data = util.get_request_data(request)
        subscribed_to = request_data['subscribed_to']
        user_id = request.user.id

        if not util.check_exists(models.User, id=subscribed_to):
            return JsonResponse({'message': "A user with that id doesn't exist in the database"}, status=util.HTTP_404_NOT_FOUND)

        else:
            if util.check_exists(models.Subscribed, u1=user_id, u2=subscribed_to):
                return JsonResponse({'message': str(user_id) + ' already subscribed to ' + str(subscribed_to)},
                                    status=util.HTTP_200_OK)
            else:
                subscribed = models.Subscribed.objects.create(u1=user_id,
                                                              u2=subscribed_to,
                                                              u1_fk=request.user,
                                                              u2_fk=models.User.objects.get(id=subscribed_to))
                subscribed.save()

        return JsonResponse({'message': str(user_id) + ' subscribed to ' + str(subscribed_to)}, status=util.HTTP_201_CREATED)

    elif request.method == 'GET':
        user_id = request.user.id
        ret = []

        for i in models.Subscribed.objects.filter(u1=user_id):
            user_name = models.User.objects.get(id=i.u2).username
            ret.append({'id': i.u2, 'name': user_name})
            # ret.append(i.u2)
        return JsonResponse({'subscribed': ret}, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'DELETE':
        request_data = util.get_request_data(request)
        unsubscribe = request_data["unsubscribe"]
        user_id = request.user.id

        if not util.check_exists(models.User, id=unsubscribe):
            return JsonResponse({'message': "A user with that id doesn't exist in the database"}, status=util.HTTP_404_NOT_FOUND)

        else:
            if util.check_exists(models.Subscribed, u1=user_id, u2=unsubscribe):
                models.Subscribed.objects.get(u1=user_id, u2=unsubscribe).delete()
            else:
                return JsonResponse({'message': str(user_id) + ' not subscribed to ' + str(unsubscribe)}, status=util.HTTP_200_OK)

        return JsonResponse({'message': str(user_id) + ' unsubscribed from ' + str(unsubscribe)}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET', 'PUT', 'DELETE'])
def shopping_list_recipes(request):
    """
    this endpoint is for users to get all recipes and ingredients in their shopping list
    - GET fetches a list of recipes and ingredients in those recipes that are on the shopping list
    - PUT updates the recipe servings (add, amend, delete recipe) and adjusts the ingredients on those recipes accordingly
    - DELETE deletes all recipe and ingredient information from a users shopping list
    """
    if request.method == 'GET':
        uid = request.user.id
        ret = []

        # pull in all recipes and their ingredients
        for recipe in models.ShoppingListRecipes.objects.filter(uid=uid):
            data = {}
            rid = recipe.rid
            data['recipe'] = {**util.get_single_recipe(uid, recipe.rid), **model_to_dict(recipe)}
            data['ingredients'] = []
            if util.check_exists(models.ShoppingListIngredients, uid=uid, rid=rid):
                for ingredient in models.ShoppingListIngredients.objects.filter(uid=uid, rid=rid):
                    data['ingredients'].append(model_to_dict(ingredient))
            ret.append(data)

        # add on extra ingredients not associated with a recipe
        data = {}
        data['recipe'] = {}
        data['ingredients'] = []
        if util.check_exists(models.ShoppingListIngredients, uid=uid, rid__isnull=True):
            for ingredient in models.ShoppingListIngredients.objects.filter(uid=uid, rid__isnull=True):
                data['ingredients'].append(model_to_dict(ingredient))
            ret.append(data)

        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'PUT':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data['rid']
        servings = request_data['servings']

        # delete recipe and all ingredients
        if servings == 0:
            # delete all ingredients for this recipe
            for ingredient in models.ShoppingListIngredients.objects.filter(rid=rid):
                models.ShoppingListIngredients.objects.get(id=ingredient.id).delete()

            # delete recipe
            if not util.check_exists(models.ShoppingListRecipes, rid=rid):
                return JsonResponse({'message': 'Recipe not in shopping list'}, status=util.HTTP_200_OK)

            models.ShoppingListRecipes.objects.get(rid=rid).delete()
            return JsonResponse({'message': 'Recipe ' + str(rid) + ' deleted.'}, status=util.HTTP_200_OK)

        else:

            # add recipe
            if not util.check_exists(models.ShoppingListRecipes, uid=uid, rid=rid):

                # add recipe...
                new_shopping_list_recipe = models.ShoppingListRecipes.objects.create(uid=uid,
                                                                                     rid=rid,
                                                                                     servings=servings,
                                                                                     user_fk=request.user,
                                                                                     recipe_fk=models.Recipe.objects.get(id=rid))
                new_shopping_list_recipe.save()

                #...then add ingredients
                for ingredient in models.Ingredients.objects.filter(rid=rid):
                    recipe_serving = models.Recipe.objects.get(id=rid).servings
                    user_serving = servings
                    multiplier = float(user_serving) / float(recipe_serving)
                    recipe_id = ingredient.rid
                    quantity = ingredient.quantity * multiplier
                    units = ingredient.units
                    name = ingredient.ingredient.lower()
                    new_shopping_list_ingredient = models.ShoppingListIngredients.objects.create(
                        uid=uid,
                        rid=recipe_id,
                        quantity=quantity,
                        units=units,
                        ingredient=name,
                        user_fk=request.user,
                        recipe_fk=models.Recipe.objects.get(id=rid))
                    new_shopping_list_ingredient.save()

                return JsonResponse({'message': 'Recipe ' + str(rid) + ' added.'}, status=util.HTTP_201_CREATED)

            # amend recipe
            # amend shopping list recipe...
            shopping_list_recipe = models.ShoppingListRecipes.objects.get(uid=uid, rid=rid)
            shopping_list_recipe.servings = servings
            shopping_list_recipe.save()

            # ...then delete all ingredients...
            for ingredient in models.ShoppingListIngredients.objects.filter(rid=rid):
                models.ShoppingListIngredients.objects.get(id=ingredient.id).delete()

            #...before adding in amended ingredients
            for ingredient in models.Ingredients.objects.filter(rid=rid):
                recipe_serving = models.Recipe.objects.get(id=rid).servings
                user_serving = servings
                multiplier = float(user_serving) / float(recipe_serving)
                recipe_id = ingredient.rid
                quantity = ingredient.quantity * multiplier
                units = ingredient.units
                name = ingredient.ingredient.lower()
                new_shopping_list_ingredient = models.ShoppingListIngredients.objects.create(
                    uid=uid,
                    rid=recipe_id,
                    quantity=quantity,
                    units=units,
                    ingredient=name,
                    user_fk=request.user,
                    recipe_fk=models.Recipe.objects.get(id=rid))
                new_shopping_list_ingredient.save()

            return JsonResponse({'message': 'Recipe ' + str(rid) + ' amended.'}, status=util.HTTP_200_OK)

    elif request.method == 'DELETE':
        uid = request.user.id

        # delete all entries in ShoppingListIngredients
        for ingredient in models.ShoppingListIngredients.objects.filter(uid=uid):
            models.ShoppingListIngredients.objects.get(id=ingredient.id).delete()

        # delete all entries in ShoppingListRecipes
        for recipe in models.ShoppingListRecipes.objects.filter(uid=uid):
            models.ShoppingListRecipes.objects.get(id=recipe.id).delete()

        return JsonResponse({'message': 'All recipes and ingredients removed from shopping list.'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['POST', 'GET', 'PUT', 'DELETE'])
def shopping_list_ingredients(request):
    """
    this endpoint is for users to aggregate ingredients in their shopping list
    - POST - add an ingredient into a recipe on shopping list
    - GET - get aggregated list of ingredients from recipes and ingredients in shopping list
    - PUT - amend ingredient in recipe on shopping list
    - DELETE - delete ingredient in recipe on shopping list
    """
    if request.method == 'POST':
        request_data = util.get_request_data(request)
        uid = request.user.id
        if 'rid' in request_data:
            rid = request_data['rid']
        else:
            rid = None
        ingredient_list = request_data['ingredients']
        for ingredient in ingredient_list:
            quantity = ingredient['quantity']
            units = ingredient['units']
            name = ingredient['ingredient'].lower()
            if rid:
                new_shopping_list_ingredient = models.ShoppingListIngredients.objects.create(
                    uid=uid,
                    rid=rid,
                    quantity=quantity,
                    units=units,
                    ingredient=name,
                    user_fk=request.user,
                    recipe_fk=models.Recipe.objects.get(id=rid))
            else:
                new_shopping_list_ingredient = models.ShoppingListIngredients.objects.create(uid=uid,
                                                                                             rid=rid,
                                                                                             quantity=quantity,
                                                                                             units=units,
                                                                                             ingredient=name,
                                                                                             user_fk=request.user)
            new_shopping_list_ingredient.save()

        return JsonResponse({'message': 'Ingredients added to recipe ' + str(rid)}, status=util.HTTP_200_OK)

    elif request.method == 'GET':
        # aggregate all ingredients in all recipes in shopping list
        uid = request.user.id
        total_ingredients = []

        # check if there are ingredients to aggregate
        if not util.check_exists(models.ShoppingListIngredients, uid=uid):
            return JsonResponse(total_ingredients, status=util.HTTP_200_OK, safe=False)

        # loop through all ingredients
        for ingredient in models.ShoppingListIngredients.objects.filter(uid=uid):
            total_ingredients = util.aggregate_list(total_ingredients, ingredient)

        # adjust to largest unit of measurement
        total_ingredients = util.adjust_units(total_ingredients)

        return JsonResponse(total_ingredients, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'PUT':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data['rid']
        ingredient_list = json.loads(request_data['ingredients'])

        for ingredient in ingredient_list:
            iid = ingredient['id']
            shopping_list_ingredient = models.ShoppingListIngredients.objects.get(id=iid)
            shopping_list_ingredient.quantity = ingredient['quantity']
            shopping_list_ingredient.units = ingredient['units']
            shopping_list_ingredient.ingredient = ingredient['ingredient'].lower()
            shopping_list_ingredient.save()

        return JsonResponse({'message': 'Recipe ' + str(rid) + ' ingredients amended.'}, status=util.HTTP_200_OK)

    elif request.method == 'DELETE':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data['rid']
        ingredient_list = request_data['id']

        for ingredient in ingredient_list:
            models.ShoppingListIngredients.objects.get(id=ingredient).delete()

        return JsonResponse({'message': 'Recipe ' + str(rid) + ' ingredients deleted.'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['POST', 'GET', 'PUT', 'DELETE'])
def comments(request):
    """
    this endpoint is for users to comment on a recipe
    - POST - post a comment on a recipe
    - GET - get all recipe comments
    - PUT - amend comment on a recipe
    - DELETE - delete comment on a recipe
    """
    if request.method == 'POST':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data["rid"]

        # check if recipe exists...
        if not util.check_exists(models.Recipe, id=rid):
            return JsonResponse({"message": "Recipe does not exist."}, status=util.HTTP_404_NOT_FOUND)

        #...if so then add comment to it
        new_comment = models.Comment.objects.create(**request_data,
                                                    uid=uid,
                                                    user_fk=request.user,
                                                    recipe_fk=models.Recipe.objects.get(id=rid))
        new_comment.save()

        return JsonResponse({"message": "Commented on recipe " + str(rid)}, status=util.HTTP_201_CREATED)

    elif request.method == 'GET':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data["rid"]
        ret = []

        for comment in models.Comment.objects.filter(rid=rid):
            user_comment = model_to_dict(comment)
            user_comment['username'] = model_to_dict(models.User.objects.get(id=user_comment['uid']))['username']
            ret.append(user_comment)

        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    elif request.method == 'PUT':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data["rid"]
        cid = request_data["cid"]

        if not util.check_exists(models.Comment, id=cid, rid=rid, uid=uid):
            return JsonResponse({"message": "Comment does not exist."}, status=util.HTTP_404_NOT_FOUND)

        comment = models.Comment.objects.get(id=cid, rid=rid, uid=uid)
        comment.comment = request_data["comment"]
        comment.save()

        return JsonResponse({'message': 'Comment ' + str(cid) + ' amended.'}, status=util.HTTP_200_OK)

    elif request.method == 'DELETE':
        request_data = util.get_request_data(request)
        uid = request.user.id
        rid = request_data["rid"]
        cid = request_data["cid"]

        if not util.check_exists(models.Comment, id=cid, rid=rid, uid=uid):
            return JsonResponse({"message": "Comment does not exist."}, status=util.HTTP_404_NOT_FOUND)

        models.Comment.objects.get(id=cid, rid=rid, uid=uid).delete()
        return JsonResponse({'message': 'Comment ' + str(cid) + ' deleted.'}, status=util.HTTP_200_OK)

    else:
        return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['GET'])
def recommendation(request):
    """
    Recommendation which takes a recipe id and returns a list of recipes closest to that recipe.
    It excludes recipes that don't have any ingredients in common.
    It ranks the remaining recipes based on the Levenshtein distance.
    """

    if request.method == 'GET':
        request_data = util.get_request_data(request)
        ret = []
        query_ingredients = []
        recommendation_universe = set()

        for ingredient in models.Ingredients.objects.filter(rid=request_data['rid']):
            # get a list of ingredients in query recipe
            query_ingredients.append(ingredient.ingredient)

            # get a list of rids in the recommendation universe
            # these are recipes with at least one common ingredient
            for recipe in models.Ingredients.objects.filter(ingredient=ingredient.ingredient):
                if recipe.rid != int(request_data['rid']):
                    recommendation_universe.add(recipe.rid)

        for rid in list(recommendation_universe):
            recommendation = util.get_single_recipe(request.user.id, rid)

            # create a list of ingredients in recommended recipe
            recommended_ingredients = []
            for ingredient in models.Ingredients.objects.filter(rid=rid):
                recommended_ingredients.append(ingredient.ingredient)

            # calculate levenshtein distance between query ingredients and recommended recipe
            recommendation['score'] = fuzz.token_set_ratio(query_ingredients, recommended_ingredients)

            ret.append(recommendation)

        # sort based on highest score
        ret = sorted(ret, key=lambda x: x['score'], reverse=True)

        return JsonResponse(ret[:RECIPE_LIMIT], status=util.HTTP_200_OK, safe=False)

    return HttpResponseNotAllowed(permitted_methods=[])


@require_http_methods(['POST'])
def meal_plan(request):
    """
    Meal takes an object of:
    number of people - number of people that the meal plan is for
    number of days - number of days the meal plan if for
    meal type - a list of meal types that the meal plan is for
    preferences - a list of preferences that the meal type should follow. This includes: ingredients, cooking style, cuisine, name and tags.
    avoidances - a list of types of meals to exclude from the meal plan. This includes: ingredients, cooking style, cuisine, name and tags
    The meal plan will take the above inputs and return a list of recipes for each meal type required.
    The list of recipes will be ranked based on the closest to the users preferences.
    """

    if request.method == 'POST':
        request_data = util.get_request_data(request)
        people = int(request_data['number_of_people'])
        days = int(request_data['number_of_days'])
        # meals = [i.lower() for i in json.loads(request_data['meal_type'])]
        meals = [i.lower() for i in request_data['meal_type']]
        ret = {}
        meal_plan_universe = []

        # get preferences
        name_preferences = [i.lower() for i in request_data['preferences']['name']]
        cooking_style_preferences = [i.lower() for i in request_data['preferences']['cooking_style']]
        cuisine_preferences = [i.lower() for i in request_data['preferences']['cuisine']]
        tags_preferences = [i.lower() for i in request_data['preferences']['tags']]
        ingredients_preferences = [i.lower() for i in request_data['preferences']['ingredients']]

        # get avoidances
        name_avoidances = [i.lower() for i in request_data['avoidances']['name']]
        cooking_style_avoidances = [i.lower() for i in request_data['avoidances']['cooking_style']]
        cuisine_avoidances = [i.lower() for i in request_data['avoidances']['cuisine']]
        tags_avoidances = [i.lower() for i in request_data['avoidances']['tags']]
        ingredients_avoidances = [i.lower() for i in request_data['avoidances']['ingredients']]

        # check if user has inputted necessary fields
        if len(meals) <= 0:
            return JsonResponse({'message': 'No meals returned. Add at least one meal type.'}, status=util.HTTP_400_BAD_REQUEST)

        if people <= 0:
            return JsonResponse({'message': 'No meals returned. Add at least one person.'}, status=util.HTTP_400_BAD_REQUEST)

        if days <= 0:
            return JsonResponse({'message': 'No meals returned. Add at least one day.'}, status=util.HTTP_400_BAD_REQUEST)
        # add recipes to universe
        for recipe in models.Recipe.objects.filter():
            recipe_tags = []
            recipe_ingredients = []
            for tag in models.Tags.objects.filter(rid=recipe.id):
                recipe_tags.append(tag.tag.lower())
            for ingredient in models.Ingredients.objects.filter(rid=recipe.id):
                recipe_ingredients.append(ingredient.ingredient.lower())

            # exclude recipes in database based on user avoidance input
            if (recipe.meal_type.lower() in meals) and (recipe.name.lower() not in name_avoidances) and (
                    recipe.cooking_style.lower()
                    not in cooking_style_avoidances) and (recipe.cuisine.lower() not in cuisine_avoidances) and (not any(
                        tag in recipe_tags for tag in tags_avoidances)) and (not any(tag in recipe_ingredients
                                                                                     for tag in ingredients_avoidances)):

                # for recipes that meet all criteria calculate preference score
                name_score = 100
                cooking_style_score = 100
                cuisine_score = 100
                tags_score = 100
                ingredients_score = 100
                if len(name_preferences) > 0:
                    name_score = fuzz.partial_ratio(name_preferences, [recipe.name])
                if len(cooking_style_preferences) > 0:
                    cooking_style_score = fuzz.partial_ratio(cooking_style_preferences, [recipe.cooking_style])
                if len(cuisine_preferences) > 0:
                    cuisine_score = fuzz.partial_ratio(cuisine_preferences, [recipe.cuisine])
                if len(tags_preferences) > 0:
                    tags_score = fuzz.partial_ratio(tags_preferences, recipe_tags)
                if len(ingredients_preferences) > 0:
                    ingredients_score = fuzz.partial_ratio(ingredients_preferences, recipe_ingredients)

                total_score = name_score + cooking_style_score + cuisine_score + tags_score + ingredients_score
                meal_plan_universe.append(
                    [recipe.id, total_score, name_score, cooking_style_score, cuisine_score, tags_score, ingredients_score])

        # sort recipes
        meal_plan_universe = sorted(meal_plan_universe, key=lambda x: x[1], reverse=True)

        # create output
        ret = {}
        # for meal in json.loads(request_data['meal_type']):
        for meal in request_data['meal_type']:
            ret[meal] = []

        for meal_plan in meal_plan_universe:
            meal_plan_recipe = util.get_single_recipe(request.user.id, meal_plan[0])
            recipe = models.Recipe.objects.get(id=meal_plan[0])
            meal_plan_recipe['score'] = meal_plan[1]
            ret[recipe.meal_type].append(meal_plan_recipe)

        return JsonResponse(ret, status=util.HTTP_200_OK, safe=False)

    return HttpResponseNotAllowed(permitted_methods=[])
