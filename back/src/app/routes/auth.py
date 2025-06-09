from flask              import Blueprint, request, jsonify
from flask_login        import login_user, logout_user, login_required, current_user
from ..models           import UserDB
from ..                 import db

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    '''Registering the user'''
    data = request.get_json()
    if UserDB.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 409

    user = UserDB(username=data['username']) # type: ignore
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    '''Logging the user in'''
    data = request.get_json()
    user = UserDB.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Wrong username or password"}), 401

    login_user(user)
    return jsonify({"msg": "Logged in successfully"}), 200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    '''Logging the user out'''
    logout_user()
    return jsonify({"msg": "Logged out"}), 200