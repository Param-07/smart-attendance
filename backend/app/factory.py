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
from app.modules.authentication.routes import auth_bp
from app.modules.teacher.routes import teacher_bp
from app.modules.school.route.school import school_bp
from app.modules.attendance.teacher.routes import teacher_attendance_bp
from app.modules.teacherFace.routes import teacher_face_bp

from app.cli.seed import create_super_admin

from app.core.logging import get_logger

logger = get_logger(__name__)


def create_app() -> Flask:
    """
    Create and configure the Flask application.
    """

    logger.info("Initializing Smart Attendance application.")

    app = Flask(__name__)

    app.cli.add_command(create_super_admin)

    # -----------------------------------------------------
    # Load Configuration
    # -----------------------------------------------------

    logger.info("Loading application configuration.")

    environment = Environment.get(
        "FLASK_ENV",
        DEFAULT_ENVIRONMENT,
    )

    logger.info(
        "Running in '%s' environment.",
        environment,
    )

    config = CONFIG_MAP.get(environment)

    if config is None:
        logger.critical(
            "Unknown environment '%s'.",
            environment,
        )
        raise RuntimeError(
            f"Unknown environment: {environment}"
        )

    app.config.from_object(config)

    # -----------------------------------------------------
    # Initialize Extensions
    # -----------------------------------------------------

    logger.info("Initializing Flask extensions.")

    init_extensions(app)

    # -----------------------------------------------------
    # Register Models
    # -----------------------------------------------------

    logger.info("Loading database models.")

    from app import models

    # -----------------------------------------------------
    # Register Exception Handlers
    # -----------------------------------------------------

    logger.info("Registering exception handlers.")

    register_exception_handlers(app)

    # -----------------------------------------------------
    # Test Database Connection
    # -----------------------------------------------------

    if app.config.get("SQLALCHEMY_DATABASE_URI"):

        logger.info("Testing database connection.")

        with app.app_context():

            test_database_connection()

        logger.info("Database connection established successfully.")

    # -----------------------------------------------------
    # Register Blueprints
    # -----------------------------------------------------

    logger.info("Registering application blueprints.")

    app.register_blueprint(
        health_bp,
        url_prefix=API_PREFIX,
    )

    app.register_blueprint(
        auth_bp,
        url_prefix=f"{API_PREFIX}/auth",
    )

    app.register_blueprint(
        teacher_bp,
        url_prefix=f"{API_PREFIX}/teachers",
    )

    app.register_blueprint(
        school_bp,
        url_prefix=f"{API_PREFIX}/schools",
    )

    app.register_blueprint(
        teacher_attendance_bp,
        url_prefix=f"{API_PREFIX}/attendance",
    )

    app.register_blueprint(
        teacher_face_bp,
        url_prefix=API_PREFIX,
    )

    logger.info(
        "Smart Attendance application initialized successfully."
    )

    return app