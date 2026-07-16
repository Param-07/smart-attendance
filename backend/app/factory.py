"""
Flask Application Factory

Creates and configures the Flask application.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from __future__ import annotations

from flask import Flask

from app.core.config import CONFIG_MAP
from app.core.environment import Environment
from app.extensions import init_extensions
from app.core.settings import DEFAULT_ENVIRONMENT


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
    # Initialize Extensions
    # -----------------------------------------------------

    init_extensions(app)

    return app