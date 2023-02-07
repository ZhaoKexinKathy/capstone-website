from django.db import models
from django.contrib.auth.models import User

# class User(models.Model):
#     """
#     This model is generated automatically by Django and so it exists here for documentation purposes only
#     """
#     id = automatically generated
#     username = models.CharField(max_length=50)
#     password = models.CharField(max_length=50)
#     email = models.CharField(max_length=50)


class Subscribed(models.Model):
    """
    Denotes that user u1 is subscribed to user u2
    """
    # id = automatically generated
    u1 = models.IntegerField()
    u2 = models.IntegerField()

    # Foreign key relationships
    u1_fk = models.ForeignKey(User, related_name='User1_foreign_key', on_delete=models.CASCADE, editable=False)
    u2_fk = models.ForeignKey(User, related_name='User2_foreign_key', on_delete=models.CASCADE, editable=False)


class Recipe(models.Model):
    """
    Recipe data storage
    """
    # id = automatically generated
    uid = models.IntegerField()
    name = models.CharField(max_length=50, blank=False)
    cuisine = models.CharField(max_length=50, blank=False)
    cooking_style = models.CharField(max_length=50, blank=False)
    meal_type = models.CharField(max_length=50, blank=False)
    time = models.IntegerField(default=0)
    method = models.CharField(max_length=100, blank=False)
    plating = models.CharField(max_length=100, blank=False)
    servings = models.IntegerField(default=1)
    image = models.ImageField(upload_to='images/', default=None)
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fats = models.FloatField(default=0)
    created_date = models.DateField(auto_now_add=True)
    modified_date = models.DateField(auto_now=True)

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)


class Tags(models.Model):
    # id = automatically generated
    rid = models.IntegerField()
    tag = models.CharField(max_length=30)

    # Foreign key relationships
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


# is it better to just replace this with a string?
class Ingredients(models.Model):
    # id = automatically generated
    rid = models.IntegerField()
    quantity = models.FloatField()
    units = models.CharField(max_length=20)
    ingredient = models.CharField(max_length=50)

    # Foreign key relationships
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


class Comment(models.Model):
    # id = automatically generated
    rid = models.IntegerField()
    uid = models.IntegerField()
    comment = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


class RecipeLikes(models.Model):
    # id = automatically generated
    uid = models.IntegerField()
    rid = models.IntegerField()
    opinion = models.BooleanField(default=True)  # true for like, false for dislike??

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


class CommentLikes(models.Model):
    # id = automatically generated
    uid = models.IntegerField()
    cid = models.IntegerField()

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    comment_fk = models.ForeignKey(Comment, on_delete=models.CASCADE, editable=False)


class CookbookMetadata(models.Model):
    # id = automatically generated
    name = models.CharField(max_length=50, blank=False)
    uid = models.IntegerField()
    description = models.CharField(max_length=100)

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)


class Cookbook(models.Model):
    # id = automatically generated
    cid = models.IntegerField()
    rid = models.IntegerField()

    # Foreign key relationships
    cookbook_fk = models.ForeignKey(CookbookMetadata, on_delete=models.CASCADE, editable=False)
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


# class ShoppingListMetadata(models.Model):
#     # id = automatically generated
#     name = models.CharField(max_length=50, blank=False)
#     uid = models.IntegerField()

#     # Foreign key relationships
#     user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)

# class ShoppingList(models.Model):
#     # id = automatically generated
#     slid = models.IntegerField()
#     rid = models.IntegerField()
#     servings = models.IntegerField()

#     # Foreign key relationships
#     sl_fk = models.ForeignKey(ShoppingListMetadata, on_delete=models.CASCADE, editable=False)
#     recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


class ShoppingListRecipes(models.Model):
    # id = automatically generated
    uid = models.IntegerField()
    rid = models.IntegerField()
    servings = models.IntegerField()

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False)


class ShoppingListIngredients(models.Model):
    # id = automatically generated
    uid = models.IntegerField()
    rid = models.IntegerField(null=True)
    quantity = models.FloatField()
    units = models.CharField(max_length=20)
    ingredient = models.CharField(max_length=50)

    # Foreign key relationships
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    recipe_fk = models.ForeignKey(Recipe, on_delete=models.CASCADE, editable=False, null=True)
