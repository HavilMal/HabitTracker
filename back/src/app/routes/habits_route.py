from flask       import Blueprint, request, jsonify
from flask_login import login_required, current_user

from app         import db
from app.models  import HabitBoolDB, HabitMeasureDB, HabitDrinkingWaterDB, HabitMealDB

habit_bp = Blueprint('habit', __name__)


@habit_bp.route('/add-habit', methods=['POST'])
@login_required
def add_habit():
    data = request.get_json()
    habit_type = data.get('type')  # 'bool', 'measure', 'water', 'meal'

    if habit_type not in {'bool', 'measure', 'water', 'meal'}:
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