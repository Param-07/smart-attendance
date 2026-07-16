"""
Flask Configuration

Contains configuration classes for different
application environments.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from __future__ import annotations

from app.core.environment import Environment
from app.core.settings import (
    APP_NAME,
    APP_VERSION,
)


class BaseConfig:
    """
    Base configuration shared by all environments.
    """

    # --------------------------------------------------
    # Application
    # --------------------------------------------------

    APP_NAME = APP_NAME
    APP_VERSION = APP_VERSION

    SECRET_KEY = Environment.require("SECRET_KEY")

    # --------------------------------------------------
    # JWT
    # --------------------------------------------------

    JWT_SECRET_KEY = Environment.require("JWT_SECRET_KEY")

    # --------------------------------------------------
    # Database
    # --------------------------------------------------

    database_url = Environment.get("DATABASE_URL")

    SQLALCHEMY_DATABASE_URI = (
        database_url if database_url else None
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --------------------------------------------------
    # Upload
    # --------------------------------------------------

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024


class DevelopmentConfig(BaseConfig):
    """Development configuration."""

    DEBUG = True


class TestingConfig(BaseConfig):
    """Testing configuration."""

    TESTING = True


class ProductionConfig(BaseConfig):
    """Production configuration."""

    DEBUG = False

CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}