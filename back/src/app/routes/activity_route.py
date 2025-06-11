from flask       import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime    import datetime

from app         import db
from app.models  import ActivityDB


activity_bp = Blueprint('activity', __name__)


@activity_bp.route('add-activity', methods=['POST'])
@login_required
def add_activity():
    '''Adding activity to the database'''
    data = request.get_json()

    try:
        exercise_type = data['exercise_type']
        duration_mins = float(data['duration_mins'])
        calories_burnt = float(data['calories_burnt'])
        date_str = data.get('date')
        date = datetime.fromisoformat(date_str) if date_str else datetime.now()
        activity = ActivityDB(
            exercise_type=exercise_type,
            duration_mins=duration_mins,
            calories_burnt=calories_burnt,
            date=date,
            name=exercise_type,
            notes='',
            user_id=current_user
        )

        db.session.add(activity)
        db.session.commit()

        return jsonify({"msg": "Activity added successfully"}), 201
    except (ValueError, KeyError) as e :
        return jsonify({'error': str(e)}), 400
    

@activity_bp.route('/activities', methods=['GET'])
@login_required
def get_activities():
    '''Getting activities from the database'''
    try:
        activities = ActivityDB.query.order_by(ActivityDB.date.desc()).all()
        result     = []
        for a in activities:
            result.append({
                "id":       a.activity_id,
                "type":     a.exercise_type,
                "duration": a.duration_mins,
                "calories": a.calories_burnt,
                "date":     a.date.isoformat()
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500