import requests
from datetime      import datetime, timezone

from flask_login   import current_user

from app           import db
from app.models    import MealDB, FoodDB
from app.constants import *


def fetch_product(query: str) -> dict | None:
    '''Fetches food data from a database'''
    url    = DB_URL
    params = {
        'search_terms':  query,
        'search_simple': 1,
        'action':        'process',
        'json':          1
    }

    response = requests.get(url, params=params)
    data     = response.json()

    if (data.get('products')):
        product = data['products'][0]
        nutr    = product.get('nutriments', {})
        return {
            'name':   nutr.get('product_name', 'Unknown'),
            CALORIES: nutr.get(DB_CALORIES, 0),
            CARB:     nutr.get(DB_CARB, 0),
            PROT:     nutr.get(DB_PROT, 0), 
        }

    return None


def create_meal(name: str, foods: list[dict], habit_id: int | None = None, created_at: datetime | None = None) -> MealDB:
    if created_at is None:
        created_at = datetime.now(timezone.utc)

    meal = MealDB(name=name, user_id=current_user.uid, habit_id=habit_id, created_at=created_at)
    db.session.add(meal)
    db.session.flush()

    for item in foods:
        nutr = item['nutrients']
        food = FoodDB(
            name=item['product_name'],
            calories=nutr.get('energy_kcal', 0),
            carb=nutr.get('carbohydrates', 0),
            prot=nutr.get('proteins', 0),
            fat=nutr.get('fat', 0),
            grams=item.get('grams', 100),
            meal_id=meal.meal_id
        )
        db.session.add(food)

    return meal