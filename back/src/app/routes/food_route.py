from datetime                import datetime, timezone

from flask                   import Blueprint, request, jsonify
from flask_login             import login_required, current_user

from app.models              import MealDB, FoodDB
from app                     import db
from app.utils.food_database import fetch_product

food_bp = Blueprint('food', __name__)


@food_bp.route('/add-meal', methods=['POST'])
@login_required
def add_meal():
    data      = request.get_json()
    name      = data.get('name')
    items     = data.get('foods')

    if not name or not items:
        return jsonify({'error': "Missing `name` or `foods`"}), 400

    create_meal(name=name, foods=items)
    db.session.commit()
    return jsonify({'msg': "Meal saved"})


@food_bp.route('/search-food', methods=['GET'])
@login_required
def search_food():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': "Missing search term"}), 400
    
    result = fetch_product(query)
    if result:
        return jsonify(result)
    
    return jsonify({'error': "No product found"}), 404


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