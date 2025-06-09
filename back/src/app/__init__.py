from flask              import Flask
from flask_sqlalchemy   import SQLAlchemy
from flask_cors         import CORS
from flask_login        import LoginManager

db                       = SQLAlchemy()
login_manager            = LoginManager()
login_manager.login_view = 'auth.login' # type: ignore


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, origins="http://localhost:3000", supports_credentials=True) 

    db.init_app(app)
    login_manager.init_app(app)

    from app.models import UserDB
    @login_manager.user_loader
    def load_user(user_id: str) -> UserDB | None:
        return UserDB.query.get(int(user_id))

    register_blueprints(app=app)
    with app.app_context():
        db.create_all()

    return app


def register_blueprints(app: Flask) -> None:
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    from .routes.food_route import food_bp
    app.register_blueprint(food_bp, url_prefix='/api')