class Config:
    SECRET_KEY                     = 'my-super-secret'
    JWT_SECRET_KEY                 = 'my-super-secret-jwt'
    SQLALCHEMY_DATABASE_URI        = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False