from flask import Blueprint, request, jsonify
from flask_login import login_required

from app import db
from app.utils.food_database import fetch_products, get_product_details, create_meal

food_bp = Blueprint('food', __name__)


@food_bp.route('/add-meal', methods=['POST'])
@login_required
def add_meal():
    data = request.get_json()
    name = data.get('name')
    items = data.get('foods')

    if not name or not items:
        return jsonify({'error': "Missing `name` or `foods`"}), 400

    create_meal(name=name, foods=items)
    db.session.commit()
    return jsonify({'msg': "Meal saved"}), 200


@food_bp.route('/search-food', methods=['GET'])
@login_required
def search_food():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': "Missing search term"}), 400

    products = fetch_products(query)
    if products:
        return jsonify(products), 200

    return jsonify({'error': "No product found"}), 404


@food_bp.route('/food/<int:fdc_id>', methods=['GET'])
@login_required
def get_food_details(fdc_id):
    details = get_product_details(fdc_id)
    if not details:
        return jsonify({'error': "Product not found"}), 404

    return jsonify(details), 200
