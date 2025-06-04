from flask             import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from .models           import User
from .                 import db


def register_user():
    data     = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    user            = User(username=username, password=hashed_password) # type: ignore
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201


def login_user():
    data     = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user     = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful'}), 200