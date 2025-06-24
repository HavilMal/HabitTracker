import datetime

from dataclasses import asdict

from flask       import Blueprint, request, jsonify
from flask_login import login_required, current_user

from app.routes.food_route import create_meal
from app                   import db
from app.models            import HabitBoolDB, HabitMeasureDB, HabitDrinkingWaterDB, HabitMealDB, HabitActivityDB, \
    HabitBoolCompletionDB, HabitDB, MeasurementFloatDB, MeasurementIntDB, MeasurementActivityDB, MealDB

from app.constants import *

habit_bp = Blueprint('habit', __name__)


@habit_bp.route('/add-habit', methods=['POST'])
@login_required
def add_habit():
    data = request.get_json()
    habit_type = data.get('type')  # 'bool', 'measure', 'water', 'meal', 'activity'

    if habit_type not in {BOOL, MEASURE, WATER, MEAL, ACTIVITY}:
        return jsonify({"error": "Invalid habit type"}), 400

    try:
        name = data['name']
        notes = data.get('notes', '')

        if habit_type == BOOL:
            habit = HabitBoolDB(
                name=name,
                freq_type=data['freq_type'],
                freq_value=int(data['freq_value']),
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )
        
        elif habit_type == MEASURE:
            habit = HabitMeasureDB(
                name=name,
                freq_type=data['freq_type'],
                unit=data['unit'],
                target_value=float(data['target_value']),
                target_type=data['target_type'],
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        elif habit_type == WATER:
            habit = HabitDrinkingWaterDB(
                name=name,
                target_value=int(data['target_value']),
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        elif habit_type == MEAL:
            habit = HabitMealDB(
                name=name,
                target_value=float(data['target_value']),
                target_data_unit=data['target_data_unit'],
                target_type=data['target_type'],
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        elif habit_type == ACTIVITY:
            habit = HabitActivityDB(
                name=name,
                freq_type=data['freq_type'],
                unit=data['unit'],
                target_value=float(data['target_value']),
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        db.session.add(habit)
        db.session.commit()
        return jsonify({"msg": "Habit added successfully"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


def habits_to_list(habits):
    serialized = []
    for h in habits:
        dc = h.to_dataclass()
        data = dc.__dict__.copy()
        data['type']         = h.__mapper_args__['polymorphic_identity']
        data['start_date']   = dc.start_date.isoformat()
        data['id']           = h.habit_id
        serialized.append(data)

    return serialized


@habit_bp.route('/get-habits', methods=['GET'])
@login_required
def get_habits():
    try:
        habits_bool     = HabitBoolDB.query.filter_by(user_id=current_user.uid).all()
        habits_measure  = HabitMeasureDB.query.filter_by(user_id=current_user.uid).all()
        habits_water    = HabitDrinkingWaterDB.query.filter_by(user_id=current_user.uid).all()
        habits_meal     = HabitMealDB.query.filter_by(user_id=current_user.uid).all()
        habits_activity = HabitActivityDB.query.filter_by(user_id=current_user.uid).all()

        return jsonify({
            "bool":     habits_to_list(habits_bool),
            "measure":  habits_to_list(habits_measure),
            "water":    habits_to_list(habits_water),
            "meal":     habits_to_list(habits_meal),
            "activity": habits_to_list(habits_activity),
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@habit_bp.route('/habit/entry', methods=['POST'])
@login_required
def add_habit_entry():
    """
    Endpoint to add “one entry” to any habit subtype.
    JSON differs by habit_type:
      - habit_bool:     { "date": "YYYY-MM-DD" }
      - habit_measure:  { "date": "YYYY-MM-DD", "amount": 12.5 }
      - habit_water:    { "date": "YYYY-MM-DD", "amount": 2 }
      - habit_activity: { "activity_datetime": "...", "amount": 5.2, "duration_seconds": 3600, "calories": 300 }
      - habit_meal:     {  }
    """
    data = request.get_json() or {}
    habit_id = data.get('habit_id')

    if not habit_id:
        return jsonify({"error": "Missing habit_id"}), 400

    try:
        habit_id = int(habit_id)
    except (ValueError, TypeError):
        return jsonify({'error': '`habit_id` must be an integer'}), 400

    habit = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()
    if not habit:
        return jsonify({"error": "Habit not found or not yours"}), 404

    habit_type = habit.habit_type  # 'bool', 'measure', 'water', 'activity', 'meal'
    message = ''

    if habit_type == BOOL:
        date_completion = data.get('date')
        if not date_completion:
            return jsonify({"error": "`date` is required for boolean habits"}), 400
        try:
            date_form = datetime.datetime.strptime(date_completion, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error":"invalid `date`, use YYYY-MM-DD"}), 400

        existing = HabitBoolCompletionDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            db.session.delete(existing)
            message = 'Entry toggled'
        else:
            row = HabitBoolCompletionDB(habit_id=habit_id, date=date_form)
            db.session.add(row)
            message = 'Entry recorded'

    elif habit_type == MEASURE:
        date_completion = data.get('date')
        amount = data.get('amount')

        if date_completion is None or amount is None:
            return jsonify({"error":"`date` and `amount` required"}), 400
        try:
            date_form = datetime.datetime.fromisoformat(date_completion)
        except ValueError:
            return jsonify({"error":"invalid `date`, use ISO8601"}), 400

        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return jsonify({"error": "amount must be a number"}), 400

        existing = MeasurementFloatDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            existing.amount = amount
            message = 'Entry modified'
        else:
            row = MeasurementFloatDB(habit_id=habit_id, date=date_form, amount=amount)
            db.session.add(row)
            message = 'Entry recorded'

    elif habit_type == WATER:
        date_completed = data.get('date')
        amount = data.get('amount')
        if date_completed is None or amount is None:
            return jsonify({"error":"`date` and `amount` required"}), 400
        try:
            date_form = datetime.datetime.fromisoformat(date_completed)
        except ValueError:
            return jsonify({"error":"invalid `date`, use ISO8601"}), 400

        try:
            amount = int(amount)
        except (ValueError, TypeError):
            return jsonify({"error": "amount must be a number"}), 400

        existing = MeasurementIntDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            existing.amount = amount
            message = 'Entry modified'
        else:
            row = MeasurementIntDB(habit_id=habit_id, date=date_form, amount=amount)
            db.session.add(row)
            message = 'Entry recorded'

    elif habit_type == ACTIVITY:
        try:
            dt_iso = data['activity_datetime']
            amount = float(data['amount'])
            dur    = float(data['duration_seconds'])
            cal    = float(data['calories'])
        except KeyError:
            return jsonify({"error":"`activity_datetime, amount, duration_seconds, calories` required"}), 400
        except ValueError:
            return jsonify({"error":"`amount, duration_seconds, calories` must be numbers"}), 400

        try:
            dt = datetime.datetime.fromisoformat(dt_iso)
        except ValueError:
            return jsonify({"error":"invalid `activity_datetime`, use ISO8601"}), 400

        existing = MeasurementActivityDB.query.filter_by(habit_id=habit_id, activity_datetime=dt).first()

        if existing:
            existing.amount = amount
            existing.duration_seconds = dur
            existing.calories = cal
            message = 'Entry modified'
        else:
            row = MeasurementActivityDB(
                habit_id=habit_id,
                activity_datetime=dt,
                amount=amount,
                duration_seconds=dur,
                calories=cal
            )
            db.session.add(row)
            message = 'Entry recorded'

    elif habit_type == MEAL:
        try:
            name = data['name']
            foods = data['foods']
            created_at = data.get('created_at')

        except KeyError as e:
            return jsonify({"error": f"Missing field: {str(e)}"}), 400

        if not isinstance(foods, list) or not foods:
                return jsonify({"error": "`foods` must be a non-empty list"}), 400

        try:
            dt = datetime.datetime.fromisoformat(created_at) if created_at else None
        except ValueError:
            return jsonify({"error": "Invalid `created_at`, use ISO8601"}), 400

        create_meal(name=name, foods=foods, habit_id=habit_id, created_at=dt)

    else:
        return jsonify({"error": f"Unsupported habit_type: {habit_type}"}), 400

    db.session.commit()
    return jsonify({"message": message, "habit_type": habit_type}), 201


@habit_bp.route('/habit/notes', methods=['POST'])
@login_required
def edit_notes():
    data = request.get_json()
    habit_id = data.get('habit_id')
    new_notes = data.get('notes', '').strip()

    if new_notes is None or habit_id is None:
        return jsonify({'error': 'Missing data in request'}), 400

    try:
        habit_id = int(habit_id)
    except (ValueError, TypeError):
        return jsonify({'error': '`habit_id` must be an integer'}), 400

    habit = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()

    if not habit:
        return jsonify({'error': 'Habit not found or not authorized'}), 404

    habit.notes = new_notes
    db.session.commit()

    return jsonify({'message': 'Notes updated successfully', 'habit_id': habit_id, 'notes': habit.notes}), 200


@habit_bp.route('/get-meals', methods=['GET'])
@login_required
def get_meals():
    meals_db = MealDB.query.filter_by(user_id=current_user.uid).order_by(MealDB.created_at.desc()).all()

    meals = [asdict(meal_db.to_dataclass()) for meal_db in meals_db]

    return jsonify({"meals": meals}), 200


@habit_bp.route('/get-longest-streaks', methods=['GET'])
@login_required
def get_longest_streaks():
    habits_all = HabitDB.query.filter_by(user_id=current_user.uid).all()

    streaks = []
    for habit_model in habits_all:
        habit = habit_model.to_dataclass()

        start_iso, end_iso, length = habit.get_longest_streak()

        streaks.append({
            "habit_id":     habit_model.habit_id,
            "name":         habit.name,
            "start_date":   start_iso,
            "end_date":     end_iso,
            "length_days":  length
        })

    return jsonify({"streaks": streaks}), 200


@habit_bp.route('/get-habits-todo', methods=['GET'])
@login_required
def get_habits_to_do():
    habits_all = HabitDB.query.filter_by(user_id=current_user.uid).all()

    habits_to_do = []

    for habit_model in habits_all:
        habit = habit_model.to_dataclass()
        if habit.to_do():
            habits_to_do.append({'habit_id': habit_model.habit_id, 'name': habit_model.name})

    return jsonify({'habits_todo': habits_to_do}), 200


@habit_bp.route('/get-habit-history', methods=['GET'])
@login_required
def get_habit_history():
    data = request.get_json()
    habit_id = data.get('habit_id')

    if habit_id is None:
        return jsonify({'error': 'Missing data in request'}), 400

    try:
        habit_id = int(habit_id)
    except (ValueError, TypeError):
        return jsonify({'error': '`habit_id` must be an integer'}), 400

    habit_db = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()

    if not habit_db:
        return jsonify({'error': 'Habit not found or not authorized'}), 404

    habit = habit_db.to_dataclass()

    history = habit.get_history()

    return jsonify({'history': history}), 200


@habit_bp.route('/get-habits-summary', methods=['GET'])
@login_required
def get_habit_summary():
    habits_all = HabitDB.query.filter_by(user_id=current_user.uid).all()

    habits_list = [habit.to_dataclass() for habit in habits_all]

    habits_histories = [habit.get_history() for habit in habits_list]

    earliest_dates = [min(history, key=lambda x: x[0])[0] for history in habits_histories if history]
    if not earliest_dates:
        return jsonify({'summary': []}), 200

    min_date_str = min(earliest_dates)
    min_date = datetime.date.fromisoformat(min_date_str)

    curr_date = min_date
    curr_date_str = min_date.isoformat()

    today_date = datetime.date.today()

    habits_summary = []

    while curr_date <= today_date:
        current_number_of_habits = 0
        current_number_of_completions = 0

        for history in habits_histories:
            if history and history[0][0] == curr_date_str:
                current_number_of_habits += 1
                current_number_of_completions += history[0][1]
                history.pop(0)

        if current_number_of_habits == 0:
            percentage = 0.0
        else:
            percentage = round(current_number_of_completions / current_number_of_habits, 2)

        habits_summary.append({'date': curr_date_str, 'percentage': percentage})

        curr_date += datetime.timedelta(days=1)
        curr_date_str = curr_date.isoformat()

    return jsonify({'summary': habits_summary}), 200


@habit_bp.route('/get-habit-stats', methods=['GET'])
@login_required
def get_habit_stats():
    data = request.get_json()
    habit_id = data.get('habit_id')

    if habit_id is None:
        return jsonify({'error': 'Missing data in request'}), 400

    try:
        habit_id = int(habit_id)
    except (ValueError, TypeError):
        return jsonify({'error': '`habit_id` must be an integer'}), 400

    habit_db = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()

    if not habit_db:
        return jsonify({'error': 'Habit not found or not authorized'}), 404

    habit = habit_db.to_dataclass()

    habit_stats = habit.get_completion_stats()

    return jsonify({'stats': habit_stats}), 200

