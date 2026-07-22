from __future__ import annotations

from app.core.environment import Environment
from app.core.exceptions import NotFoundException
from app.core.settings import (
    APP_NAME,
    APP_VERSION,
    DEFAULT_ENVIRONMENT
)


class HealthService:

    @staticmethod
    def get_status() -> dict:
        """
        Return application health information.
        """

        return {
            "application": APP_NAME,
            "version": APP_VERSION,
            "environment": Environment.get(
                "FLASK_ENV",
                DEFAULT_ENVIRONMENT,
            ),
            "status": "healthy",
        }