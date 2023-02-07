# ScrumLegends COMP9900 IT Project

![logo](./logo.png)

## Team

- Matthew Notarangelo (z5116928) [Scrum Master]
- Andrew Cvetko (z3330071) [Developer]
- Han-Hsin Lin (z5335464) [Developer]
- Almersy Xing (z5339661) [Developer]
- Kexin Zhao (z5278385) [Developer]

## Project Structure

```sh
# Tree directory structure for ScrumLegends FaceCookBook
# Unimportant files have been excluded for conciseness.

root
├── backend
│   ├── app
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── models.py   # Django database models/schema
│   │   ├── tests.py
│   │   ├── urls.py     # Django URL routing for function based views
│   │   ├── util.py     # Utility/helper functions for views
│   │   └── views.py    # API endpoint implementations
│   ├── config # Django admin configuration settings
│   │   ├── ...
│   │   └── settings.py # Django settings config
│   ├── .gitignore
│   ├── manage.py
│   └── testing # Pytest testing files
│       ├── assets # Testing assets
│       │   ├── fish.jpg
│       │   ├── nachos.jpg
│       │   ├── sashimi.jpg
│       │   ├── spaghetti.jpg
│       │   ├── spaghettios.jpg
│       │   └── steak.jpg
│       ├── dummy_data.py # Script for populating database with random recipes
│       ├── test_advanced_search.py
│       ├── test_comments.py
│       ├── test_cookbooks.py
│       ├── test_likes_dislikes.py
│       ├── test_meal_plan.py
│       ├── test_news_feed.py
│       ├── test_recipe_list.py
│       ├── test_recommendations.py
│       ├── test_shopping_list.py
│       ├── test_subscribe.py
│       ├── test_tags.py
│       ├── test_user_data.py
│       ├── test_user_profile.py
│       └── util.py # Helper class for testing files
├── dev_flush_db.py
├── diary # Weekly journal entries for each member
│   ├── z3330071.txt
│   ├── z5116928.md
│   ├── z5278385.txt
│   ├── z5335464.md
│   └── z5339661.txt
├── docs # Github Pages static html pages
│   ├── cookbook2.html
│   ├── cookbook.html
│   ├── index.html
│   ├── recipe2.html
│   └── recipe.html
├── documentation # Project documentation
│   └── API_documentation.yaml # Open API specification file from Stoplight
├── frontend
│   ├── .eslintrc.json # Eslint config
│   ├── .gitignore
│   ├── logo.svg
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── API # Utility files for calling endpoints
│       │   ├── AuthRequests.js
│       │   ├── DataRequests.js
│       │   ├── MealPlanRequests.js
│       │   ├── ShoppingRequests.js
│       │   └── SubscribeRequests.js
│       ├── App.css # Global CSS overrides
│       ├── App.js # Base App file
│       ├── asset
│       │   └── ... # Static assets
│       ├── component
│       │   ├── AddCookbook.js
│       │   ├── AdvanceSearch.js
│       │   ├── AppBar.js
│       │   ├── AutoSnackbar.js
│       │   ├── CommonComponent.js
│       │   ├── CookbookCard.js
│       │   ├── CreateCookbook.js
│       │   ├── DividerLine.js
│       │   ├── FoodCard.js
│       │   ├── FoodCardSecond.js
│       │   ├── Footer.js
│       │   ├── Header.js
│       │   ├── InputText.js
│       │   ├── PopupCard.js
│       │   ├── ScrollTop.js
│       │   ├── SearchBar.js
│       │   ├── ShareButtons.js
│       │   ├── SignIn.js
│       │   └── Title.js
│       ├── config.js # util file for calling endpoints
│       ├── index.css # global css overrides
│       ├── index.js # start point
│       ├── logo.svg
│       ├── page
│       │   ├── CookbookName.js
│       │   ├── CreateRecipe.js
│       │   ├── ErrorPage.js
│       │   ├── Homepage.js
│       │   ├── MealPlan.js
│       │   ├── MealPlanResult.js
│       │   ├── MoreRecommendation.js
│       │   ├── MyCookbooks.js
│       │   ├── MyNewsFeed.js
│       │   ├── MyRecipes.js
│       │   ├── SearchingResult.js
│       │   ├── ShoppingList.js
│       │   ├── Subscriptions.js
│       │   ├── Trending.js
│       │   ├── UserProfile.js
│       │   └── ViewRecipe.js
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       └── utils
│           └── helpers.js # more util files
├── .github
│   └── workflows
│       ├── prettier.yml # Javascript formatter for Github actions workflow
│       └── yapf.yml # Python formatter for Github actions workflow
├── .gitignore
├── logo.png # project logo
├── README.md
├── requirements.txt # python dependencies
├── start_app.sh # Script to start the application
└── .style.yapf # Formatting style config for yapf.yml
```

# Installing and running the project

## Requirements

- Python 3.9 or higher (https://www.python.org/downloads/)
- Node.js (>=16.16.0) and npm (>=8.11.0) (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- A stable internet connection
- `keys.json` Nutritionix API keys in root folder of project. Contact ScrumLegends for access

## Starting the Application

Please refer to the report in the documentation folder for details.

## Usage via API only

Please refer to the API documentation for endpoint details.

### Python

```py
# Log user in
import requests
session = requests.Session()
resp = session.post('http://127.0.0.1:3001/app/users/login/', json={"email": 'matt@email.com', "password": 'password_goes_here'})
print(resp.json())
```

### Command Line Interface

```bash
curl -X POST -F 'email=matt@email.com' -F 'password=password_goes_here' http://127.0.0.1:3001/app/users/login/
```

## How to use the application

Refer to User Manual.pdf under the documentation folder.

## API Documentation

Refer to https://scrumlegends.stoplight.io/docs/scrumlegends
