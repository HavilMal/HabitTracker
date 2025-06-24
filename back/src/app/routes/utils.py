import datetime

from flask import jsonify, Response
from flask_login import current_user

from app.models import HabitDB
from app.logic.habit import Habit

def check_entity_id(entity_id) -> tuple[Response, int] | None:
    if entity_id is None:
        return jsonify({'error': 'Missing id in request'}), 400

    try:
        int(entity_id)
        return None
    except (ValueError, TypeError):
        return jsonify({'error': '`id` must be an integer'}), 400


def get_habit(data, to_dataclass=True) -> Habit | tuple[Response, int] | HabitDB:
    habit_id = data.get('habit_id')

    habit_id_check = check_entity_id(habit_id)

    if habit_id_check is not None:
        return habit_id_check

    habit_db = HabitDB.query.filter_by(habit_id=int(habit_id), user_id=current_user.uid).first()

    if not habit_db:
        return jsonify({'error': 'Habit not found or not authorized'}), 404

    if to_dataclass:
        return habit_db.to_dataclass()

    return habit_db


def check_entry_date(start_date, entry_date):
    if not entry_date:
        return True

    if isinstance(start_date, datetime.datetime):
        start_date = start_date.date()

    if isinstance(entry_date, datetime.datetime):
        entry_date = entry_date.date()

    return start_date <= entry_date
