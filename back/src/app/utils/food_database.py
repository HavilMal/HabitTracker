import requests, os
from datetime      import datetime, timezone

from flask_login   import current_user

from app.config        import Config
from app           import db
from app.models    import MealDB, FoodDB
from app.constants import *


db_api_key = Config.DB_API_KEY


def get_product_details(product_id: int) -> dict | None:
    '''Returns kcal and nutrients of the product with given id'''
    if not db_api_key:
        raise RuntimeError("DB_API_KEY is not set")
    
    url      = f"{DB_URL}/food/{product_id}"
    params   = {'api_key': db_api_key}
    response = requests.get(url, params=params)
    if not response.ok:
        return None
    
    data      = response.json()
    nutrients = {}

    for nutrient in data.get('foodNutrients', []):
        name  = nutrient.get('nutrientName', '').lower()
        value = nutrient.get('value', 0)
        unit  = nutrient.get('unitName', '')

        if DB_ENERGY in name and DB_ENERGY_UNIT in unit.lower():
            nutrients[CALORIES] = value
        elif DB_CARB in name:
            nutrients[CARB] = value
        elif DB_PROT in name:
            nutrients[PROT] = value
        elif DB_FAT in name or FAT in name:
            nutrients[FAT] = value

    return {
        'name': data.get(DB_FOOD_DESC, 'Unknown'),
        'nutrients': nutrients
    }


def fetch_products(query: str) -> list[dict]:
    '''Fetches food list from the database'''
    if not db_api_key:
        raise RuntimeError("DB_API_KEY is not set")
    
    url    = f"{DB_URL}/foods/search"
    params = {
        'query':    query,
        'pageSize': DB_PAGE_SIZE,
        'api_key':  db_api_key
    }
    response = requests.get(url, params=params)
    if not response.ok:
        return []
    
    foods = response.json().get('foods', [])
    return [{
        DB_FOOD_ID:    item.get(DB_FOOD_ID),
        DB_FOOD_DESC:  item.get(DB_FOOD_DESC),
        DB_FOOD_BRAND: item.get(DB_FOOD_BRAND, ''),
        DB_FOOD_SCORE: item.get(DB_FOOD_SCORE, 0)
    } for item in foods]


def create_meal(name: str, foods: list[dict], habit_id: int | None = None, created_at: datetime | None = None) -> MealDB:
    if created_at is None:
        created_at = datetime.now(timezone.utc)

    meal = MealDB(name=name, user_id=current_user.uid, habit_id=habit_id, created_at=created_at)
    db.session.add(meal)
    db.session.flush()

    for item in foods:
        food = FoodDB(
            name=item.get('product_name', 'Unknown'),
            calories=item.get(CALORIES, 0),
            carb=item.get(CARB, 0),
            prot=item.get(PROT, 0),
            fat=item.get(FAT, 0),
            grams=item.get('grams', 100),
            meal_id=meal.meal_id
        )
        db.session.add(food)

    return meal