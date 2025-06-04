from flask import Blueprint
from .auth import register_user, login_user

bp = Blueprint('api', __name__)
bp.route('/register', methods=['POST'])(register_user)
bp.route('/login', methods=['POST'])(login_user)