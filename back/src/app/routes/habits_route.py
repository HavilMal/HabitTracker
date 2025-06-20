import datetime
from flask       import Blueprint, request, jsonify
from flask_login import login_required, current_user

from back.src.app         import db
from back.src.app.models import HabitBoolDB, HabitMeasureDB, HabitDrinkingWaterDB, HabitMealDB, HabitActivityDB, \
    HabitBoolCompletionDB, HabitDB, MeasurementFloatDB, MeasurementIntDB, MeasurementActivityDB

habit_bp = Blueprint('habit', __name__)


@habit_bp.route('/add-habit', methods=['POST'])
@login_required
def add_habit():
    data = request.get_json()
    habit_type = data.get('type')  # 'bool', 'measure', 'water', 'meal', 'activity'

    if habit_type not in {'bool', 'measure', 'water', 'meal', 'activity'}:
        return jsonify({"error": "Invalid habit type"}), 400

    try:
        name = data['name']
        notes = data.get('notes', '')

        if habit_type == 'bool':
            habit = HabitBoolDB(
                name=name,
                freq_type=data['freq_type'],
                freq_value=int(data['freq_value']),
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )
        
        elif habit_type == 'measure':
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

        elif habit_type == 'water':
            habit = HabitDrinkingWaterDB(
                name=name,
                target_value=int(data['target_value']),
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        elif habit_type == 'meal':
            habit = HabitMealDB(
                name=name,
                target_value=float(data['target_value']),
                target_data_unit=data['target_data_unit'],
                target_type=data['target_type'],
                notes=notes,
                habit_type=habit_type,
                user_id=current_user.uid
            )

        elif habit_type == 'activity':
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

        return jsonify({
            "bool":     habits_to_list(habits_bool),
            "measure":  habits_to_list(habits_measure),
            "water":    habits_to_list(habits_water),
            "meal":     habits_to_list(habits_meal),
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@habit_bp.route('/habit/<int:habit_id>/entry', methods=['POST'])
@login_required
def add_habit_entry(habit_id):
    """
    Endpoint to add “one entry” to any habit subtype.
    JSON differs by habit_type:
      - habit_bool:    { "date": "YYYY-MM-DD" }
      - habit_measure: { "date": "YYYY-MM-DD", "amount": 12.5 }
      - habit_water:   { "date": "YYYY-MM-DD", "amount": 2 }
      - habit_activity:{ "activity_datetime": "...", "amount": 5.2, "duration_seconds": 3600, "calories": 300 }
      - habit_meal:
    """
    data = request.get_json() or {}

    habit = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()
    if not habit:
        return jsonify({"error": "Habit not found or not yours"}), 404

    habit_type = habit.habit_type  # 'bool', 'measure', 'water', 'activity', 'meal'

    if habit_type == 'bool':
        date_completion = data.get('date')
        if not date_completion:
            return jsonify({"error": "`date` is required for boolean habits"}), 400
        try:
            date_form = datetime.datetime.strptime(date_completion, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error":"invalid `date`, use YYYY-MM-DD"}), 400

        existing = HabitBoolCompletionDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            return jsonify({"message": "Already marked"}), 200

        row = HabitBoolCompletionDB(habit_id=habit_id, date=date_form)
        db.session.add(row)

    elif habit_type == 'measure':
        date_completion = data.get('date')
        amount = data.get('amount')

        if date_completion is None or amount is None:
            return jsonify({"error":"`date` and `amount` required"}), 400
        try:
            date_form = datetime.datetime.fromisoformat(date_completion)
        except ValueError:
            return jsonify({"error":"invalid `date`, use ISO8601"}), 400

        existing = MeasurementFloatDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            return jsonify({"message": "Already with measurement"}), 200

        row = MeasurementFloatDB(habit_id=habit_id, date=date_form, amount=float(amount))
        db.session.add(row)

    elif habit_type == 'water':
        date_completed = data.get('date')
        amount = data.get('amount')
        if date_completed is None or amount is None:
            return jsonify({"error":"`date` and `amount` required"}), 400
        try:
            date_form = datetime.datetime.fromisoformat(date_completed)
        except ValueError:
            return jsonify({"error":"invalid `date`, use ISO8601"}), 400

        existing = MeasurementIntDB.query.filter_by(habit_id=habit_id, date=date_form).first()
        if existing:
            return jsonify({"message": "Already with measurement"}), 200

        row = MeasurementIntDB(habit_id=habit_id, date=date_form, amount=int(amount))
        db.session.add(row)

    elif habit_type == 'activity':
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

        row = MeasurementActivityDB(
            habit_id=habit_id,
            activity_datetime=dt,
            amount=amount,
            duration_seconds=dur,
            calories=cal
        )
        db.session.add(row)

    elif habit_type == 'meal':
        ...
        #todo implement meal adding

    else:
        return jsonify({"error": f"Unsupported habit_type: {habit_type}"}), 400

    db.session.commit()
    return jsonify({"message": "Entry recorded", "habit_type": habit_type}), 201


@habit_bp.route('/habit/<int:habit_id>/notes', methods=['POST'])
@login_required
def edit_notes(habit_id):
    data = request.get_json()
    new_notes = data.get('notes', '').strip()

    if new_notes is None:
        return jsonify({'error': 'Missing "notes" in request'}), 400

    habit = HabitDB.query.filter_by(habit_id=habit_id, user_id=current_user.uid).first()

    if not habit:
        return jsonify({'error': 'Habit not found or not authorized'}), 404

    habit.notes = new_notes
    db.session.commit()

    return jsonify({'message': 'Notes updated successfully', 'habit_id': habit_id, 'notes': habit.notes}), 200
