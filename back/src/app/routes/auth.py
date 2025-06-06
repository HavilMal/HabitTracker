from flask              import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..models           import User
from ..                 import db

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 409

    user = User(username=data['username']) # type: ignore
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Bad username or password"}), 401

    token = create_access_token(identity=user.id)
    return jsonify(access_token=token), 200