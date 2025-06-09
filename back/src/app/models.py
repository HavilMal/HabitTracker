from flask_login       import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from .                 import db
from logic.meal        import Meal
from logic.food        import Food
from typing            import cast


class UserDB(UserMixin, db.Model):
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
    

class FoodDB(db.Model):
    '''Class representing food in the database'''
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(255), nullable=False)
    calories = db.Column(db.Float, nullable=False)
    carb     = db.Column(db.Float, nullable=False)
    prot     = db.Column(db.Float, nullable=False)
    fat      = db.Column(db.Float, nullable=False)
    grams    = db.Column(db.Float, nullable=False)
    meal_id  = db.Column(db.Integer, db.ForeignKey('meal_db.id'))

    def to_dataclass(self) -> Food:
        '''Converting info from database to a Food class object'''
        return Food(self.name, self.calories, self.carb, self.prot, self.fat)
    

class MealDB(db.Model):
    '''Class representing a meal in the database'''
    id    = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(255), nullable=False)
    foods = db.relationship('FoodDB', backref='meal', lazy=True)

    def to_dataclass(self) -> Meal:
        '''Converting info from database to a Meal class object'''
        list_foods = cast(list[FoodDB], self.foods)
        return Meal(
            self.name, 
            [(food.to_dataclass(), food.grams) for food in list_foods]
        )
