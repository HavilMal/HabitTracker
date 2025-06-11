from flask                   import Blueprint, request, jsonify
from flask_login             import login_required

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
    meal      = MealDB(name=name)

    db.session.add(meal)

    for item in items:
        nutr = item['nutrients']
        food = FoodDB(
            name=item['product_name'],
            calories=nutr.get('energy_kcal', 0),
            carb=nutr.get('carbohydrates', 0),
            prot=nutr.get('proteins', 0),
            fat=nutr.get('fat', 0),
            grams=item.get('grams', 100),
            meal=meal,
            user_id=current_user.uid
        )
        db.session.add(food)
    
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