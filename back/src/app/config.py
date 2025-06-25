import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    """SQLAlchemy configuration class"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DB_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DB_API_KEY = os.getenv('DB_API_KEY')
