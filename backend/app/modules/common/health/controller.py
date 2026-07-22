from __future__ import annotations
from app.core.responses import ApiResponse
from .service import HealthService


class HealthController:

    @staticmethod
    def get_health():
        """
        Return application health.
        """

        data = HealthService.get_status()

        return ApiResponse.success(
            message="Application is healthy.",
            data=data,
        )