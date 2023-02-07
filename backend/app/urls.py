from django.urls import path

from . import views

urlpatterns = [
    path('test/', views.test_endpoint),
    path('user/data/', views.user_data),
    path('user/login/', views.login_user),
    path('user/signup/', views.signup_user),
    path('user/logout/', views.logout_user),
    path('user/isloggedin/', views.check_user_is_logged_in),
    path('recipe/data/', views.single_recipe_data),
    path('recipe/trending/', views.recipe_list_trending),
    path('recipe/feed/', views.recipe_list_feed),
    path('recipe/search/', views.recipe_list_search),
    path('recipe/advanced_search/', views.recipe_list_advanced_search),
    path('cookbook/data/', views.cookbook_data),
    path('cookbook/list/', views.cookbook_list),
    path('cookbook/single/', views.get_cookbook_by_cid),
    path('recipe/like/', views.recipe_like),
    path('subscribe/list/', views.subscribe),
    path('shoppinglist/recipes/', views.shopping_list_recipes),
    path('shoppinglist/ingredients/', views.shopping_list_ingredients),
    path('comment/list/', views.comments),
    path('recipe/recommendation/', views.recommendation),
    path('recipe/mealplan/', views.meal_plan),
]
