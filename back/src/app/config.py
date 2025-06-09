class Config:
    '''SQLAlchemy configuration class'''
    SECRET_KEY                     = 'my-super-secret'
    SQLALCHEMY_DATABASE_URI        = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False