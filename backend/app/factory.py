"""
Flask Application Factory

Creates and configures the Flask application.

"""

from __future__ import annotations

from flask import Flask

from app.core.config import CONFIG_MAP
from app.core.environment import Environment
from app.extensions import init_extensions
from app.core.settings import DEFAULT_ENVIRONMENT, API_PREFIX
from app.core.handlers import register_exception_handlers
from app.core.database import test_database_connection

from app.modules.common.health import health_bp


def create_app() -> Flask:
    """
    Create and configure the Flask application.
    """

    app = Flask(__name__)

    # -----------------------------------------------------
    # Load Configuration
    # -----------------------------------------------------

    environment = Environment.get(
        "FLASK_ENV",
        DEFAULT_ENVIRONMENT,
    )

    config = CONFIG_MAP.get(environment)

    if config is None:
        raise RuntimeError(
            f"Unknown environment: {environment}"
        )

    app.config.from_object(config)

    # -----------------------------------------------------
    # Initialize Extensions & Error handlers
    # -----------------------------------------------------

    init_extensions(app)
    from app import models
    
    register_exception_handlers(app)
    if app.config.get("SQLALCHEMY_DATABASE_URI"):
        with app.app_context():
            test_database_connection()
    # -----------------------------------------------------
    # Blueprint Registrations 
    # -----------------------------------------------------

    app.register_blueprint(
        health_bp,
        url_prefix = API_PREFIX
    )
    return app