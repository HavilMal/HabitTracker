from flask_login        import UserMixin
from werkzeug.security  import generate_password_hash, check_password_hash
from typing             import cast
from datetime           import datetime, timezone

from .                  import db
from app.logic.meal     import Meal
from app.logic.food     import Food
from app.logic.habit    import *
from app.constants      import *


class UserDB(UserMixin, db.Model):
    '''Class representing an user in the database'''
    __tablename__ = 'user_db'
    uid           = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    meals         = db.relationship('MealDB', back_populates='user', lazy=True, cascade="all, delete-orphan")
    habits        = db.relationship('HabitDB', back_populates='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str) -> None:
        '''Setting the password'''
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        '''Checking for the password match'''
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return self.uid
    

class HabitDB(db.Model):
    '''Class representing a habit in the database'''
    __tablename__   = 'habit'
    habit_id        = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(255), nullable=False)
    habit_type      = db.Column(db.String(64))
    notes           = db.Column(db.Text, default='')
    start_date      = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now(timezone.utc))
    user_id         = db.Column(db.Integer, db.ForeignKey('user_db.uid'), nullable=False)
    user            = db.relationship('UserDB', back_populates='habits')

    __mapper_args__ = {
        'polymorphic_identity': 'habit',
        'polymorphic_on':       habit_type
    }


class HabitBoolDB(HabitDB):
    '''Class representing a marked habit in the database'''
    __tablename__   = 'habit_bool'
    habit_id        = db.Column(db.Integer, db.ForeignKey('habit.habit_id'), primary_key=True)
    freq_type       = db.Column(db.String(64))
    freq_value      = db.Column(db.Integer)
    completions     = db.relationship('HabitBoolCompletionDB', backref='habit', lazy=True)
    __mapper_args__ = {'polymorphic_identity': BOOL}

    def to_dataclass(self) -> HabitBool:
        '''Converts this database object to a HabitBool dataclass'''
        habit = HabitBool(
            self.name,
            self.start_date,
            self.freq_type,
            self.freq_value, 
            self.notes
        )
        list_completions     = cast(list[HabitBoolCompletionDB], self.completions)
        habit.completed_days = [c.date.isoformat() for c in list_completions]
        return habit


class HabitBoolCompletionDB(db.Model):
    '''Class representing a single completion entry for a HabitBoolDB'''
    __tablename__ = 'habit_bool_completion'
    habit_bool_id = db.Column(db.Integer, primary_key=True)
    habit_id      = db.Column(db.Integer, db.ForeignKey('habit_bool.habit_id'))
    date          = db.Column(db.Date, nullable=False)


class HabitMeasureDB(HabitDB):
    '''Class representing a measurable habit in the database'''
    __tablename__   = 'habit_measure'
    habit_meas_id   = db.Column(db.Integer, db.ForeignKey('habit.habit_id'), primary_key=True)
    freq_type       = db.Column(db.String(64))
    unit            = db.Column(db.String(64))
    target_value    = db.Column(db.Float)
    target_type     = db.Column(db.String(32)) 
    measurements    = db.relationship('MeasurementFloatDB', backref='habit', lazy=True)
    __mapper_args__ = {'polymorphic_identity': MEASURE}

    def to_dataclass(self) -> HabitMeasure:
        '''Converts HabitMeasureDB database object to a HabitMeasure dataclass'''
        habit = HabitMeasure(
            self.name,
            self.start_date,
            self.freq_type,
            self.unit,
            self.target_value,
            self.target_type,
            self.notes
        )
        list_measurements  = cast(list[MeasurementFloatDB], self.measurements)
        habit.measurements = [
            MeasurementFloat(date=m.date, amount=m.amount).to_dict()
            for m in list_measurements
        ]
        return habit


class MeasurementFloatDB(db.Model):
    '''Class representing a float-type measurement for a HabitMeasureDB'''
    __tablename__ = 'measurement_float'
    measure_id    = db.Column(db.Integer, primary_key=True)
    habit_id      = db.Column(db.Integer, db.ForeignKey('habit_measure.habit_meas_id'))
    date          = db.Column(db.DateTime(timezone=True), default=lambda: datetime.datetime.now(timezone.utc), nullable=False)
    amount        = db.Column(db.Float, nullable=False)


class HabitDrinkingWaterDB(HabitDB):
    '''Class representing a water intake habit in the database'''
    __tablename__   = 'habit_water'
    habit_id        = db.Column(db.Integer, db.ForeignKey('habit.habit_id'), primary_key=True)
    target_value    = db.Column(db.Integer)
    measurements    = db.relationship('MeasurementIntDB', backref='habit', lazy=True)
    __mapper_args__ = {'polymorphic_identity': WATER}

    def to_dataclass(self) -> HabitDrinkingWater:
        '''Converts this database object to a HabitDrinkingWater dataclass'''
        habit = HabitDrinkingWater(
            self.name,
            self.start_date,
            self.target_value,
            self.notes
        )
        list_measurements  = cast(list[MeasurementIntDB], self.measurements)
        habit.measurements = [
            MeasurementInt(date=m.date, amount=m.amount).to_dict()
            for m in list_measurements
        ]
        return habit


class MeasurementIntDB(db.Model):
    '''Class representing an integer-type measurement for a HabitDrinkingWaterDB'''
    __tablename__ = 'measurement_int'
    measure_id    = db.Column(db.Integer, primary_key=True)
    habit_id      = db.Column(db.Integer, db.ForeignKey('habit_water.habit_id'))
    date          = db.Column(db.DateTime(timezone=True), default=lambda: datetime.datetime.now(timezone.utc), nullable=False)
    amount        = db.Column(db.Integer, nullable=False)


class HabitActivityDB(HabitDB):
    '''Class representing an activity in the database'''
    __tablename__   = 'habit_activity'
    habit_id        = db.Column(db.Integer, db.ForeignKey('habit.habit_id'), primary_key=True)
    freq_type = db.Column(db.String(64))
    unit = db.Column(db.String(64))
    target_value = db.Column(db.Float)
    measurements = db.relationship('MeasurementActivityDB', backref='habit', lazy=True)
    __mapper_args__ = {'polymorphic_identity': ACTIVITY}

    def to_dataclass(self) -> HabitActivity:
        '''Converting ActivityDB database object to an Activity dataclass'''
        habit = HabitActivity(
            self.name,
            self.start_date,
            self.freq_type,
            self.unit,
            self.target_value,
            self.notes
        )
        list_measurements = cast(list[MeasurementActivityDB], self.measurements)
        habit.measurements = [
            MeasurementActivity(activity_datetime=m.activity_datetime, amount=m.amount,
                                duration=datetime.timedelta(seconds=m.duration_seconds), calories=m.calories).to_dict()
            for m in list_measurements
        ]
        return habit


class MeasurementActivityDB(db.Model):
    '''Class representing a float-type measurement for a HabitActivityDB'''
    __tablename__       = 'measurement_activity'
    measure_id          = db.Column(db.Integer, primary_key=True)
    habit_id            = db.Column(db.Integer, db.ForeignKey('habit_activity.habit_id'))
    activity_datetime   = db.Column(db.DateTime(timezone=True), default=lambda: datetime.datetime.now(timezone.utc), nullable=False)
    amount              = db.Column(db.Float, nullable=False)
    duration_seconds    = db.Column(db.Float, nullable=False)
    calories            = db.Column(db.Float, nullable=False)


class HabitMealDB(HabitDB):
    '''Class representing a meal-eating habit int the database'''
    __tablename__    = 'habit_meal'
    habit_id         = db.Column(db.Integer, db.ForeignKey('habit.habit_id'), primary_key=True)
    target_value     = db.Column(db.Float)
    target_data_unit = db.Column(db.String(8))
    target_type      = db.Column(db.String(8))
    measurements     = db.relationship('MealDB', backref='habit', lazy=True)
    __mapper_args__  = {'polymorphic_identity': MEAL}

    def to_dataclass(self) -> HabitMeal:
        habit = HabitMeal(
            self.name,
            self.start_date,
            self.target_value,
            self.target_data_unit,
            self.target_type,
            self.notes
        )
        list_measurements  = cast(list[MealDB], self.measurements)
        habit.measurements = [m.to_dataclass() for m in list_measurements]
        return habit


class FoodDB(db.Model):
    '''Class representing food in the database'''
    food_id  = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(255), nullable=False)
    calories = db.Column(db.Float, nullable=False)
    carb     = db.Column(db.Float, nullable=False)
    prot     = db.Column(db.Float, nullable=False)
    fat      = db.Column(db.Float, nullable=False)
    grams    = db.Column(db.Float, nullable=False)
    meal_id  = db.Column(db.Integer, db.ForeignKey('meal_db.meal_id'))

    def to_dataclass(self) -> Food:
        '''Converting FoodDB database object to a Food dataclass'''
        return Food(self.name, self.calories, self.carb, self.prot, self.fat)
    

class MealDB(db.Model):
    '''Class representing a meal in the database'''
    meal_id    = db.Column(db.Integer, primary_key=True)
    habit_id   = db.Column(db.Integer, db.ForeignKey('habit_meal.habit_id'), nullable=False)
    name       = db.Column(db.String(255), nullable=False)
    foods      = db.relationship('FoodDB', backref='meal', lazy=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user_db.uid'))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.datetime.now(timezone.utc))
    user       = db.relationship('UserDB', back_populates='meals')

    def to_dataclass(self) -> Meal:
        '''Converting MealDB database object from to a Meal dataclass'''
        list_foods = cast(list[FoodDB], self.foods)
        return Meal(
            self.created_at.date(),
            self.name, 
            [(food.to_dataclass(), food.grams) for food in list_foods]
        )
