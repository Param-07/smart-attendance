from __future__ import annotations

from flask import Flask

from app.core.exceptions import AppException
from app.core.responses import ApiResponse

def register_exception_handlers(app: Flask) -> None:

    @app.errorhandler(AppException)
    def handle_app_exception(error: AppException):

        return ApiResponse.error(
            message= error.message,
            errors= {
                "code": error.error_code
            },
            status_code= error.status_code
        )
    @app.errorhandler(Exception)
    def handle_unexpected_exception(error: Exception):

        return ApiResponse.internal_server_error(
            message= "An unexpected error occourred"
        )