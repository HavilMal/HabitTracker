from flask       import Blueprint, request, jsonify
from flask_login import login_required

from app         import db
from app.models  import HabitBoolDB, HabitMeasureDB, HabitDrinkingWaterDB

habit_bp = Blueprint('habit', __name__)


@habit_bp.route('/add-habit', methods=['POST'])
@login_required
def add_habit():
    data = request.get_json()
    habit_type = data.get('type')  # 'bool', 'measure', 'water'

    try:
        name = data['name']
        notes = data.get('notes', '')

        if habit_type == 'bool':
            habit = HabitBoolDB(
                name=name,
                freq_type=data['freq_type'],
                freq_value=int(data['freq_value']),
                notes=notes
            )
        
        elif habit_type == 'measure':
            habit = HabitMeasureDB(
                name=name,
                freq_type=data['freq_type'],
                unit=data['unit'],
                target_value=float(data['target_value']),
                target_type=data['target_type'],
                notes=notes
            )

        elif habit_type == 'water':
            habit = HabitDrinkingWaterDB(
                name=name,
                target_value=int(data['target_value']),
                notes=notes
            )

        else:
            return jsonify({"error": "Invalid habit type"}), 400

        db.session.add(habit)
        db.session.commit()
        return jsonify({"msg": "Habit added"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
