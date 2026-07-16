"""
Flask Extensions

Initializes all third-party Flask extensions.

The extensions are created here but are not bound to the
Flask application until create_app() is called.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# ==========================================================
# Database
# ==========================================================

db = SQLAlchemy()

# ==========================================================
# Database Migration
# ==========================================================

migrate = Migrate()

# ==========================================================
# Authentication
# ==========================================================

jwt = JWTManager()

bcrypt = Bcrypt()

# ==========================================================
# Cross-Origin Resource Sharing
# ==========================================================

cors = CORS()

# ==========================================================
# Extension Initialization
# ==========================================================

def init_extensions(app):
    """
    Initialize all Flask extensions.
    """

    if app.config.get("SQLALCHEMY_DATABASE_URI"):
        db.init_app(app)
        migrate.init_app(app, db)

    jwt.init_app(app)

    bcrypt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": "*"
            }
        },
    )