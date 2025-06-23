from flask                   import Blueprint, request, jsonify
from flask_login             import login_required

from app                     import db
from app.utils.food_database import fetch_product, create_meal

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
