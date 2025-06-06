from flask_login       import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from .                 import db


class User(UserMixin, db.Model):
    '''Class representing an user in the database'''
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password: str) -> None:
        '''Setting the password'''
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        '''Checking for the password match'''
        return check_password_hash(self.password_hash, password)
