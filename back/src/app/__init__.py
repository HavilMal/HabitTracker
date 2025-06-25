from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from app.serializer import CustomJSONProvider

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'  # type: ignore


def create_app() -> Flask:
    """Creates and initializes the app"""
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    app.json = CustomJSONProvider(app)
    CORS(app, origins="http://localhost:3000", supports_credentials=True)

    db.init_app(app)
    login_manager.init_app(app)

    from app.models import UserDB
    @login_manager.user_loader
    def load_user(user_id: str) -> UserDB | None:
        """Loads current user data from the database"""
        return UserDB.query.get(int(user_id))

    register_blueprints(app=app)
    with app.app_context():
        db.create_all()

    return app


def register_blueprints(app: Flask) -> None:
    """Registers all required blueprints"""
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    from .routes.food_route import food_bp
    app.register_blueprint(food_bp, url_prefix='/api')

    # from .routes.activity_route import activity_bp
    # app.register_blueprint(activity_bp, url_prefix='/api')

    from .routes.habits_route import habit_bp
    app.register_blueprint(habit_bp, url_prefix='/api')
