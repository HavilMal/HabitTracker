# from flask       import Blueprint, request, jsonify
# from flask_login import login_required, current_user
# from datetime    import datetime
#
# from back.src.app         import db
# from back.src.app.models  import HabitActivityDB
#
#
# activity_bp = Blueprint('activity', __name__)
#
#
# @activity_bp.route('add-activity', methods=['POST'])
# @login_required
# def add_activity():
#     '''Adding activity to the database'''
#     data = request.get_json()
#
#     try:
#         activity = HabitActivityDB(
#             name=data['name'],
#             freq_type=data['freq_type'],
#             unit=data['unit'],
#             target_value=float(data['target_value']),
#             notes=data['notes'],
#             user_id=current_user.uid
#         )
#
#         db.session.add(activity)
#         db.session.commit()
#
#         return jsonify({"msg": "Activity added successfully"}), 201
#     except (ValueError, KeyError) as e :
#         return jsonify({'error': str(e)}), 400
#
#
# @activity_bp.route('/activities', methods=['GET'])
# @login_required
# def get_activities():
#     '''Getting activities from the database'''
#     try:
#         activities = HabitActivityDB.query.filter_by(user_id=current_user.uid).all()
#         result     = []
#         for a in activities:
#             result.append({
#                 "id":       a.activity_id,
#                 "type":     a.exercise_type,
#                 "duration": a.duration_mins,
#                 "calories": a.calories_burnt,
#                 "date":     a.date.isoformat()
#             })
#
#         return jsonify(result), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500